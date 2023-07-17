import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserSendCodeDto {
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  @Matches(/^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/, {
    message: '전화번호 형식을 확인하세요',
  })
  phone_number: string;
}
