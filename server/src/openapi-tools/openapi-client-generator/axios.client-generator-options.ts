import { OpenApiClientGeneratorOptions } from './openapi-client-generator.service';

export class AxiosClientGeneratorOptions implements OpenApiClientGeneratorOptions {
  enabled = true;
  type = 'typescript-axios';
  outputFolderPath = '../typescript-api-client/src';
  additionalProperties = 'apiPackage=clients,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true';
  openApiFilePath = './openapi.yaml';
  skipValidation = true;

  constructor(options?: Partial<AxiosClientGeneratorOptions>) {
    Object.assign(this, options);
  }
}