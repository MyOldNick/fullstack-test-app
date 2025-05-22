import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { GetSolutionDto } from './dto/get-solution.dto';
import { Analyze } from './entities/analyze.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { StatusEnum } from 'src/common/enums/status.enum';
import { ConfigService } from '@nestjs/config';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RedisService } from "@liaoliaots/nestjs-redis"

// I have combined the "Analyze" and "Solution" entities because the application is  simple, ideally to have separate services for each

@Injectable()
export class LlmService implements OnModuleInit {
  private redis;

  private ai: GoogleGenerativeAI;
  private model: GenerativeModel;
  private basePrompt = `I will provide you with a description of the situation, the solution, and the reasons for this solution. You have to return the category of the solution (emotional, strategic, impulsive, etc.), a list of potential cognitive distortions that could have affected it, and missed alternatives or paths that were not taken into account. I would like to receive the answers in JSON format with the following fields (each field must contain a simple string): category, distortions, and alternative.`;

  constructor(
    @InjectRepository(Solution)
    private solutionRepository: Repository<Solution>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Analyze) private analyzeRepository: Repository<Analyze>,
    @InjectQueue('llm') private llmQueue: Queue,
    private configService: ConfigService,
    private redisService: RedisService
  ) {}

  onModuleInit() {
    this.redis = this.redisService.getOrThrow();

    this.ai = new GoogleGenerativeAI(this.configService.get('LLM_API_KEY'));
    this.model = this.ai.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  }

  async addSolution(
    data: CreateSolutionDto,
    userId: number,
  ): Promise<GetSolutionDto> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      this.invalidateUserSolutionsCache(userId)
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      const solution = this.solutionRepository.create({
        ...data,
        user: foundUser,
      });
      await this.solutionRepository.save(solution);
      this.llmQueue.add('llm', { solutionId: solution.id });
      return plainToInstance(GetSolutionDto, solution, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add solution');
    }
  }

  async getSolutions({
    userId,
    pagination,
  }: {
    userId: number;
    pagination: PaginationDto;
  }): Promise<GetSolutionDto[]> {
    try {
      const request = this.buildRequest({ userId, pagination })
      const cahedSolutions = await this.redis.get(request)

      if (cahedSolutions) return cahedSolutions;

      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      const solutions = await this.solutionRepository.find({
        where: { user: foundUser },
        relations: ['analyze'],
        skip: pagination.skip,
        take: pagination.limit,
        order: {
          createdAt: 'DESC',
        },
      });

      const preparedSolutions =  plainToInstance(GetSolutionDto, solutions, {
        excludeExtraneousValues: true,
      });

      this.redis.set(request, JSON.stringify(preparedSolutions), 'EX', 3600)

      return preparedSolutions;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get solutions');
    }
  }

  async addAnalyze(solutionId: number): Promise<void> {
    try {
      const foundSolution = await this.solutionRepository.findOne({
        where: { id: solutionId },
        relations: ['analyze'],
      });
      if (!foundSolution) {
        throw new NotFoundException('Solution not found');
      }

      const prompt =
        this.basePrompt +
        `solution: ${foundSolution.solution}. description: ${foundSolution.description}. reason: ${foundSolution.reason}.`;

      const result = await this.model.generateContent([prompt]);
      const data = result.response.text();
      const parsedData = JSON.parse(data);

      const analyzeToSave = {
        category: parsedData.category,
        distortions: parsedData.distortions,
        alternative: parsedData.alternative,
      };

      const analyze = this.analyzeRepository.create({
        ...analyzeToSave,
        solution: foundSolution,
      });
      const savedAnalyze = await this.analyzeRepository.save(analyze);
      await this.solutionRepository.update(solutionId, {
        analyze: savedAnalyze,
        status: StatusEnum.ANALYZED,
      });
    } catch (error) {
      console.log(error);
      await this.solutionRepository.update(solutionId, {
        status: StatusEnum.ERROR,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add analyze');
    }
  }


  buildRequest({ userId, pagination }: { userId: number, pagination: PaginationDto }): string {
    return `solutions:user=${userId}:skip=${pagination.skip}:limit=${pagination.limit}`
  }

  async scanKeys(pattern: string): Promise<string[]> {
    let cursor = '0';
    let keys: string[] = [];


    while (true) {
      const [nextCursor, batch] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      keys.push(...batch);
      if (nextCursor === '0') break;
      cursor = nextCursor;
    }

    return keys;
  }


  async invalidateUserSolutionsCache(userId: number) {
    const pattern = `solutions:user=${userId}:*`;
    const keys = await this.scanKeys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

}
