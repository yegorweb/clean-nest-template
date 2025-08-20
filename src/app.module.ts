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
import { AuthModule } from './auth/auth.module';
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
      errorMessage(context, throttlerLimitDetail) {
        let seconds = throttlerLimitDetail.timeToBlockExpire
        function enumerate (num, dec) {
          if (num > 100) num = num % 100;
          if (num <= 20 && num >= 10) return dec[2];
          if (num > 20) num = num % 10;
          return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
        }
        return `Слишком много запросов. Подождите ${seconds} ${enumerate(seconds, ['секунду', 'секунды', 'секунд'])} до разблокировки`
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
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
