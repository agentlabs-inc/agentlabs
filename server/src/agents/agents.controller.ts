import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { LocalAuthenticatedRequest } from '../iam/iam.types';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dtos/create.agent.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';

@ApiBearerAuth()
@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @RequireAuthMethod('local')
  @Post('/create')
  async createAgent(
    @Req() req: LocalAuthenticatedRequest,
    @Body() dto: CreateAgentDto,
  ) {
    const { user } = req;

    const result = await this.agentsService.createAgent({
      name: dto.name,
      projectId: dto.projectId,
      creatorId: user.id,
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

  //@RequireAuthMethod('local')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/listForProject/:projectId')
  async listForProject(
    @Req() req: LocalAuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ListAgentsResponseDto> {
    const { user } = req;

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

  @RequireAuthMethod('local')
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/getById/:agentId')
  async getById(
    @Req() req: LocalAuthenticatedRequest,
    @Param('agentId') agentId: string,
  ): Promise<GetAgentResponseDto> {
    const { user } = req;

    const result = await this.agentsService.getAgentById({
      userId: user.id,
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
