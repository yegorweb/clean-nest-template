import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppError } from 'src/exceptions/errors/app-error';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private UserService: UserService,
    private TokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    const token = this.extractTokenFromHeader(request)
    if (!token) 
      throw AppError.Unauthorized()

    try {
      var userData = this.TokenService.validateAccessToken(token)
    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        throw AppError.Unauthorized('Срок жизни токена истёк', { tokenNeedRefresh: true })
      } else {
        throw AppError.Unauthorized('Недействительный токен', { invalidToken: true })
      }
    }
    if (!userData || !userData._id) {
      throw AppError.Unauthorized('Недействительный токен', { invalidToken: true })
    }
    let user = await this.UserService.findById(userData._id)
    if (!user) {
      throw AppError.Unauthorized('Невозможно найти вас в базе данных. Возможно, вас удалили')
    }
    request.user = user
    
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}