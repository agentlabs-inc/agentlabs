import { Module } from '@nestjs/common';
import { OpenApiClientGeneratorService } from './openapi-client-generator/openapi-client-generator.service';
import { OpenApiFileGeneratorService } from './openapi-file-generator/openapi-file-generator.service';
import { OpenApiService } from './openapi.service';

@Module({
  providers: [
    OpenApiService,
    OpenApiFileGeneratorService,
    OpenApiClientGeneratorService,
  ],
  exports: [OpenApiService],
})
export class OpenApiToolsModule {}
