import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService } from 'src/cache/cache.service';
import { CryptoService } from 'src/crypto/crypto.service';
import { AppError } from 'src/exceptions/errors/app-error';
import { ValidationError } from 'src/exceptions/errors/validation-error';
import { TokenService } from 'src/token/token.service';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';
import { UserClass } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel('User') private UserModel: Model<UserClass>,
    private UserService: UserService,
    private CryptoService: CryptoService,
    private TokenService: TokenService,
    private CacheService: CacheService,
  ) {}

  async registerUser(user: Partial<UserFromClient>, roles=[]) {
    this.UserService.validateUser(user)
    
    if (await this.UserModel.exists({ email: user.email }))
      throw AppError.BadRequest('Пользователь с таким email уже существует')

    if (!user.password || user.password.length < 8)
      throw new ValidationError('Пароль слишком короткий')

    let password = await this.CryptoService.createPasswordHash(user.password)

    user = Object.assign(user, {
      password,
      roles,
    })
    let createdUser = await this.UserModel.create(user)
    delete (createdUser as any).password
    this.CacheService.cacheUser(createdUser)
  }
  async login(email: string, password: string) {
    let user = await this.UserModel.findOne({ email }).lean()
    
    if (!user)
      throw AppError.BadRequest('Пользователь с таким email не найден')

    let isPasswordCorrect = await this.CryptoService.comparePasswords(password, user.password)
    if (!isPasswordCorrect)
      throw AppError.AccessDenied('Неверный пароль')

    delete (user as any).password
    this.CacheService.cacheUser(user)

    let tokens = this.TokenService.generateTokens({ _id: user._id })
    await this.TokenService.saveRefreshToken(tokens.refreshToken, user._id)

    return {
      ...tokens,
      user
    }
  }
  async refresh(oldRefreshToken: string) {
    if (!oldRefreshToken)
      throw AppError.Unauthorized('Отсутствует refresh token', { needLogin: true })
    
    try {
      var tokenData = this.TokenService.validateRefreshToken(oldRefreshToken)
    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        let payload = this.TokenService.decodeToken(oldRefreshToken)
        this.TokenService.removeRefreshToken(oldRefreshToken, payload._id)
        throw AppError.Unauthorized('Срок авторизации истёк', { needLogin: true })
      } else {
        throw AppError.Unauthorized('Недействительный токен', { invalidToken: true })
      }
    }
    if (!tokenData || !tokenData._id)
      throw AppError.Unauthorized('Недействительный токен', { invalidToken: true })

    let userId = tokenData._id

    let tokenExists = await this.TokenService.refreshTokenExists(oldRefreshToken, userId)
    if (!tokenExists)
      throw AppError.Unauthorized('Токен не найден', { tokenNotFound: true })

    let user = await this.UserService.findById(userId)
    if (!user)
      throw AppError.Unauthorized('Пользователь не найден', { userNotFound: true })

    this.TokenService.removeRefreshToken(oldRefreshToken, user._id)
    let tokens = this.TokenService.generateTokens({ _id: user._id })
    await this.TokenService.saveRefreshToken(tokens.refreshToken, user._id)

    return {
      ...tokens,
      user
    }
  }
  async logout(refreshToken: string) {
    let payload = this.TokenService.decodeToken(refreshToken)
    if (payload && payload._id) {
      await this.TokenService.removeRefreshToken(refreshToken, payload._id)
    }
  }
  async resetPassword(password: string, resetToken: string, userId: string) {
    let user = await this.UserModel.findById(userId)
    if (!user) throw AppError.BadRequest('Пользователь не найден')

    let secret = process.env.JWT_RESET_TOKEN_SECRET + user.password
    try {
      this.TokenService.validateResetToken(resetToken, secret)
    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        throw AppError.Unauthorized('Срок жизни токена истёк', { tokenNeedRefresh: true })
      } else {
        throw AppError.Unauthorized('Недействительный токен', { invalidToken: true })
      }
    }
    
    let hashPassword = await this.CryptoService.createPasswordHash(password)
    await user.updateOne({ password: hashPassword })

    await this.TokenService.removeUserRefreshTokens(userId)
  }
  async sendResetLink(email: string) {
    let user = await this.UserModel.findOne({ email })
    if (!user) throw AppError.BadRequest('Пользователь не найден')

    let secret = process.env.JWT_RESET_TOKEN_SECRET + user.password
    let token = this.TokenService.createResetToken({ _id: user._id }, secret)

    let link = process.env.SERVICE_URL + `/auth/reset-password?user_id=${user._id}&token=${token}`
    // send email
  }
}
