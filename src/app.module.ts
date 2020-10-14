import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import {AuthModule} from "./auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
