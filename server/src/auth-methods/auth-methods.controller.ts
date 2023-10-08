import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthenticatedRequest } from 'src/iam/iam.types';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { AuthMethodsService } from './auth-methods.service';
import { CreateAuthMethodDto } from './dtos/create.auth-method.dto';
import { CreateDemoAuthMethodsDto } from './dtos/create.demo.auth-method.dto';
import { CreatedAuthMethodDto } from './dtos/created.auth-method.dto';
import { CreatedDemoAuthMethodsDto } from './dtos/created.demo.auth-method.dto';
import { ListAuthMethodResponseDto } from './dtos/list.auth-method.response.dto';

@ApiTags('authMethods')
@ApiBearerAuth()
@Controller('authMethods')
export class AuthMethodsController {
  constructor(private readonly authMethodsService: AuthMethodsService) {}

  @RequireAuthMethod('user-token')
  @Post('/create')
  async createAuthMethod(
    @Req() req: UserAuthenticatedRequest,
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

  @RequireAuthMethod('user-token')
  @Post('/createDemoAuthMethods')
  async createDemoAuthMethod(
    @Req() req: UserAuthenticatedRequest,
    @Body() dto: CreateDemoAuthMethodsDto,
  ): Promise<CreatedDemoAuthMethodsDto> {
    const result = await this.authMethodsService.createDemoAuthMethods({
      ...dto,
      userId: req.user.id,
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
    }
  }

  @RequireAuthMethod('user-token')
  @Get('/listForProject/:projectId')
  async listAuthMethods(
    @Req() req: UserAuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ListAuthMethodResponseDto> {
    const result = await this.authMethodsService.listAuthMethodsForProject({
      projectId,
      userId: req.user.id,
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
    }
  }
}
