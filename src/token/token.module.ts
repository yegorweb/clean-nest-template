import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import TokenModel from './models/token.model';
import { TokenService } from './token.service';

@Module({
  imports: [
    TokenModel,
    JwtModule
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
