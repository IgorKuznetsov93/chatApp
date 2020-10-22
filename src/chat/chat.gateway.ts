import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { WsGuard } from '../auth/wsGuard';
import { UserRepository } from '../repositories/user.repository';
import { RoomRepository } from '../repositories/room.repository';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository : UserRepository,
    @InjectRepository(RoomRepository)
    private roomRepository : RoomRepository
  ) {

  }

  @WebSocketServer()
  server: Server;

  connectedUsers: string[] = [];

  connections : Map<string, string> = new Map<string, string>();

  usernames : Map<string, Socket> = new Map<string, Socket>();

  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsGuard)
  @SubscribeMessage('authToServer')
  handleMessage(client: Socket, payload): void {
    this.connectedUsers.push(payload.user.username);
    this.connections.set(client.id, payload.user.username);
    this.usernames.set(payload.user.username, client);
    this.server.emit('users', this.connectedUsers);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('msgToRoom')
  async msgToRoom(client: Socket, payload) {
    const { message, room } = payload;

    await this.roomRepository.addMessage(message, room);

    client.broadcast.to(room.id).emit('messageToClient', message);
  }

  @UseGuards(WsGuard)
  handleDisconnect(client: Socket) {
    const username = this.connections.get(client.id);
    const userIndex = this.connectedUsers.indexOf(username);
    if (userIndex > -1) {
      this.connectedUsers = [
        ...this.connectedUsers.slice(0, userIndex),
        ...this.connectedUsers.slice(userIndex + 1)
      ];
    }
    this.server.emit('users', this.connectedUsers);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, room) {
    client.join(room.id);
    const userId = room.firstUserId === room.user.id ? room.secondUserId : room.firstUserId;
    const user = await this.userRepository.findById(userId);
    this.usernames.get(user.username).join(room.id);
  }
}
