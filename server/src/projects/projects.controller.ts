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
import { RequireAuthMethod } from '../iam/iam.decorators';
import { LocalAuthenticatedRequest } from '../iam/iam.types';
import { CreateProjectDto } from './dtos/create.project.dto';
import { CreatedProjectDto } from './dtos/created.project.dto';
import { ListProjectsResultDto } from './dtos/list.projects.result.dto';
import { ProjectExistsResponseDto } from './dtos/project.exists.response.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @RequireAuthMethod('local')
  @Post('/create')
  async createProject(
    @Req() req: LocalAuthenticatedRequest,
    @Body() dto: CreateProjectDto,
  ): Promise<CreatedProjectDto> {
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
  @Get(`/listForOrganization/:organizationId`)
  async listOrganizationProjects(
    @Req() req: LocalAuthenticatedRequest,
    @Param('organizationId') organizationId: string,
  ): Promise<ListProjectsResultDto> {
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

  @RequireAuthMethod('local')
  @Get('/exists/:slug')
  async projectExists(
    @Req() req: LocalAuthenticatedRequest,
    @Param('slug') slug: string,
  ): Promise<ProjectExistsResponseDto> {
    const exists = await this.projectsService.projectExists(slug);

    return {
      exists,
    };
  }
}
