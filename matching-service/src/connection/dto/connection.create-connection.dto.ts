import { IsNumber, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsNumber()
  request_user_id: number;

  @IsNumber()
  pro_user_id: number;

  @IsNumber()
  image_id: number;

  @IsString()
  request_message: string;
}
