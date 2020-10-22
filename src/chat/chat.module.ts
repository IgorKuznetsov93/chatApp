import { Module } from '@nestjs/common';

// Modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module';

// Components
import { ChatGateway } from './chat.gateway';
import { UserRepository } from '../repositories/user.repository';
import { RoomRepository } from '../repositories/room.repository';

@Module({
  imports: [AuthModule, RoomsModule, TypeOrmModule.forFeature([UserRepository, RoomRepository])],
  providers: [ChatGateway],
})
export class ChatModule {}
