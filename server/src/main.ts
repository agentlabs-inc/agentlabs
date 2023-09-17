import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validateEnv } from './config/validate-env';
import { OpenApiNestFactory } from './openapi-tools';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // TODO: remove this after aurelien changed the docker config
    cors: true,
  });
  const env = validateEnv(process.env);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

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
        outputFilePath: './openapi.json',
      },
      clientGeneratorOptions: {
        enabled: true,
        type: 'typescript-fetch',
        outputFolderPath: '../typescript-client/src',
        additionalProperties:
          'apiPackage=clients,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true',
        openApiFilePath: './openapi.json',
        skipValidation: true, // optional, false by default
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method,
    },
  );

  await app.listen(env.PORT ?? '3000');
}

bootstrap();
