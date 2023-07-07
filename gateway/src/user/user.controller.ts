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
import { UserCredentialsDto } from './dto/signup.dto';
import { UserSignInDto } from './dto/signin.dto';

@Controller('user')
export class UserController {
  constructor(@Inject('USER-MICRO') private userClient: ClientProxy) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Observable<number> {
    console.log('signup...');
    const message = this.userClient.send({ cmd: 'signup' }, userCredentialsDto);
    console.log('message is ', message);
    return message;
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signinDto: UserSignInDto,
  ): Observable<{ accessToken: string }> {
    console.log('signin...');
    const message = this.userClient.send({ cmd: 'signin' }, signinDto);
    console.log('message is ', message);
    return message;
  }
}
