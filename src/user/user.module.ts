import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import UserModel from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserModel,
    JwtModule
  ],
  controllers: [UserController],
  providers: [RolesService, UserService]
})
export class UserModule {}
