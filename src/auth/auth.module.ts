import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from 'src/user/models/user.model';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { CacheService } from 'src/cache/cache.service';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [
    UserModel,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TokenService,
    CacheService,
    CryptoService,
  ]
})
export class AuthModule {}
