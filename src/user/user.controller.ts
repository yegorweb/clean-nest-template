import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';
import type { RequestWithUser } from 'src/types/request-with-user.type';

@Controller('user')
export class UserController {
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get('my-name')
  async myName(
    @Req() req: RequestWithUser,
  ) {
    return req.user.fullname
  }
}
