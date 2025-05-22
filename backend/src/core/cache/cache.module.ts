import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
      RedisModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            config: {
                host: configService.get("REDIS_HOST"),
                port: configService.get("REDIS_PORT")
            }
        })
      })
    ],
  })
  export class RedisCacheModule {}     