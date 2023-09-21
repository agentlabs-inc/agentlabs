import { Test, TestingModule } from '@nestjs/testing';
import { AuthMethodsController } from './auth-methods.controller';
import { AuthMethodsService } from './auth-methods.service';

describe('AuthMethodsController', () => {
  let controller: AuthMethodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthMethodsController],
      providers: [AuthMethodsService],
    }).compile();

    controller = module.get<AuthMethodsController>(AuthMethodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
