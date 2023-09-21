import { Test, TestingModule } from '@nestjs/testing';
import { AuthMethodsService } from './auth-methods.service';

describe('AuthMethodsService', () => {
  let service: AuthMethodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMethodsService],
    }).compile();

    service = module.get<AuthMethodsService>(AuthMethodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
