import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserAuthenticatedRequest } from 'src/iam/iam.types';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { TelemetryService } from '../telemetry/telemetry.service';
import { CreateProjectDto } from './dtos/create.project.dto';
import { CreatedProjectDto } from './dtos/created.project.dto';
import { GetPublicConfigDto } from './dtos/get.public.config.dto';
import { ListProjectsResultDto } from './dtos/list.projects.result.dto';
import { ProjectDto } from './dtos/project.dto';
import { ProjectExistsResponseDto } from './dtos/project.exists.response.dto';
import { PublicProjectConfigDto } from './dtos/public.project.config.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @RequireAuthMethod('user-token')
  @Post('/create')
  async createProject(
    @Req() req: UserAuthenticatedRequest,
    @Body() dto: CreateProjectDto,
  ): Promise<CreatedProjectDto> {
    const { user } = req;

    const result = await this.projectsService.createProject({
      ...dto,
      creatorId: user.id,
    });

    if (result.ok) {
      this.telemetryService.track({
        userId: user.id,
        event: 'Project Created',
      });
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

  @RequireAuthMethod('user-token')
  @Get(`/listForOrganization/:organizationId`)
  async listOrganizationProjects(
    @Req() req: UserAuthenticatedRequest,
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

  @RequireAuthMethod('user-token')
  @Get('/exists/:slug')
  async projectExists(
    @Param('slug') slug: string,
  ): Promise<ProjectExistsResponseDto> {
    const exists = await this.projectsService.projectExists(slug);

    return {
      exists,
    };
  }

  @RequireAuthMethod('user-token')
  @Get('/getById/:projectId')
  async getById(@Param('projectId') projectId: string): Promise<ProjectDto> {
    const result = await this.projectsService.getById(projectId);

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new NotFoundException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });
    }
  }

  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable hostname or unknown project',
  })
  @Get('/getPublicConfig')
  async getPublicConfig(
    @Query() queryParams: GetPublicConfigDto,
  ): Promise<PublicProjectConfigDto> {
    const config = await this.projectsService.getPublicConfig(
      queryParams.hostname,
    );

    if (config.ok) {
      return config.value;
    }

    switch (config.error) {
      case 'UnprocessableHostname':
        throw new UnprocessableEntityException({
          code: 'UnprocessableHostname',
          message: 'Unprocessable hostname',
        });

      case 'ProjectNotFound':
        throw new UnprocessableEntityException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });
    }
  }
}
