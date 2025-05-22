import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from './modules/llm/llm.module';
import { QueueModule } from './core/queue/queue.module';
import { RedisCacheModule } from './core/cache/cache.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    LlmModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QueueModule,
    RedisCacheModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
