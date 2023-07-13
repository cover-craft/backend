import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UserPWChangeDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  //   //영어랑 숫자만 가능한 유효성 체크
  //   @Matches(/^[a-zA-Z0-9]*$/, {
  //     message: '비밀번호 오류',
  //   })
  old_password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  //   //영어랑 숫자만 가능한 유효성 체크
  //   @Matches(/^[a-zA-Z0-9]*$/, {
  //     message: '비밀번호 오류',
  //   })
  new_password: string;
}

export class UserPWChangeRequestDto {
  @IsNumber()
  user_id: number;
  userPWChangeDto: UserPWChangeDto;
}
