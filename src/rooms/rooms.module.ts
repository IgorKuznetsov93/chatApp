import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomRepository } from '../repositories/room.repository';
import {UserRepository} from "../repositories/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([RoomRepository, UserRepository]), PassportModule.register({ defaultStrategy: 'jwt' }),],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {
}
