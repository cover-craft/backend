import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { UserService } from './user.service';
import {
  UserInfoChangedMessage,
  UserInfomation,
} from './response/response.class';
import {
  UserInfoChangeDto,
  UserInfoChangeRequestDto,
} from './dto/user.change-info.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: 'signup' })
  async signUp(userCredentialsDto: UserCredentialsDto): Promise<number> {
    console.log('come on');
    return await this.userService.signUp(userCredentialsDto);
  }

  @MessagePattern({ cmd: 'signin' })
  signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(userCredentialsDto);
  }

  @MessagePattern({ cmd: 'userinfo' })
  getUserInfo(user_id: number): Promise<UserInfomation> {
    return this.userService.getUserInfo(user_id);
  }

  @MessagePattern({ cmd: 'changeuserinfo' })
  changeUserInfo(
    userInfoChangeRequestDto: UserInfoChangeRequestDto,
  ): Promise<UserInfoChangedMessage> {
    const USER_ID = userInfoChangeRequestDto.user_id;
    const userInfoChangeDto = userInfoChangeRequestDto.userInfoChangeDto;

    return this.userService.changeUserInfo(USER_ID, userInfoChangeDto);
  }
}
