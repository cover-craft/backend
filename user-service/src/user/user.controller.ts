import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { UserService } from './user.service';
import {
  AllProUser,
  UserInfoChangedMessage,
  UserInfomation,
} from './response/response.class';
import {
  UserInfoChangeDto,
  UserInfoChangeRequestDto,
} from './dto/user.change-info.dto';
import { UserPWChangeRequestDto } from './dto/user.change-pw.dto';
import { UserSendCodeDto } from './dto/user.send-code.dto';
import { UserConfirmCodeDto } from './dto/user.confirm-code.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: 'sendcode' })
  async sendTxt(userSendCodeDto: UserSendCodeDto): Promise<Boolean> {
    console.log('send Txt');
    return await this.userService.sendText(userSendCodeDto.phone_number);
  }

  @MessagePattern({ cmd: 'confirmcode' })
  async confirmTxt(userConfirmCodeDto: UserConfirmCodeDto): Promise<Boolean> {
    console.log('confirm Txt');
    return await this.userService.confirmPhone(
      userConfirmCodeDto.phone_number,
      userConfirmCodeDto.request_code,
    );
  }

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

  @MessagePattern({ cmd: 'changeuserpassword' })
  changeUserPassword(
    userPWChangeRequestDto: UserPWChangeRequestDto,
  ): Promise<UserInfoChangedMessage> {
    const USER_ID = userPWChangeRequestDto.user_id;
    const userPWChangeDto = userPWChangeRequestDto.userPWChangeDto;

    return this.userService.changeUserPassword(USER_ID, userPWChangeDto);
  }

  @MessagePattern({ cmd: 'checkemailok' })
  checkEmailOK(email: string): Promise<boolean> {
    return this.userService.checkEmailOK(email);
  }

  @MessagePattern({ cmd: 'checkphoneok' })
  checkPhoneOK(phone: string): Promise<boolean> {
    return this.userService.checkPhoneOK(phone);
  }

  @MessagePattern({ cmd: 'resetpassword' })
  resetPassword(phone: string): Promise<boolean> {
    return this.userService.resetPasswordToPhone(phone);
  }

  @MessagePattern({ cmd: 'getallpro' })
  getAllProUserInfo(): Promise<AllProUser> {
    return this.userService.listAllProUser();
  }
}
