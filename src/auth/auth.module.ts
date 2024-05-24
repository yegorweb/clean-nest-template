import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';
import UserModel from 'src/user/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    TokenModule,
    UserModel,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesService]
})
export class AuthModule {}
