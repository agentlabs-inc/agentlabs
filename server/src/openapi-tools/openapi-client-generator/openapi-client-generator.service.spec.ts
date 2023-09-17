import { Test, TestingModule } from '@nestjs/testing';
import { OpenApiClientGeneratorService } from './openapi-client-generator.service';

describe('OpenApiClientGeneratorService', () => {
  let service: OpenApiClientGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenApiClientGeneratorService],
    }).compile();

    service = module.get<OpenApiClientGeneratorService>(
      OpenApiClientGeneratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
