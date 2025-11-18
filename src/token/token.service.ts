import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/redis/redis-client';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { CryptoService } from 'src/crypto/crypto.service';

const REFRESH_TOKEN_TTL = 30*24*60*60

@Injectable()
export class TokenService {
  constructor(
    private CryptoService: CryptoService
  ) {}

  generateTokens(payload: { _id: string | Types.ObjectId }) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '30d' })

    return { accessToken, refreshToken }
  }
  validateAccessToken(token: string): { _id: string } {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as any
  }
  validateRefreshToken(token: string): { _id: string } {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET) as any
  }
  decodeToken(token: string): any {
    return jwt.decode(token)
  }
	validateResetToken(token: string, secret: string): { _id: string } {
		return jwt.verify(token, secret) as any
	}
	createResetToken(payload: { _id: string | Types.ObjectId }, secret: string) {
		return jwt.sign(payload, secret, { expiresIn: '15m' })
	}
  async saveRefreshToken(refreshToken: string, userId: string | Types.ObjectId) {
		const key = `tokens:${userId}`
		const hash = this.CryptoService.createSHA256(refreshToken)
		await RedisClient.lpush(key, hash)
		await RedisClient.expire(key, REFRESH_TOKEN_TTL, 'GT')
	}
	async removeUserRefreshTokens(userId: string | Types.ObjectId) {
		const key = `tokens:${userId}`
		await RedisClient.del(key)
	}
	async removeRefreshToken(refreshToken: string, userId: string | Types.ObjectId) {
		const key = `tokens:${userId}`
		const hash = this.CryptoService.createSHA256(refreshToken)
		await RedisClient.lrem(key, 0, hash)
	}
	async refreshTokenExists(refreshToken: string, userId: string | Types.ObjectId): Promise<boolean> {
		const key = `tokens:${userId}`
		const hash = this.CryptoService.createSHA256(refreshToken)
		return (await RedisClient.lpos(key, hash)) !== null
	}
}
