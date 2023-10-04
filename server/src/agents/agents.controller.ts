import {
  Body,
  Controller,
  Get,
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
import { UserAuthenticatedRequest } from 'src/iam/iam.types';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dtos/create.agent.dto';
import { DidAgentEverConnectResponse } from './dtos/did-agent-ever-connect.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';

@ApiBearerAuth()
@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

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

  @Get('/didEverConnect/:agentId')
  async didEverConnect(
    @Param('agentId') agentId: string,
  ): Promise<DidAgentEverConnectResponse> {
    const count = await this.agentsService.getConnectionCount(agentId);

    return {
      didEverConnect: count > 0,
    };
  }

  @ApiUnauthorizedResponse({
    description: 'You are not authorized to access this resource',
  })
  @Post('/listForProject/:projectId')
  async listForProject(
    @Req() req: UserAuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ListAgentsResponseDto> {
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
