import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import ApiError from 'src/exceptions/errors/api-error';
import { RolesService } from 'src/roles/roles.service';
import { AccessToken } from 'src/token/interfaces/access-token.interface';
import { UserClass } from 'src/user/schemas/user.schema';

@Injectable()
export class SomeAdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private RolesService: RolesService,
    @InjectModel('User') private UserModel: Model<UserClass>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    const token = this.extractTokenFromHeader(request)
    if (!token) 
      throw ApiError.UnauthorizedError()

    try {
      const user = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET }) as AccessToken

      request.user = await this.UserModel.findById(user._id)
    } catch {
      throw ApiError.UnauthorizedError()
    }

    if (!this.RolesService.isSomeAdmin(request.user.roles))
      throw ApiError.AccessDenied()
    
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}