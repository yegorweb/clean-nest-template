import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private AuthService: AuthService,
  ) {}

  @SkipThrottle()
  @HttpCode(HttpStatus.CREATED)
  @Post('register-user')
  async registerUser(
    @Body() body: any,
  ) {
    await this.AuthService.registerUser(body)
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    let { accessToken, refreshToken, user } = await this.AuthService.login(email, password)
    res.cookie(
      'refreshToken',
      refreshToken,
      {
        maxAge: 30*24*60*60*1000,
        httpOnly: true,
        secure: eval(process.env.HTTPS || 'false'),
        domain: process.env.DOMAIN,
      }
    ).status(200).json({ user, accessToken })
  }

  @SkipThrottle()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let { accessToken, refreshToken, user } = await this.AuthService.refresh(req.cookies.refreshToken)
    res.cookie(
      'refreshToken',
      refreshToken,
      {
        maxAge: 30*24*60*60*1000,
        httpOnly: true,
        secure: eval(process.env.HTTPS || 'false'),
        domain: process.env.DOMAIN,
      }
    ).status(200).json({ user, accessToken })
  }

  @SkipThrottle()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.AuthService.logout(req.cookies.refreshToken)
    res.clearCookie('refreshToken').status(200).send()
  }
}
