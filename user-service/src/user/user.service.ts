import {
  ConflictException,
  HttpException,
  HttpStatus,
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
import {
  NormalMessage,
  SignInSuccess,
  UserInfoChangedMessage,
  UserInfomation,
} from './response/response.class';
import { UserInfoChangeDto } from './dto/user.change-info.dto';
import { UserPWChangeDto } from './dto/user.change-pw.dto';
import { RpcException } from '@nestjs/microservices';
import { createClient } from 'redis';
import { Message } from 'coolsms-node-sdk';
const coolsms = require('coolsms-node-sdk').default;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findUserById(user_id: number) {
    const NOW_USER = await this.userRepository.findOne({ where: { user_id } });
    if (!NOW_USER) {
      throw new RpcException({
        status_code: HttpStatus.BAD_REQUEST,
        message: '해당 유저를 찾을 수 없습니다. ',
      }); //Bad Request
    }
    return NOW_USER;
  }

  async getValueInRedis(key: string) {
    try {
      const redisInfo = {
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
      };
      const client = createClient(redisInfo);
      await client.connect();

      const myValue = await client.get(key);
      await client.quit();

      return myValue;
    } catch (e) {
      console.error(e);
    }
  }

  async setValueInRedis(key: string, value: string) {
    try {
      const redisInfo = {
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
      };
      const client = createClient(redisInfo);
      await client.connect();

      await client.set(key, value);
      await client.quit();
    } catch (e) {
      console.error(e);
    }
  }

  async sendText(phone: string): Promise<Boolean> {
    // gen random number
    const randomNumber: string = Math.random().toString().slice(2, 8);
    console.log('랜덤 번호 생성: ' + randomNumber);

    const messageService = new coolsms(
      process.env.PHONE_API_KEY,
      process.env.PHONE_API_SECRET,
    );

    const messageText: string = '인증번호: ' + randomNumber;

    // 2건 이상의 메시지를 발송할 때는 sendMany, 단일 건 메시지 발송은 sendOne을 이용해야 합니다.
    messageService
      .sendMany([
        {
          to: phone,
          from: '01050220898',
          text: messageText,
        },
      ])
      .then((res) => {
        console.log(res);
        this.setValueInRedis(phone, randomNumber);
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
    return false;
  }

  async confirmPhone(phone: string, requestCode: string): Promise<Boolean> {
    const serverCode = await this.getValueInRedis(phone);
    console.log('ser code: ' + serverCode + ' and req code is ' + requestCode);
    return requestCode == serverCode ? true : false;
  }

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
      throw new RpcException({
        status_code: HttpStatus.UNAUTHORIZED,
        message: '이미 가입한 이메일입니다.',
      });
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
        throw new RpcException({
          status_code: HttpStatus.UNAUTHORIZED,
          message: '이미 가입한 이메일입니다.',
        });
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
      throw new RpcException({
        status_code: HttpStatus.UNAUTHORIZED,
        message: '로그인 실패',
      });
    }
  }

  async getUserInfo(user_id: number): Promise<UserInfomation> {
    const NOW_USER = await this.findUserById(user_id);
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

  async changeUserInfo(
    user_id: number,
    userChangeInfo: UserInfoChangeDto,
  ): Promise<UserInfoChangedMessage> {
    const NOW_USER = await this.findUserById(user_id);
    NOW_USER.nickname = userChangeInfo.nickname;
    NOW_USER.phone_number = userChangeInfo.phone_number;
    NOW_USER.profile_image_url = userChangeInfo.profile_image_url;
    NOW_USER.intro = userChangeInfo.intro;

    await this.userRepository.save(NOW_USER);
    return {
      status_code: 200,
      is_success: true,
      message: '회원 정보 수정 완료.',
    };
  }

  async changeUserPassword(
    user_id: number,
    userPWChangeDto: UserPWChangeDto,
  ): Promise<NormalMessage> {
    const NOW_USER = await this.findUserById(user_id);

    //구 비번 맞는지 확인(로그인)
    if (
      NOW_USER &&
      (await bcrypt.compare(userPWChangeDto.old_password, NOW_USER.password))
    ) {
      //비번 맞음 -> 신 비번 추가
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        userPWChangeDto.new_password,
        salt,
      );
      NOW_USER.password = hashedPassword;
      await this.userRepository.save(NOW_USER);
      return {
        status_code: HttpStatus.OK,
        is_success: true,
        message: '비밀번호 수정 완료',
      };
    } else {
      //비번 틀림 -> 안됨 반환
      throw new RpcException({
        status_code: HttpStatus.FORBIDDEN,
        message: '기존 비밀번호가 틀렸습니다.',
      });
    }
  }
}
