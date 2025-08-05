import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppError } from 'src/exceptions/errors/app-error';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TryToGetUserGuard implements CanActivate {
  constructor(
    private UserService: UserService,
    private TokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    const token = this.extractTokenFromHeader(request)
    if (!token) return true

    try {
      var userData = this.TokenService.validateAccessToken(token)
      
      if (userData._id) {
        let user = await this.UserService.findById(userData._id)
        request.user = user
      }
    } catch {}
    
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}