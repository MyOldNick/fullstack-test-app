import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAnalyzeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @Expose()
  category: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Expose()
  distortions: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Expose()
  alternative: string;
}
