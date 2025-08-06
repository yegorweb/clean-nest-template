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
- `REDIS_URL`: connection string к Redis
- `MONGO_URL`: connection string к MongoDB
- `JWT_ACCESS_TOKEN_SECRET`: секрет к access токенам 
- `JWT_REFRESH_TOKEN_SECRET`: секрет к refresh токенам

# Разработка

```shell
npm run dev
```

# Сборка и production

```shell
npm run build
npm run start:prod
```
