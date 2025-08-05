import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token/token.service';
import { UserModule } from './user/user.module';
import { CacheService } from './cache/cache.service';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30*1000,
          limit: 10,
          blockDuration: 60*1000
        },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    TokenService,
    CacheService,
    CryptoService,
  ],
})
export class AppModule {}
