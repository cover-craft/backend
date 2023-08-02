import { IsNumber, IsString, MinLength } from 'class-validator';

export class MatchingCreatePFDto {
  @IsString()
  @MinLength(1)
  intro_text: string;

  @IsNumber()
  price: number;
}

export class CreatePFRequestDto {
  @IsNumber()
  user_id: number;
  matchingCreatePFDto: MatchingCreatePFDto;
}
