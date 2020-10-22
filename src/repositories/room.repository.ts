import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../entity/room.entity';
import { User } from '../entity/user.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async getRoomById(id: number, user: User) : Promise<Room> {
    return this.createQueryBuilder('room')
      .where('room.firstUserId = :firstUserId', { firstUserId: user.id })
      .orWhere('room.secondUserId = :secondUserId', { secondUserId: user.id })
      .andWhere('room.id = :id', { id })
      .getOne();
  }

  async getRooms(user: User) : Promise<Room[]> {
    return this.createQueryBuilder('room')
      .where('room.firstUserId = :firstUserId', { firstUserId: user.id })
      .orWhere('room.secondUserId = :secondUserId', { secondUserId: user.id })
      .getMany();
  }

  async findRoomByUsers(firstUserId: number, secondUserId: number) : Promise<Room> {
    return this.createQueryBuilder('room')
      .where('room.firstUserId = :firstUserId AND room.secondUserId = :secondUserId', { firstUserId, secondUserId })
      .orWhere('room.firstUserId = :secondUserId AND room.secondUserId = :firstUserId', { firstUserId, secondUserId })
      .getOne();
  }

  async addMessage(message: string, room : Room) {
    const found = await this.findOne({ id: room.id });
    found.messages.push(message);
    await found.save();
  }
}
