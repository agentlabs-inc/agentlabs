import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateEnv } from './config/validate-env';
import { OpenApiNestFactory } from './openapi-tools';

async function bootstrap() {
  const shouldPrintOasAndExit = !!process.env.PRINT_OAS_AND_EXIT;
  const app = await NestFactory.create(AppModule, {
    // TODO: remove this after aurelien changed the docker config
    cors: true,
  });

  const env = validateEnv(process.env);

  await OpenApiNestFactory.configure(
    app,
    new DocumentBuilder()
      .setTitle('AgentLabs API')
      .setDescription('Build AI Agents in minutes, not months.')
      .addBearerAuth(),
    {
      webServerOptions: {
        enabled: true,
        path: 'api-docs',
      },
      fileGeneratorOptions: {
        enabled: true,
        outputFilePath: './openapi.yaml',
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method,
    },
  );

  if (shouldPrintOasAndExit) {
    process.exit(0);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(env.PORT ?? '3000');
}

bootstrap();
