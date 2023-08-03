import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from 'src/entity/portfolio.entity';
import { Repository } from 'typeorm';
import { ShowPortfolio } from './response/response.class';
import { Connection } from 'src/entity/connection.entity';
import { ConnectionService } from 'src/connection/connection.service';
import { PublicProjectInfo } from 'src/connection/response/response.class';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    private connectionService: ConnectionService,
  ) {}

  async createPortfolio(
    pfIntro: string,
    price: number,
    userId: number,
  ): Promise<boolean> {
    const EX_PF = await this.portfolioRepository.findOne({
      where: {
        user_id: userId,
      },
    });
    if (EX_PF) {
      EX_PF.intro_text = pfIntro;
      EX_PF.price = price;
      try {
        await this.portfolioRepository.save(EX_PF);
      } catch (error) {
        console.error('error: ', error);
        throw new InternalServerErrorException();
      }
    } else {
      const NEW_PORTFOLIO = this.portfolioRepository.create({
        intro_text: pfIntro,
        price: price,
        user_id: userId,
      });

      try {
        await this.portfolioRepository.manager.save(NEW_PORTFOLIO);
      } catch (error) {
        console.error('error: ', error);
        throw new InternalServerErrorException();
      }
    }
    return true;
  }

  async readPortfolio(userId: number): Promise<ShowPortfolio> {
    console.log('user_id:', userId);
    const EX_PF = await this.portfolioRepository.findOne({
      where: {
        user_id: userId,
      },
      relations: {
        connections: true,
      },
    });
    if (!EX_PF) {
      throw new RpcException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 포트폴리오를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    const projectArray = Array<PublicProjectInfo>();
    let index = 0;
    for (1; index < EX_PF.connections.length; index++) {
      const newConnection = EX_PF.connections[index];
      projectArray.push({
        project_id: newConnection.connection_id,
        ai_image_id: newConnection.image_id,
        review: newConnection.request_review,
      });
    }
    return {
      intro_text: EX_PF.intro_text,
      price: EX_PF.price,
      linked_project_number: index,
      linked_project: projectArray,
    };
  }

  async updateConnections(
    userId: number,
    connectionIdArray: Array<number>,
  ): Promise<boolean> {
    const EX_PF = await this.portfolioRepository.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!EX_PF) {
      throw new RpcException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 포트폴리오를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    const projectArray = Array<Connection>();
    for (let index = 0; index < connectionIdArray.length; index++) {
      const connectionId = connectionIdArray[index];
      const newConnection = await this.connectionService.findConnectionWithId(
        connectionId,
      );
      projectArray.push(newConnection);
    }
    EX_PF.connections = projectArray;
    try {
      this.portfolioRepository.save(EX_PF);
    } catch (error) {
      console.error('error: ', error);
      throw new InternalServerErrorException();
    }
    return true;
  }
}
