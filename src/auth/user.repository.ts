import { EntityRepository, Repository } from 'typeorm';
import {ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {JwtPayload} from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto : AuthCredentialsDto) :Promise<void > {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto : AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && await user.validatePassword(password)) {
      return user.username;
    }
    return null;
  }

  async findByUsername(payload: JwtPayload): Promise<User> {
      const { username } = payload;
      const user = await this.findOne({ username });
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }

  private async hashPassword(password: string, salt: string) :Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
