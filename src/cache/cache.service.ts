import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RedisClient } from 'src/redis/redis-client';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';
import { User } from 'src/user/interfaces/user.interface';

const USER_CACHE_TTL = 15*60

@Injectable()
export class CacheService {
  async cacheUser(user: User | UserFromClient) {
    return await RedisClient.setex(`user:${user._id}`, USER_CACHE_TTL, JSON.stringify(user))
  }
  async getCachedUser(id: string | Types.ObjectId) {
    return JSON.parse(await RedisClient.get(`user:${id}`) ?? 'null')
  }
  async clearUserCache(id: string | Types.ObjectId) {
    return await RedisClient.del(`user:${id}`)
  }
}
