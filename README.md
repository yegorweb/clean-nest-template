<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Описание
Это приложение на Nest

# Требования

Необходимы `node >= 20`, `MongoDB`, `Redis`

# Перед запуском

### Установка зависимостей
```shell
npm i
```

### Переменные окружения
Все переменные окружения прописывать в `.env`:
- `PORT` (необ., по умол. `3000`): номер порта
- `CLIENT_URLS` (необ.): JSON массив со строками с url клиента, например `["http://localhost:3000","http://localhost:4000"]`
- `HTTPS` (необ., по умол. `false`): `true` если протокол TLS, иначе `false`
- `DOMAIN` (необ.): основной домен приложения, например `vk.com` (не ставить поддомен)
- `SERVICE_URL`: публичный url адрес вашего сервиса, например `https://mysite.com`. В шаблоне используется для отправки ссылок на восстановление пароля
- `REDIS_URL`: connection string к Redis
- `MONGO_URL`: connection string к MongoDB
- `JWT_ACCESS_TOKEN_SECRET`: секрет к access токенам 
- `JWT_REFRESH_TOKEN_SECRET`: секрет к refresh токенам
- `JWT_RESET_TOKEN_SECRET`: секрет к reset токенам

# Разработка

```shell
npm run dev
```

# Сборка и production

```shell
npm run build
npm run start:prod
```

# Важные моменты

### Исключения
Базовый класс ошибки — `AppError(message: string, status: number, additionalData: Record<string, any> = {})`. В нём также есть статические методы которые вызывают распространённые исключения.
```ts
throw new AppError('Не авторизован', 401, { needToRefreshToken: true })
/* Response:
{
  "status": "error",
  "statusCode": 401,
  "message": "Вы не авторизованы",
  "timestamp": "2025-09-15T13:49:57.477Z",
  "path": "/user/my-name",
  "needToRefreshToken": true
}
*/

throw AppError.Unauthorizated()
/* Response:
{
  "status": "error",
  "statusCode": 401,
  "message": "Вы не авторизованы",
  "timestamp": "2025-09-15T13:49:57.477Z",
  "path": "/user/my-name",
}
*/
```

На основе `AppError` можно создать классы других исключений, например: 
```ts
import { HttpStatus } from "@nestjs/common";
import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(message: string, additionalData = {}) {
    super(message, HttpStatus.BAD_REQUEST, additionalData)
  }
}
```

### Auth guards
Есть строгая защита — `AuthGuard`, есть не строгая, которая пропускает без 401 ошибки, — `TryToGetUserGuard`.<br>
Объект пользователя кладётся в `res.user`. Типы `Request` с объектом пользователя и возможно без него — `RequestWithUser` и `RequestWithUserOrNot` соответственно.
```ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';
import { TryToGetUserGuard } from 'src/auth/try-to-get-user.guard';
import type { RequestWithUserOrNot } from 'src/types/request-with-user-or-not.type';
import type { RequestWithUser } from 'src/types/request-with-user.type';

@Controller('user')
export class UserController {
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get('my-name-strict')
  async myNameStrict(
    @Req() req: RequestWithUser,
  ) {
    return req.user.fullname
  }

  @SkipThrottle()
  @UseGuards(TryToGetUserGuard)
  @Get('my-name')
  async myName(
    @Req() req: RequestWithUserOrNot,
  ) {
    return req.user ? req.user.fullname : 'Вы кто вообще?'
  }
}
```

### Rate limiting
По умолчанию на всех ставится ограничения `{ ttl: 30*1000, limit: 10, blockDuration: 60*1000 }`.<br>
Для отключения ограничения поставьте декоратор `@SkipThrottle()` на функцию или класс.<br>
Для изменения настроек ограничения на конкретной функции или классе можно поставить декоратор `@Throttle()`:
```ts
@Throttle({
  default: {
    ttl: 60*1000,
    limit: 3,
    blockDuration: 60*1000
  }
})
```

## License

Все файлы шаблона (репозитория), доступного по адресу  
<https://github.com/yegorweb/clean-nest-template>,  
распространяются по лицензии **MIT** в соответствии с [файлом LICENSE](https://github.com/yegorweb/clean-nest-template/blob/master/LICENSE), хранящимся в корне этого репозитория.

Вы можете использовать этот шаблон как основу для своих проектов.  
Лицензия будущего проекта определяется **вами**: вы вправе
оставить MIT, выбрать другую лицензию или вовсе
распространять проект без лицензии.
