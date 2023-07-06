import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: 'signup' })
  signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.userService.signUp(userCredentialsDto);
  }

  @MessagePattern({ cmd: 'signin' })
  signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(userCredentialsDto);
  }

  @MessagePattern({ message: 'test' })
  test(user: User) {
    console.log('user', user);
  }
}
