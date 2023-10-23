import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  MemberAuthenticatedRequest,
  UserAuthenticatedRequest,
} from 'src/iam/iam.types';
import { ProjectsService } from 'src/projects/projects.service';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { TelemetryService } from '../telemetry/telemetry.service';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dtos/create.agent.dto';
import { DeletedAgentResponseDto } from './dtos/deleted.agent.response.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';
import { UpdateAgentDto } from './dtos/update.agent.dto';
import { UpdatedAgentDto } from './dtos/updated.agent.dto';

@ApiBearerAuth()
@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly projectsService: ProjectsService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @RequireAuthMethod('user-token')
  @Post('/create')
  async createAgent(
    @Req() req: UserAuthenticatedRequest,
    @Body() dto: CreateAgentDto,
  ) {
    const { user } = req;

    const result = await this.agentsService.createAgent({
      name: dto.name,
      projectId: dto.projectId,
      creatorId: user.id,
    });

    if (result.ok) {
      this.telemetryService.track({
        event: 'Agent Created',
        userId: user.id,
      });
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @RequireAuthMethod('user-token')
  @Post('uploadLogo/:agentId')
  async uploadLogo(
    @Param('agentId') agentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UserAuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const verifyResult = await this.agentsService.verifyIfCanUpdateAgent({
      agentId,
      userId: req.user.id,
    });

    if (!verifyResult.ok) {
      throw new ForbiddenException('You are not allowed to update this agent');
    }

    const uploadResult = await this.agentsService.uploadAgentLogo(
      agentId,
      file.buffer,
      file.mimetype,
    );

    if (!uploadResult.ok) {
      switch (uploadResult.error) {
        case 'ProhibitedMimeType':
          throw new BadRequestException({
            code: 'ProhibitedMimeType',
            message: 'Prohibited mime type',
          });
      }
    }

    return {
      success: true,
    };
  }

  @RequireAuthMethod('member-token', 'user-token')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/update/:agentId')
  async updateAgent(
    @Req() req: UserAuthenticatedRequest,
    @Param('agentId') agentId: string,
    @Body() dto: UpdateAgentDto,
  ): Promise<UpdatedAgentDto> {
    const result = await this.agentsService.updateAgent({
      userId: req.user.id,
      agentId,
      data: {
        name: dto.name,
      },
    });

    if (result.ok) {
      this.telemetryService.track({
        event: 'Agent Updated',
        userId: req.user.id,
      });
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });

      case 'AgentNotFound':
        throw new UnauthorizedException({
          code: 'AgentNotFound',
          message: 'Agent not found',
        });
    }
  }

  @RequireAuthMethod('member-token', 'user-token')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Delete('/delete/:agentId')
  async deleteAgent(
    @Req() req: UserAuthenticatedRequest,
    @Param('agentId') agentId: string,
  ): Promise<DeletedAgentResponseDto> {
    const result = await this.agentsService.deleteAgent({
      userId: req.user.id,
      agentId,
    });

    if (result.ok) {
      this.telemetryService.track({
        event: 'Agent Deleted',
        userId: req.user.id,
      });
      return { success: true };
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });

      case 'AgentNotFound':
        throw new UnauthorizedException({
          code: 'AgentNotFound',
          message: 'Agent not found',
        });
    }
  }

  @RequireAuthMethod('member-token', 'user-token')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/listForProject/:projectId')
  async listForProject(
    @Param('projectId') projectId: string,
    @Req() req: UserAuthenticatedRequest | MemberAuthenticatedRequest,
  ): Promise<ListAgentsResponseDto> {
    let isAllowed = true;

    if (req.authMethod === 'user-token') {
      isAllowed = await this.projectsService.isProjectUserById({
        projectId,
        userId: req.user.id,
      });
    } else {
      isAllowed = await this.projectsService.isProjectMemberById({
        projectId,
        memberId: req.member.id,
      });
    }

    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to list agents for this project',
      );
    }

    const result = await this.agentsService.listProjectAgents({
      projectId,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });
    }
  }

  @RequireAuthMethod('user-token')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/getById/:agentId')
  async getById(
    @Param('agentId') agentId: string,
  ): Promise<GetAgentResponseDto> {
    const result = await this.agentsService.getAgentById({
      agentId,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'AgentNotFound':
        throw new UnauthorizedException({
          code: 'AgentNotFound',
          message: 'Agent not found',
        });
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });
    }
  }
}
