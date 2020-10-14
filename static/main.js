const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        name: '',
        text: '',
        email: null,
        password: null,
        messages: [],
        socket: null,
        auth: null,
        errors: [],
        accessToken: localStorage.getItem('user-token') || null,
        socketOptions: null
    },
    methods: {
        sendMessage() {
            this.errors = [];
            if(!this.validateInput()){
                this.errors.push('Имя или текст указаны неверно')
            }
            if(!this.errors.length) {
                const message = {
                    name: this.name,
                    text: this.text
                };
                this.socket.emit('msgToServer', message)
                this.text = ''
            }
        },
        receivedMessage(message) {
            this.messages.push(message)
        },
        validateInput() {
            return this.name && this.name.length > 0 && this.text.length > 0
        },
        validateForm(){
            return this.email && this.email.length >= 4 && this.email.length <= 20 && this.password && this.password.length >= 8 &&  this.password.length <= 20
        },
        async login(){
            this.errors = [];
            if(!this.validateForm()){
                this.errors.push('Логин должен быть от 4 до 20 символов, а пароль от 8 до 20 символов')
            }
            if(!this.errors.length){
                const { email, password } = this;
                try{
                    const response = await axios.post('http://localhost:3000/auth/signin', {
                        username: email,
                        password
                    });
                    const {accessToken} = response.data;
                    localStorage.setItem('user-token', accessToken);
                    this.accessToken = accessToken;
                    this.connect()
                } catch (e) {
                    this.errors.push(e)
                }
            }
        },
        decodeJWT() {
            const base64Url = this.accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+')
                .replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map(c => `%${(`00${c.charCodeAt(0)
                    .toString(16)}`).slice(-2)}`)
                .join(''));
            this.name = JSON.parse(jsonPayload).username;
        },
        connect() {
            this.decodeJWT();
            this.socket = io.connect('http://localhost:3000', {
                transports: ['polling', 'websocket'],
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: this.accessToken
                        }
                    }
                }});
            this.socket.on('msgToClient', (message) => {
                this.receivedMessage(message)
            });

            this.socket.on('error', (error) => {
                this.errors.push(error)
            });
        }
    },
    created() {
        if(this.accessToken){
            this.connect()
        }
    },
});