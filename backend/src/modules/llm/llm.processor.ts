import { Processor } from '@nestjs/bullmq';
import { LlmService } from './llm.service';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';

@Processor('llm')
export class LlmProcessor extends WorkerHost {
  constructor(private readonly llmService: LlmService) {
    super();
  }

  async process(job: Job) {
    this.llmService.addAnalyze(job.data.solutionId);
  }
}
