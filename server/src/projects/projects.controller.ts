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
import { ApiTags } from '@nestjs/swagger';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { LocalAuthenticatedRequest } from '../iam/iam.types';
import { CreateProjectDto } from './dtos/create.project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @RequireAuthMethod('local')
  @Post('/create')
  async createProject(
    @Req() req: LocalAuthenticatedRequest,
    @Body() dto: CreateProjectDto,
  ) {
    const { user } = req;

    const result = await this.projectsService.createProject({
      ...dto,
      creatorId: user.id,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'OrganizationNotFound':
        throw new UnauthorizedException({
          code: 'OrganizationNotFound',
          message: 'Organization not found',
        });

      case 'NotAnOrganizationUser':
        throw new UnauthorizedException({
          code: 'NotAnOrganizationUser',
          message: 'Not an organization user',
        });

      case 'SlugAlreadyTaken':
        throw new ConflictException({
          code: 'SlugAlreadyTaken',
          message: 'Slug already taken',
        });
    }
  }

  @RequireAuthMethod('local')
  @Get(`/list_for_organization/:organizationId`)
  async listOrganizationProjects(
    @Req() req: LocalAuthenticatedRequest,
    @Param('organizationId') organizationId: string,
  ) {
    const { user } = req;

    const result = await this.projectsService.listOrganizationProjects({
      userId: user.id,
      organizationId,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'OrganizationNotFound':
        throw new UnauthorizedException({
          code: 'OrganizationNotFound',
          message: 'Organization not found',
        });

      case 'NotAnOrganizationUser':
        throw new UnauthorizedException({
          code: 'NotAnOrganizationUser',
          message: 'Not an organization user',
        });
    }
  }
}
