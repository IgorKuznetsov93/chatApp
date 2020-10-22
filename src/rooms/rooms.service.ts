import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomRepository } from '../repositories/room.repository';
import { User } from '../entity/user.entity';
import { Room } from '../entity/room.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository : RoomRepository,
    @InjectRepository(UserRepository)
    private userRepository : UserRepository,
  ) {}

  async getRoomById(id: number, user: User) : Promise<Room> {
    const found = await this.roomRepository.getRoomById(id, user);
    if (!found) {
      throw new NotFoundException(`Room with id: ${id} not found`);
    }
    return found;
  }

  async getRooms(user: User) : Promise<Room[]> {
    return this.roomRepository.getRooms(user);
  }

  async createRoom(user, secondUserName) : Promise<Room> {
    const secondUser = await this.userRepository.findByUsername({ username: secondUserName });
    const found = await this.roomRepository.findRoomByUsers(user.id, secondUser.id);
    if (found) {
      return found;
    }
    const room = new Room();
    room.firstUserId = user.id;
    room.secondUserId = secondUser.id;
    room.messages = [];
    return room.save();
  }
}
