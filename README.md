<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Описание
Это приложение на Nest

# Перед запуском

## Установка зависимостей
```shell
npm i
```

## Переменные окружения
Все переменные окружения прописывать в `.env`:
- `PORT`: номер порта
- `CLIENT_URLS`: JSON массив со строками с url клиента, например `["http://localhost:3000","http://localhost:4000"]`
- `HTTPS`: `true` если протокол TLS, иначе `false`
- `DOMAIN`: основной домен приложения, например `vk.com` (не ставить поддомен)
- `REDIS_URL`: connection string к Redis

# Разработка

```shell
npm run dev
```

# Сборка и production

```shell
npm run build
npm run start:prod
```
