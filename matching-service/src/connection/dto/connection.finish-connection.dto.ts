import { IsNumber, IsString } from 'class-validator';

export class FinishConnectionDto {
  @IsNumber()
  request_user_id: number;

  @IsNumber()
  project_id: number;

  @IsString()
  review_message: string;
}
