import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let originFromEnv: string[] = []
  try {
    originFromEnv = JSON.parse(process.env.CLIENT_URLS)
  } catch {}
  app.enableCors({
    origin: [...originFromEnv, ],
    credentials: true
  })

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
