import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import UserModel from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TokenService } from 'src/token/token.service';
import TokenModel from 'src/token/models/token.model';

@Module({
  imports: [
    UserModel,
    JwtModule, 
    TokenModel
  ],
  controllers: [UserController],
  providers: [RolesService, UserService, TokenService]
})
export class UserModule {}
