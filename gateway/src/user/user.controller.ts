import {
  Body,
  Controller,
  Get,
  Inject,
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

@Controller('user')
export class UserController {
  userClient: ClientProxy;
  constructor() {
    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT) || 20010,
      },
    });
  }

  @Post('/signup')
  signUp(@Body() body: string): Observable<number> {
    console.log('signup...: ', body);
    const message = this.userClient.send({ cmd: 'signup' }, body);
    console.log('message is ', message);
    return message;
  }

  @Post('/signin')
  signIn(@Body() body: string): Observable<string> {
    console.log('signin...');
    const message = this.userClient.send({ cmd: 'signin' }, body);
    console.log('message is ', message);
    return message;
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  getUserInfo(@Request() req): Observable<string> {
    return this.userClient.send({ cmd: 'userinfo' }, req.user_id);
  }
}
