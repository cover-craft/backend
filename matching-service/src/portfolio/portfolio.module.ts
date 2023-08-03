import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from 'src/entity/portfolio.entity';
import { ConnectionService } from 'src/connection/connection.service';
import { Connection } from 'src/entity/connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    TypeOrmModule.forFeature([Connection]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, ConnectionService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
