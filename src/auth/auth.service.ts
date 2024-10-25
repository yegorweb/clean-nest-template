import { Injectable } from '@nestjs/common'
import { TokenService } from 'src/token/token.service'
import { Model } from 'mongoose'
import ApiError from 'src/exceptions/errors/api-error'
import { InjectModel } from '@nestjs/mongoose'
import { UserClass } from 'src/user/schemas/user.schema'
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/interfaces/user.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private TokenService: TokenService,
  ) {}

  async registration(user: Partial<UserFromClient>) {
    let candidate = await this.UserModel.findOne({ email: user.email }).lean()

    if (candidate)
      throw ApiError.BadRequest(`Пользователь с почтой ${user.email} уже есть`)
    if (user.password.length < 8)
      throw ApiError.BadRequest('Короткий пароль')

    let password = await bcrypt.hash(user.password, 3)
    let createdUser = await this.UserModel.create(Object.assign(user, { password, roles: [] }))

    delete createdUser.password
 
    let tokens = this.TokenService.generateTokens({ _id: createdUser._id })
    await this.TokenService.saveToken(tokens.refreshToken, createdUser._id)
    
    return {
      ...tokens,
      user: createdUser
    }  
  }  

  async login(email: string, password: string) {
    let user = await this.UserModel.findOne({ email }).lean()
  
    if (!user)
      throw ApiError.BadRequest('Пользователь не найден')
    if (user.password.length < 8)
      throw ApiError.BadRequest('Короткий пароль')
    
    let isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }

    delete user.password
  
    let tokens = this.TokenService.generateTokens({ _id: user._id })
    await this.TokenService.saveToken(tokens.refreshToken, user._id)
  
    return {
      ...tokens,
      user
    }      
  }  

  async refresh(oldRefreshToken: string) {
    if (!oldRefreshToken)
      throw ApiError.UnauthorizedError()

    let userId = this.TokenService.validateRefreshToken(oldRefreshToken)._id
    let tokenFromDb = await this.TokenService.findToken(oldRefreshToken)

    if (!userId || !tokenFromDb)
      throw ApiError.UnauthorizedError()

    let user = await this.UserModel.findById(userId, { password: 0 }).lean()

    await this.TokenService.removeToken(oldRefreshToken)

    let tokens = this.TokenService.generateTokens({ _id: user._id })
    await this.TokenService.saveToken(tokens.refreshToken, user._id)
 
    return {
      ...tokens,
      user
    }
  }

  async resetPassword(password: string, resetToken: string, userId: any) {
    try {
      await this.validateEnterToResetPassword(userId, resetToken)
      
      let hashPassword = await bcrypt.hash(password, 3)
      let user = await this.UserModel.findByIdAndUpdate(userId, { password: hashPassword })

      await this.TokenService.removeAllTokensUserOwn(user._id)

      let tokens = this.TokenService.generateTokens({ _id: user._id })
      await this.TokenService.saveToken(tokens.refreshToken, user._id)

      return {
        ...tokens,
        user
      }
    } catch (error) {
      return null
    }
  }

  async validateEnterToResetPassword(userId: any, token: string) {
    let candidate = await this.UserModel.findById(userId)
    if (!candidate) throw ApiError.BadRequest('Пользователь не найден')

    let secret = process.env.JWT_RESET_SECRET + candidate.password
    let result = this.TokenService.validateResetToken(token, secret)

    if (!result) throw ApiError.AccessDenied()

    return result
  }    

  async sendResetLink(email: string) {
    let candidate = await this.UserModel.findOne({ email })
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким email не найден')

    let secret = process.env.JWT_RESET_SECRET + candidate.password
    let token = this.TokenService.createResetToken({ _id: candidate._id }, secret)

    let link = process.env.CLIENT_URL + `/forgot-password?user_id=${candidate._id}&token=${token}`

    //sendMail({ link }, 'reset-password.hbs', [candidate.email], 'single')
  }    
  
  async logout(refreshToken: string) {
    return await this.TokenService.removeToken(refreshToken)
  }
  
  async update(new_user: User | UserFromClient, user: User | UserFromClient) {
    return await this.UserModel.findByIdAndUpdate(user._id, new_user, {
      new: true,
      runValidators: true
    })
  }
}
