import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateSolutionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  @Expose()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Expose()
  solution: string;

  @IsString()
  @IsOptional()
  @Expose()
  reason: string;
}
