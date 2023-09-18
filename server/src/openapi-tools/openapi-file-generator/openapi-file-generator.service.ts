import { Injectable } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface OpenApiFileGeneratorOptions {
  enabled: boolean;
  outputFilePath: string;
}

@Injectable()
export class OpenApiFileGeneratorService {
  constructor() {}

  async generateOpenApiFile(
    options: OpenApiFileGeneratorOptions,
    openApiDoc: OpenAPIObject,
  ) {
    if (!options.outputFilePath?.length) {
      throw new Error('outputFilePath is not defined.');
    }

    const swaggerDoc = JSON.parse(JSON.stringify(openApiDoc));
    if (!swaggerDoc?.components || !swaggerDoc?.components?.schemas) {
      delete swaggerDoc.components;
    }

    const fullPath = join(process.cwd(), options.outputFilePath);

    if (fullPath.toLocaleLowerCase().endsWith('.yaml')) {
      const yaml = await import('yaml');
      const swaggerYaml = yaml
        .stringify(swaggerDoc)
        .replace(`Version: 2012-10-17`, `Version: '2012-10-17'`);
      writeFileSync(fullPath, swaggerYaml);
    } else {
      const swaggerJson = JSON.stringify(swaggerDoc);
      writeFileSync(fullPath, swaggerJson);
    }
  }
}
