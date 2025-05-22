import { Expose, Type } from 'class-transformer';
import { CreateSolutionDto } from './create-solution.dto';
import { GetAnalyzeDto } from './get-analyze.dto';
import { Status } from 'src/common/types/status.type';

export class GetSolutionDto extends CreateSolutionDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => GetAnalyzeDto)
  analyze: GetAnalyzeDto;

  @Expose()
  status: Status;
}
