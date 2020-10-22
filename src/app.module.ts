import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ChatModule } from './chat/chat.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ChatModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
