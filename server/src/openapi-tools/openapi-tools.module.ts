import { Module } from '@nestjs/common';
import { OpenApiFileGeneratorService } from './openapi-file-generator/openapi-file-generator.service';
import { OpenApiService } from './openapi.service';

@Module({
  providers: [OpenApiService, OpenApiFileGeneratorService],
  exports: [OpenApiService],
})
export class OpenApiToolsModule {}
