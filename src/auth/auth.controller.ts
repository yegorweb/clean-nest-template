import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express';
import RequestWithUser from 'src/types/request-with-user.type';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';
import { User } from 'src/user/interfaces/user.interface';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
		private AuthService: AuthService
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('registration')
	async registration(
		@Res() res: Response, 
		@Body() user: User
	) {
		const userData = await this.AuthService.registration(user)

    let refreshToken = userData.refreshToken
    delete userData.refreshToken

		res.cookie(
			'refreshToken', 
			refreshToken,
			{ 
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true, 
				secure: eval(process.env.HTTPS) 
			}
		).json(userData)
	}
	
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(
		@Res() res: Response, 
		@Body('email') email: string, 
    @Body('password') password: string 
	) {
		const userData = await this.AuthService.login(email, password)

    let refreshToken = userData.refreshToken
    delete userData.refreshToken

		res.cookie(
			'refreshToken', 
			refreshToken, 
			{ 
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true, 
				secure: eval(process.env.HTTPS)
			}
		).json(userData)
	}
	
	@HttpCode(HttpStatus.OK)
	@Get('refresh')
	async refresh(
		@Req() req: Request, 
		@Res() res: Response, 
	) {
		const { refreshToken } = req.cookies

		const userData = await this.AuthService.refresh(refreshToken)
		
    let newRefreshToken = userData.refreshToken
    delete userData.refreshToken

    res.cookie(
			'refreshToken', 
			newRefreshToken, 
			{ 
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true,
				secure: eval(process.env.HTTPS)
			}
		).json(userData)
	}
	
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	async logout(
		@Req() req: Request, 
		@Res() res: Response, 
	) {
		const { refreshToken } = req.cookies

		await this.AuthService.logout(refreshToken)
		res.clearCookie('refreshToken').send()
	}
	
	@HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
		@Res() res: Response, 
		@Body('password') password: string, 
    @Body('token') token: string, 
    @Body('user_id') user_id: string
	) {
		const userData = await this.AuthService.resetPassword(password, token, user_id)

    let refreshToken = userData.refreshToken
    delete userData.refreshToken

		res.cookie(
			'refreshToken', 
			refreshToken, 
			{ 
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true,
				secure: eval(process.env.HTTPS)
			}
		).json(userData)
  }	

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('update')
	async update(
		@Req() req: RequestWithUser,
		@Body('user') new_user: UserFromClient
	) {
		return await this.AuthService.update(new_user, req.user)
	}
  
	@HttpCode(HttpStatus.OK)
	@Post('send-reset-link')
	async sendResetLink(
		@Body('email') email: string
	) {
		let link = await this.AuthService.sendResetLink(email)	
		return link
  }
}
