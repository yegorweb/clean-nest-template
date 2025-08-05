import { Injectable } from '@nestjs/common';
import { UserFromClient } from './interfaces/user-from-client.interface';
import { isEmail } from 'validator';
import { ValidationError } from 'src/exceptions/errors/validation-error';
import { CacheService } from 'src/cache/cache.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private CacheService: CacheService,
  ) {}

  validateUser(user: Partial<UserFromClient>) {
    let message: string[] = []

    if (!user) message.push('нет данных')
    else if (typeof user !== 'object') message.push('неправильные данные')
    else {
      if (!user.email) message.push('нет email')
      else if (typeof user.email !== 'string' || !isEmail(user.email)) message.push('неверный email')
      
      if (!user.fullname) message.push('нет имени')
      else if (typeof user.fullname !== 'string') message.push('имя должно быть строкой')
      else if (user.fullname.length < 1) message.push('короткое имя')
      else if (user.fullname.length > 20) message.push('длинное имя')
    }

    if (message.length) {
      let responseMessage = message.join(', ')
      responseMessage = responseMessage[0].toUpperCase() + responseMessage.slice(1)
      throw new ValidationError(responseMessage)
    }
  }
  async findById(id: string) {
    let userFromRedis = await this.CacheService.getCachedUser(id)
    if (userFromRedis) {
      return userFromRedis
    } else {
      let user = await this.UserModel.findById(id, { password: 0 }).lean()
      if (user) {
        this.CacheService.cacheUser(user)
      }
      return user
    }
  }
}
