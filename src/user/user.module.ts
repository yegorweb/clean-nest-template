import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CacheService } from 'src/cache/cache.service';
import { UserModel } from './models/user.model';
import { CryptoService } from 'src/crypto/crypto.service';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    UserModel,
  ],
  providers: [
    UserService,
    CacheService,
    CryptoService,
    TokenService,
  ],
  controllers: [UserController],
})
export class UserModule {}
