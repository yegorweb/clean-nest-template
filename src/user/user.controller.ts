import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiError from 'src/exceptions/errors/api-error';
import { RolesService } from 'src/roles/roles.service';
import RequestWithUser from 'src/types/request-with-user.type';
import { UserFromClient } from './interfaces/user-from-client.interface';
import { UserClass } from './schemas/user.schema';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private UserService: UserService,
    private RolesService: RolesService
  ) {} 

  @HttpCode(HttpStatus.OK)
  @Get('get-by-id')
  async get_by_id(
    @Query('_id') _id: string, 
  ) {
    let candidate = await this.UserModel.findById(_id, { password: 0 })
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден')

    return candidate
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('change-user')
  async changeUser(
    @Req() req: RequestWithUser,
    @Body('user') user: Partial<UserFromClient>
  ) {
    if (req.user._id.toString() !== user._id)
      throw ApiError.AccessDenied()
    
    let subject_user = await this.UserModel.findById(user._id)

    if (!subject_user)
      throw ApiError.NotFound('Пользователь не найден')
    
    delete user._id
    // delete user.email
    delete user.password

    // + проверки на роли !!!!

    await subject_user.updateOne(user, { runValidators: true })
  }
}
