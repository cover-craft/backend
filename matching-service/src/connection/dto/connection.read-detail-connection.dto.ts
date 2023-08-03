import { IsNumber } from 'class-validator';

export class ReadDetailConnectionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  project_id: number;
}
