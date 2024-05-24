import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ 
    origin: [process.env.CLIENT_URL, 'http://localhost:3001'],
    credentials: true
  })
  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  await app.listen(process.env.PORT)
}
bootstrap()
