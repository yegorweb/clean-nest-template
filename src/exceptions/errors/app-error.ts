import { HttpException, HttpStatus } from "@nestjs/common"

export class AppError extends HttpException {
	sendToUser: Record<string, any>

	constructor(message: string, status: number, additionalData: Record<string, any> = {}) {
    super(message, status)
		this.sendToUser = additionalData
  }

  static Unauthorized(message = 'Вы не авторизованы', additionalData = {}) {
		return new AppError(message, HttpStatus.UNAUTHORIZED, additionalData)
	}

	static BadRequest(message = 'Плохой запрос', additionalData = {}) {
		return new AppError(message, HttpStatus.BAD_REQUEST, additionalData)
	}

	static AccessDenied(message = 'Отказано в доступе', additionalData = {}) {
		return new AppError(message, HttpStatus.NOT_ACCEPTABLE, additionalData)
	}

	static NotFound(message = 'Не найдено', additionalData = {}) {
		return new AppError(message, HttpStatus.NOT_FOUND, additionalData)
	}

	static TooManyRequests(message = 'Слишком много запросов', additionalData = {}) {
		return new AppError(message, HttpStatus.TOO_MANY_REQUESTS, additionalData)
	}
}