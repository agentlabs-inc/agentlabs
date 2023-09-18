import {
  DocumentBuilder,
  SwaggerModule,
  OpenAPIObject,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { INestApplication, Injectable } from '@nestjs/common';
import {
  OpenApiFileGeneratorOptions,
  OpenApiFileGeneratorService,
} from './openapi-file-generator/openapi-file-generator.service';

export interface OpenApiWebServerOptions {
  enabled: boolean;
  path: string;
}

export interface OpenApiOptions {
  fileGeneratorOptions?: OpenApiFileGeneratorOptions;
  webServerOptions?: OpenApiWebServerOptions;
}

@Injectable()
export class OpenApiService {
  constructor(
    private readonly openApiFileGenerator: OpenApiFileGeneratorService,
  ) {}

  async configure(
    app: INestApplication,
    documentBuilder: DocumentBuilder,
    toolsOptions: OpenApiOptions,
    swaggerOptions: SwaggerDocumentOptions,
  ) {
    const document = SwaggerModule.createDocument(
      app,
      documentBuilder.build(),
      swaggerOptions,
    );

    if (toolsOptions?.webServerOptions?.enabled) {
      this.enableDocumentationWebServer(
        app,
        document,
        toolsOptions.webServerOptions,
      );
    }

    if (toolsOptions?.fileGeneratorOptions?.enabled) {
      await this.generateOpenApiFile(
        document,
        toolsOptions.fileGeneratorOptions,
      );
    }
  }

  private async enableDocumentationWebServer(
    app: INestApplication,
    document: OpenAPIObject,
    options: OpenApiWebServerOptions,
  ) {
    SwaggerModule.setup(options.path ?? 'apidocs', app, document);
  }

  private async generateOpenApiFile(
    document: OpenAPIObject,
    options: OpenApiFileGeneratorOptions,
  ) {
    await this.openApiFileGenerator.generateOpenApiFile(options, document);
  }
}
