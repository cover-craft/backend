import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserSignInDto {
  @IsString()
  @MaxLength(320)
  @Matches(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: '이메일 형식 오류',
    },
  )
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  //   //영어랑 숫자만 가능한 유효성 체크
  //   @Matches(/^[a-zA-Z0-9]*$/, {
  //     message: '비밀번호 오류',
  //   })
  password: string;
}
