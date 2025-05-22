import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip: number;
}
