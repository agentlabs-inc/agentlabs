import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { OpenApiToolsModule } from './openapi-tools.module';
import { OpenApiOptions, OpenApiService } from './openapi.service';

export class OpenApiNestFactory {
  static async configure(
    app: INestApplication,
    documentBuilder: DocumentBuilder,
    toolsOptions?: OpenApiOptions,
    swaggerOptions?: SwaggerDocumentOptions,
  ) {
    const openApiToolsModule = await NestFactory.createApplicationContext(
      OpenApiToolsModule,
    );

    if (!toolsOptions) {
      toolsOptions = {};
    }

    if (!toolsOptions.webServerOptions) {
      toolsOptions.webServerOptions = {
        enabled: true,
        path: 'api-docs',
      };
    }

    if (!toolsOptions.fileGeneratorOptions) {
      toolsOptions.fileGeneratorOptions = {
        enabled: true,
        outputFilePath: './openapi.yaml',
      };
    }

    if (!swaggerOptions) {
      swaggerOptions = {
        operationIdFactory: (controller: string, method: string) => method,
      };
    }

    await openApiToolsModule
      .get(OpenApiService)
      .configure(app, documentBuilder, toolsOptions, swaggerOptions);
  }
}
