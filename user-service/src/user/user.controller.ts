import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Observable } from 'rxjs';

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

  @MessagePattern({ message: 'test' })
  test(user: User) {
    console.log('user', user);
  }
}
