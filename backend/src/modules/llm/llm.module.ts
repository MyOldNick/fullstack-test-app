import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from 'src/core/jwt/jwt.strategy';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { Solution } from './entities/solution.entity';
import { Analyze } from './entities/analyze.entity';
import { BullModule } from '@nestjs/bullmq';
import { LlmProcessor } from './llm.processor';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User, Solution, Analyze]),
    BullModule.registerQueue({
      name: 'llm',
    }),
  ],
  controllers: [LlmController],
  providers: [JwtStrategy, LlmService, LlmProcessor],
})
export class LlmModule {}
