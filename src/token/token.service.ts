import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { Model, Types } from 'mongoose';
import { RefreshToken } from './interfaces/refresh-token.interface';
import { TokenClass } from './schemas/token.schema';
import ApiError from 'src/exceptions/errors/api-error';
import { PopulatedToken } from './interfaces/populated-refresh-token.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private TokenModel: Model<TokenClass>,
	) {}

  validateResetToken(token: string, secret: string): { _id: string } | null {
		try {
			return jwt.verify(token, secret) as { _id: string }
		} catch {
			return null
		}
	}

	createResetToken(payload: { _id: string | Types.ObjectId }, secret: string): string | null {
		try {
			return jwt.sign(payload, secret, { expiresIn: '15m' })
		} catch {
			return null
		}
	}

	generateTokens(payload: { _id: string | Types.ObjectId }): { accessToken: string, refreshToken: string } {
		try {
			const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
			const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

			return { accessToken, refreshToken }
		} catch {
			return { accessToken: null, refreshToken: null }
		}
	}

	validateAccessToken(token: string) {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as { _id: string }
		} catch {
			return null
		}
	}

	validateRefreshToken(token: string) {
		try {
			return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { _id: string }
		} catch {
			return null
		}
	}

	async saveToken(refreshToken: string, userId: string | Types.ObjectId): Promise<RefreshToken> {
		return await this.TokenModel.create({ refreshToken, user: new Types.ObjectId(userId) })
	}

	async removeAllTokensUserOwn(userId: string | Types.ObjectId) {
		return await this.TokenModel.deleteMany({ user: new Types.ObjectId(userId) })
	}

	async removeToken(refreshToken: string) {
		return await this.TokenModel.deleteOne({ refreshToken })
	}

	async findToken(refreshToken: string) {
		return await this.TokenModel.findOne({ refreshToken })
	}

	async findTokenWithUser(refreshToken: string) {
		let tokenFromDB = (await this.TokenModel.findOne({ refreshToken }).populate('user') as any) as PopulatedToken

		if (!tokenFromDB)
			throw ApiError.UnauthorizedError()

		return tokenFromDB
	}
}
