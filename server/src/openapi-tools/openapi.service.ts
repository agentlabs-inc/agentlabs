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
import {
  OpenApiClientGeneratorOptions,
  OpenApiClientGeneratorService,
} from './openapi-client-generator/openapi-client-generator.service';

export interface OpenApiWebServerOptions {
  enabled: boolean;
  path: string;
}

export interface OpenApiOptions {
  clientGeneratorOptions?: OpenApiClientGeneratorOptions;
  fileGeneratorOptions?: OpenApiFileGeneratorOptions;
  webServerOptions?: OpenApiWebServerOptions;
}

@Injectable()
export class OpenApiService {
  constructor(
    private readonly openApiFileGenerator: OpenApiFileGeneratorService,
    private readonly openApiClientGenerator: OpenApiClientGeneratorService,
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

    if (toolsOptions?.clientGeneratorOptions?.enabled) {
      await this.generateClient(toolsOptions.clientGeneratorOptions);
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

  private async generateClient(options: OpenApiClientGeneratorOptions) {
    await this.openApiClientGenerator.generateClient(options);
  }
}
