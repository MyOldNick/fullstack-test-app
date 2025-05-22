import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { LlmService } from './llm.service';
import { JwtAuthGuard } from 'src/core/jwt/jwt.auth-guard';
import { GetSolutionDto } from './dto/get-solution.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @UseGuards(JwtAuthGuard)
  @Post('solution')
  async addSolution(
    @Body() data: CreateSolutionDto,
    @Req() req,
  ): Promise<GetSolutionDto> {
    return this.llmService.addSolution(data, +req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('solution')
  async getSolutions(
    @Req() req,
    @Query() pagination: PaginationDto,
  ): Promise<GetSolutionDto[]> {
    return this.llmService.getSolutions({ userId: +req.user.sub, pagination });
  }
}
