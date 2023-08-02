import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, ConnectionStatus } from 'src/entity/connection.entity';
import { Repository } from 'typeorm';
import {
  DetailProjectArray,
  DetailProjectInfo,
  PublicProjectInfo,
} from './response/response.class';
import { RpcException } from '@nestjs/microservices';
import { Portfolio } from 'src/entity/portfolio.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async findConnectionWithId(id: number): Promise<Connection> {
    const connection = await this.connectionRepository.find({
      where: {
        connection_id: id,
      },
    });
    if (!connection) {
      throw new NotFoundException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 프로젝트를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    return connection[0];
  }

  async findPublicConnection(
    connection_id: number,
  ): Promise<PublicProjectInfo> {
    console.log('id: ', connection_id);
    const connection = await this.findConnectionWithId(connection_id);

    if (!connection) {
      throw new NotFoundException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 프로젝트를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    console.log('3');

    return {
      project_id: connection.connection_id,
      ai_image_id: connection.image_id,
      review: connection.request_review,
    };
  }

  async findDetailConnection(
    user_id: number,
    connection_id: number,
  ): Promise<DetailProjectInfo> {
    const connection = await this.connectionRepository.findOne({
      where: {
        connection_id: connection_id,
      },
    });
    if (!connection) {
      throw new NotFoundException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 프로젝트를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    if (
      user_id != connection.request_user_id &&
      user_id != connection.pro_user_id
    ) {
      console.error('no auth');
      throw new UnauthorizedException();
    }
    let nowStatus = '결제 전';
    if (connection.status == 1) nowStatus = '결제 완료';
    else if (connection.status == 2) nowStatus = '작업 완료';
    return {
      project_id: connection.connection_id,
      ai_image_id: connection.image_id,
      request_user_id: connection_id,
      pro_user_id: connection.pro_user_id,
      request_message: connection.request_message,
      request_review: connection.request_review,
      service_price: connection.service_price,
      total_price: connection.total_price,
      status: nowStatus,
    };
  }

  async createConnection(
    request_user_id: number,
    pro_id: number,
    image_id: number,
    message: string,
  ): Promise<number> {
    const Pro_Portfolio = await this.portfolioRepository.findOne({
      where: {
        user_id: pro_id,
      },
    });

    const newConnection = this.connectionRepository.create({
      image_id: image_id,
      request_user_id: request_user_id,
      pro_user_id: pro_id,
      request_message: message,
      service_price: Pro_Portfolio.price,
      total_price: Pro_Portfolio.price,
      status: ConnectionStatus.PAID,
    });

    try {
      await this.connectionRepository.manager.save(newConnection);
    } catch (error) {
      console.error('error: ', error);
      throw new InternalServerErrorException();
    }
    return newConnection.connection_id;
  }

  //   async readPublicConnectionInfo(
  //     connection_id: number,
  //   ): Promise<PublicProjectInfo> {
  //     return await this.findPublicConnection(connection_id);
  //   }

  //   async readDetailConnectionInfo(
  //     connection_id: number,
  //   ): Promise<DetailProjectInfo> {
  //     return await this.findDetailConnection(connection_id);
  //   }

  async readRequestUserAllConnection(
    user_id: number,
  ): Promise<DetailProjectArray> {
    const connections = await this.connectionRepository.find({
      where: {
        request_user_id: user_id,
      },
    });

    const returnProjectArray: Array<DetailProjectInfo> =
      Array<DetailProjectInfo>();
    let index = 0;
    for (1; index < connections.length; index++) {
      const c = connections[index];
      returnProjectArray.push(
        await this.findDetailConnection(user_id, c.connection_id),
      );
    }
    return {
      total_item: index,
      projects: returnProjectArray,
    };
  }

  async readProUserAllConnection(
    pro_user_id: number,
  ): Promise<DetailProjectArray> {
    const connections = await this.connectionRepository.find({
      where: {
        pro_user_id: pro_user_id,
      },
    });

    const returnProjectArray: Array<DetailProjectInfo> =
      Array<DetailProjectInfo>();
    let index = 0;
    for (1; index < connections.length; index++) {
      const c = connections[index];
      returnProjectArray.push(
        await this.findDetailConnection(pro_user_id, c.connection_id),
      );
    }
    return {
      total_item: index,
      projects: returnProjectArray,
    };
  }

  //   async finishConnectionWithRequestUser(
  //     user_id: number,
  //     connection_id: number,
  //   ): Promise<boolean> {
  //     const EX_PROJECT = await this.findConnectionWithId(connection_id);
  //     if (EX_PROJECT.request_user_id == user_id) {
  //       EX_PROJECT.status = ConnectionStatus.FINISHED;
  //     }
  //     try {
  //       await this.connectionRepository.save(EX_PROJECT);
  //     } catch (error) {
  //       console.error('error: ', error);
  //       throw new InternalServerErrorException();
  //     }
  //     return true;
  //   }

  async reviewConnection(
    request_user_id: number,
    connection_id: number,
    review_text: string,
  ): Promise<boolean> {
    const EX_PROJECT = await this.findConnectionWithId(connection_id);
    if (EX_PROJECT.request_user_id != request_user_id) {
      throw new RpcException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 프로젝트를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    EX_PROJECT.request_review = review_text;
    EX_PROJECT.status = ConnectionStatus.FINISHED;
    try {
      await this.connectionRepository.save(EX_PROJECT);
    } catch (error) {
      console.error('error: ', error);
      throw new InternalServerErrorException();
    }
    return true;
  }
}
