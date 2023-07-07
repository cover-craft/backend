import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsBooleanString,
} from 'class-validator';

export class UserCredentialsDto {
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
  //영어랑 숫자만 가능한 유효성 체크
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호 오류',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nickname: string;

  @IsString()
  @MinLength(11)
  @MaxLength(11)
  @Matches(/^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/, {
    message: '',
  })
  phone_number: string;

  //TODO: 프로필 사진 url추가

  //TODO: 사용자 구분: bool형 관련 추가
  @IsBooleanString()
  is_pro: string;

  @IsString()
  @MaxLength(1000)
  intro: string;
}
