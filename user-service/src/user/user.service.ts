import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from './dto/user-credential.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtStrategy } from './jwt-strategy';
import { Repository } from 'typeorm';
import { SignInSuccess, UserInfomation } from './response/response.class';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<number> {
    console.log(userCredentialsDto);
    const {
      email,
      password,
      nickname,
      phone_number,
      profile_image_url,
      is_pro,
      intro,
    } = userCredentialsDto;
    const EX_USER = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (EX_USER) {
      throw new UnauthorizedException('이미 가입한 이메일');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email: email,
      password: hashedPassword,
      nickname: nickname,
      phone_number: phone_number,
      profile_image_url: profile_image_url,
      category: is_pro == 'true' ? 'P' : 'C',
      intro: intro,
    });

    try {
      await this.userRepository.manager.save(user);
      return user.user_id;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing email');
      } else {
        console.error('error: ', error);
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(userCredentialsDto: UserCredentialsDto): Promise<SignInSuccess> {
    const { email, password } = userCredentialsDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { user_id: user.user_id };
      const accessToken = await this.jwtService.sign(payload);

      return {
        accessToken: accessToken,
        user_id: user.user_id,
        is_pro: user.category == 'P' ? true : false,
      };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async getUserInfo(user_id: number): Promise<UserInfomation> {
    const NOW_USER = await this.userRepository.findOne({ where: { user_id } });
    if (NOW_USER) {
      return {
        email: NOW_USER.email,
        nickname: NOW_USER.nickname,
        phone_number: NOW_USER.phone_number,
        profile_image_url: NOW_USER.profile_image_url,
        is_pro: NOW_USER.category == 'P' ? true : false,
        intro: NOW_USER.intro,
      };
    }
  }
}
