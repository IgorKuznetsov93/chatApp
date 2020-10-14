import {Observable} from "rxjs";
import {CanActivate, Injectable} from "@nestjs/common";
import { jwtConstants } from './jwtConstants'
import * as jwt from 'jsonwebtoken'
import {User} from "./user.entity";

@Injectable()
export class WsGuard implements CanActivate {

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const token = context.args[0].handshake.headers.authorization;
        if(!token){
            return false
        }
        try {
            const decoded = jwt.verify(token, jwtConstants.secret) as any;
            return new Promise((resolve, reject) => {
                return User.findUserByName(decoded.username).then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject(false);
                    }
                });

            });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}