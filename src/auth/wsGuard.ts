import { Observable } from 'rxjs';
import { CanActivate, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants } from './jwtConstants';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async canActivate(
    context: any,
  ): Promise<boolean | any> {
    const token = context.args[0].handshake.headers.authorization;
    if (!token) {
      return false;
    }
    try {
      const decoded = jwt.verify(token, jwtConstants.secret) as any;
      const user = await this.userRepository.findByUsername(decoded);
      if (!user) {
        return false;
      }
      context.switchToWs().getData().user = user;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
