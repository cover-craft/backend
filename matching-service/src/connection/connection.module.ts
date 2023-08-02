import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/entity/connection.entity';
import { Portfolio } from 'src/entity/portfolio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection]),
    TypeOrmModule.forFeature([Portfolio]),
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
