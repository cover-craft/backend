import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [UserController],
})
export class UserModule {}
