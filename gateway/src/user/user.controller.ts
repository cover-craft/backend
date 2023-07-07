import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER-MICRO') private userClient: ClientProxy) {}

  @Post('/signup')
  signUp(@Body() body: string): Observable<number> {
    console.log('signup...: ', body);
    const message = this.userClient.send({ cmd: 'signup' }, body);
    console.log('message is ', message);
    return message;
  }

  @Post('/signin')
  signIn(@Body() body: string): Observable<{ accessToken: string }> {
    console.log('signin...');
    const message = this.userClient.send({ cmd: 'signin' }, body);
    console.log('message is ', message);
    return message;
  }
}
