import { Injectable } from '@nestjs/common';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAgentError,
  GetAgentByIdError,
  VerifyIfIsProjectUserError,
} from './agents.errors';
import { CreatedAgentDto } from './dtos/created.agent.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyIfProjectUser(params: {
    userId: string;
    projectId: string;
  }): PResult<{ isVerified: true }, VerifyIfIsProjectUserError> {
    const { userId, projectId } = params;
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        organization: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!project) {
      return err('ProjectNotFound');
    }

    if (!project?.organization?.users?.find((user) => user.userId === userId)) {
      return err('NotAProjectUser');
    }

    return ok({ isVerified: true });
  }

  async createAgent(dto: {
    name: string;
    projectId: string;
    creatorId: string;
  }): PResult<CreatedAgentDto, CreateAgentError> {
    const verifyResult = await this.verifyIfProjectUser({
      userId: dto.creatorId,
      projectId: dto.projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const result = await this.prisma.agent.create({
      data: {
        name: dto.name,
        creator: {
          connect: {
            id: dto.creatorId,
          },
        },
        project: {
          connect: {
            id: dto.projectId,
          },
        },
      },
    });

    return ok({
      ...result,
    });
  }

  async getConnectionCount(agentId: string): Promise<number> {
    const eventCount = await this.prisma.agentConnectionEvent.count({
      where: {
        agentId,
      },
    });

    return eventCount;
  }

  async listProjectAgents(params: {
    projectId: string;
  }): PResult<ListAgentsResponseDto, VerifyIfIsProjectUserError> {
    const { projectId } = params;

    /*
    const verifyResult = await this.verifyIfProjectUser({
      userId,
      projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }
	*/

    const agents = await this.prisma.agent.findMany({
      where: {
        projectId,
      },
    });

    return ok({
      items: agents.map((agent) => ({ ...agent })),
      total: agents.length,
    });
  }

  async getAgentById(params: {
    agentId: string;
  }): PResult<GetAgentResponseDto, GetAgentByIdError> {
    const { agentId } = params;

    const agent = await this.prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    });

    if (!agent) {
      return err('AgentNotFound');
    }

    /*
    const projectId = agent.projectId;

    const verifyResult = await this.verifyIfProjectUser({
      userId,
      projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }
	*/

    return ok(agent);
  }
}
