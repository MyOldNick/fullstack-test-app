import { Expose } from 'class-transformer';
import { CreateAnalyzeDto } from './create-analyze.dto';

export class GetAnalyzeDto extends CreateAnalyzeDto {
  @Expose()
  id: number;
}
