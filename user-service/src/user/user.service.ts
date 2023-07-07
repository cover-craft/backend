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
      //TODO: profile_image
      is_pro,
      intro,
    } = //TODO: 프로필 사진 관련
      userCredentialsDto;
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
      profile_image: 'TODO',
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
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = userCredentialsDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { user_id: user.user_id };
      let accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
