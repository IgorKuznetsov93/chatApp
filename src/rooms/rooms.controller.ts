import {
  Body,
  Controller, Get, Param, ParseIntPipe, Post, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomsService } from './rooms.service';
import { User } from '../entity/user.entity';
import { Room } from '../entity/room.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('rooms')
@UseGuards(AuthGuard())
export class RoomsController {
  constructor(
    private roomService : RoomsService,
  ) {}

  @Get('/:id')
  getRoomById(@Param('id', ParseIntPipe) id : number, @GetUser() user : User) : Promise<Room> {
    return this.roomService.getRoomById(id, user);
  }

  @Get('/')
  getRooms(@GetUser() user : User) : Promise<Room[]> {
    return this.roomService.getRooms(user);
  }

  @Post('/')
  createRoom(@GetUser() user : User, @Body('secondUser') secondUser : string) : Promise<Room> {
    return this.roomService.createRoom(user, secondUser);
  }
}
