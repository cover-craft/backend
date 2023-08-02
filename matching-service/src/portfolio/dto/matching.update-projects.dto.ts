import { IsArray, IsNumber } from 'class-validator';

export class MatchingUpdateProjectDto {
  @IsNumber()
  user_id: number;

  @IsArray()
  project_id_array: number[];
}
