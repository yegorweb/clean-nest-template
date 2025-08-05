import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';
import { TryToGetUserGuard } from 'src/auth/try-to-get-user.guard';
import type { RequestWithUserOrNot } from 'src/types/request-with-user-or-not.type';
import type { RequestWithUser } from 'src/types/request-with-user.type';

@Controller('user')
export class UserController {
  @SkipThrottle()
  @UseGuards(TryToGetUserGuard)
  @Get('my-name')
  async myName(
    @Req() req: RequestWithUserOrNot,
  ) {
    return req.user ? req.user.fullname : 'Кто вы?'
  }
}
