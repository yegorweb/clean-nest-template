import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let originFromEnv: string[] = []
  try {
    originFromEnv = JSON.parse(process.env.CLIENT_URLS)
  } catch (error) {
    console.error('Ошибка парсинга переменной окружения CLIENT_URLS:')
    console.error(error)
  }
  app.enableCors({
    origin: [...originFromEnv, ],
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
