import { HttpException, HttpStatus } from "@nestjs/common"

export default class ApiError extends HttpException {
	error_code: number
	errors: any[]

	constructor(status: number, message: string, errors = []) {
		super(message, status)
		this.error_code = status
		this.errors = errors
	}

	static UnauthorizedError(message: string | null = null) {
		return new ApiError(401, message ?? 'Вы не авторизованы')
	}

	static BadRequest(message: string, code = 400, errors = []) {
		return new ApiError(code, message, errors)
	}

	static AccessDenied(message: string | null = null) {
		return new ApiError(HttpStatus.NOT_ACCEPTABLE, message ?? 'Отказано в доступе')
	}

	static NotFound(message: string | null = null) {
		return new ApiError(HttpStatus.NOT_FOUND, message ?? 'Не найдено')
	}
}