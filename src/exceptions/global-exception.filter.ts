import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

let dev = process.env.NODE_ENV && process.env.NODE_ENV === 'development'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException
        ? exception.getStatus()
        : (exception as any).status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus >= 500 || dev)
      console.error(exception)

    let message = (exception as any).message ?? 'Ошибка'

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Ошибка сервера'
    }

    if (httpStatus == HttpStatus.TOO_MANY_REQUESTS) {
      message = 'Слишком много запросов. Подождите 60 cек до разблокировки'
    }

    const responseBody = {
      status: 'error',
      statusCode: httpStatus,
      message,
      ...((exception as any).sendToUser ?? {}),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
