import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validateEnv } from './config/validate-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = validateEnv(process.env);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(env.PORT ?? '3000');
}

bootstrap();
