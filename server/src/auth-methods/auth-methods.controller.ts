import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { LocalAuthenticatedRequest } from '../iam/iam.types';
import { AuthMethodsService } from './auth-methods.service';
import { CreateAuthMethodDto } from './dtos/create.auth-method.dto';
import { CreatedAuthMethodDto } from './dtos/created.auth-method.dto';

@ApiTags('auth-methods')
@ApiBearerAuth()
@Controller('auth-methods')
export class AuthMethodsController {
  constructor(private readonly authMethodsService: AuthMethodsService) {}

  @RequireAuthMethod('local')
  @Post('/create')
  async createAuthMethod(
    @Req() req: LocalAuthenticatedRequest,
    @Body() dto: CreateAuthMethodDto,
  ): Promise<CreatedAuthMethodDto> {
    const result = await this.authMethodsService.createAuthMethod({
      ...dto,
      creatorId: req.user.id,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          message: 'Project not found',
          code: 'ProjectNotFound',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          message: 'Not a project user',
          code: 'NotAProjectUser',
        });

      case 'AuthMethodAlreadyExists':
        throw new ConflictException({
          message: 'Auth method already exists',
          code: 'AuthMethodAlreadyExists',
        });
    }
  }
}
