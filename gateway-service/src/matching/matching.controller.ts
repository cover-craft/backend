import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth.guard';

@Controller('matching')
export class MatchingController {
  matchingClient: ClientProxy;
  constructor() {
    this.matchingClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.MATCHING_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.MATCHING_SERVICE_PORT) || 20020,
      },
    });
  }

  @UseGuards(AuthGuard)
  @Post('/createportfolio')
  createPortfolio(@Request() req, @Body() body): Observable<string> {
    return this.matchingClient.send(
      { cmd: 'createportfolio' },
      {
        user_id: req.user_id,
        matchingCreatePFDto: body,
      },
    );
  }

  @Get('/readportfolio')
  readPortfolio(
    @Headers('pro_user_id') pro_user_id: number,
  ): Observable<string> {
    console.log('header: ', pro_user_id);
    return this.matchingClient.send({ cmd: 'readportfolio' }, pro_user_id);
  }

  @UseGuards(AuthGuard)
  @Post('/updateportfolio')
  updatePortfolio(@Request() req, @Body() body): Observable<boolean> {
    return this.matchingClient.send(
      { cmd: 'updateprojects' },
      { user_id: req.user_id, project_id_array: body },
    );
  }

  @UseGuards(AuthGuard)
  @Post('/createproject')
  createProject(@Request() req, @Body() body): Observable<number> {
    return this.matchingClient.send(
      {
        cmd: 'createproject',
      },
      {
        request_user_id: req.user_id,
        pro_user_id: body.pro_user_id,
        image_id: body.image_id,
        request_message: body.request_message,
      },
    );
  }

  @Get('/readpublicproject')
  readPublicProject(
    @Headers('project_id') project_id: number,
  ): Observable<string> {
    console.log('pid: ', project_id);
    return this.matchingClient.send({ cmd: 'readpublicproject' }, project_id);
  }

  @UseGuards(AuthGuard)
  @Get('/readdetailproject')
  readDetailProject(
    @Request() req,
    @Headers('project_id') project_id: number,
  ): Observable<string> {
    return this.matchingClient.send(
      { cmd: 'readdetailproject' },
      { user_id: req.user_id, project_id: project_id },
    );
  }

  @UseGuards(AuthGuard)
  @Get('/readallrequestproject')
  readAllRequestProject(@Request() req): Observable<string> {
    return this.matchingClient.send(
      { cmd: 'readallrequestproject' },
      req.user_id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/readallproproject')
  readAllProProject(@Request() req): Observable<string> {
    return this.matchingClient.send({ cmd: 'readallproproject' }, req.user_id);
  }

  @UseGuards(AuthGuard)
  @Post('/finishproject')
  finishProject(@Request() req, @Body() body): Observable<boolean> {
    return this.matchingClient.send(
      { cmd: 'finishproject' },
      {
        request_user_id: req.user_id,
        project_id: body.project_id,
        review_message: body.review,
      },
    );
  }
}
