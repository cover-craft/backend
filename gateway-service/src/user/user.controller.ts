import {
  Body,
  Controller,
  Get,
  Headers,
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

  @Post('/sendcode')
  sendCode(@Body() body: string): Observable<string> {
    return this.userClient.send({ cmd: 'sendcode' }, body);
  }

  @Post('/confirmcode')
  confirmCode(@Body() body: string): Observable<string> {
    return this.userClient.send({ cmd: 'confirmcode' }, body);
  }

  @Get('/checkemail')
  checkEmail(@Headers('email') email: string): Observable<boolean> {
    return this.userClient.send({ cmd: 'checkemailok' }, email);
  }

  @Get('/checkphone')
  checkPhone(@Headers('phone_number') phone: string): Observable<boolean> {
    return this.userClient.send({ cmd: 'checkphoneok' }, phone);
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

  @UseGuards(AuthGuard)
  @Post('/info')
  changeUserInfo(@Request() req, @Body() body: string): Observable<string> {
    return this.userClient.send(
      { cmd: 'changeuserinfo' },
      {
        user_id: req.user_id,
        userInfoChangeDto: body,
      },
    );
  }

  @UseGuards(AuthGuard)
  @Post('/password')
  changeUserPassword(@Request() req, @Body() body: string): Observable<string> {
    const abc = this.userClient.send(
      { cmd: 'changeuserpassword' },
      {
        user_id: req.user_id,
        userPWChangeDto: body,
      },
    );
    return abc;
  }

  @Post('/resetpassword')
  resetPassword(@Body() body): Observable<boolean> {
    return this.userClient.send({ cmd: 'resetpassword' }, body.phone_number);
  }

  @Get('/getallpro')
  getAllProUserInfo(): Observable<string> {
    return this.userClient.send({ cmd: 'getallpro' }, {});
  }
}
