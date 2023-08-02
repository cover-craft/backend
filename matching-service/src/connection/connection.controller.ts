import { Controller } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  DetailProjectArray,
  DetailProjectInfo,
  PublicProjectInfo,
} from './response/response.class';
import { CreateConnectionDto } from './dto/connection.create-connection.dto';
import { FinishConnectionDto } from './dto/connection.finish-connection.dto';
import { ReadDetailConnectionDto } from './dto/connection.read-detail-connection.dto';

@Controller('connection')
export class ConnectionController {
  constructor(private connectionService: ConnectionService) {}

  @MessagePattern({ cmd: 'createproject' })
  async createProject(
    createConnectionDto: CreateConnectionDto,
  ): Promise<number> {
    console.log(createConnectionDto);
    return await this.connectionService.createConnection(
      createConnectionDto.request_user_id,
      createConnectionDto.pro_user_id,
      createConnectionDto.image_id,
      createConnectionDto.request_message,
    );
  }

  @MessagePattern({ cmd: 'readpublicproject' })
  async readPublicProject(project_id: number): Promise<PublicProjectInfo> {
    return await this.connectionService.findPublicConnection(project_id);
  }

  @MessagePattern({ cmd: 'readdetailproject' })
  async readDetailProject(
    readDetailConnectionDto: ReadDetailConnectionDto,
  ): Promise<DetailProjectInfo> {
    return await this.connectionService.findDetailConnection(
      readDetailConnectionDto.user_id,
      readDetailConnectionDto.project_id,
    );
  }

  @MessagePattern({ cmd: 'readallrequestproject' })
  async readAllRequestProject(user_id: number): Promise<DetailProjectArray> {
    return this.connectionService.readRequestUserAllConnection(user_id);
  }

  @MessagePattern({ cmd: 'readallproproject' })
  async readAllProProject(user_id: number): Promise<DetailProjectArray> {
    return this.connectionService.readProUserAllConnection(user_id);
  }

  @MessagePattern({ cmd: 'finishproject' })
  async finishAndReviewProject(
    finishConnectionDto: FinishConnectionDto,
  ): Promise<boolean> {
    return this.connectionService.reviewConnection(
      finishConnectionDto.request_user_id,
      finishConnectionDto.project_id,
      finishConnectionDto.review_message,
    );
  }
}
