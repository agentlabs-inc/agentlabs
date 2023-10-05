import { Injectable } from '@nestjs/common';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAgentError,
  GetAgentByIdError,
  UpdateAgentError,
  VerifyIfCanUpdateAgentError,
  VerifyIfIsProjectUserError,
} from './agents.errors';
import { CreatedAgentDto } from './dtos/created.agent.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';
import { UpdatedAgentDto } from './dtos/updated.agent.dto';

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

  private async verifyIfCanUpdateAgent(params: {
    userId: string;
    agentId: string;
  }): PResult<{ isVerified: true }, VerifyIfCanUpdateAgentError> {
    const { userId, agentId } = params;
    const agent = await this.prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    });

    if (!agent) {
      return err('AgentNotFound');
    }

    const { projectId } = agent;

    return this.verifyIfProjectUser({
      userId,
      projectId,
    });
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
  async updateAgent(dto: {
    agentId: string;
    userId: string;
    data: {
      name: string;
    };
  }): PResult<UpdatedAgentDto, UpdateAgentError> {
    const verifyResult = await this.verifyIfCanUpdateAgent({
      userId: dto.userId,
      agentId: dto.agentId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const result = await this.prisma.agent.update({
      where: {
        id: dto.agentId,
      },
      data: {
        name: dto.data.name,
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

  async deleteAgent(params: {
    agentId: string;
    userId: string;
  }): PResult<boolean, VerifyIfCanUpdateAgentError> {
    const { agentId, userId } = params;

    const verifyResult = await this.verifyIfCanUpdateAgent({
      userId,
      agentId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    await this.prisma.agent.update({
      where: {
        id: agentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return ok(true);
  }

  async listProjectAgents(params: {
    userId: string;
    projectId: string;
  }): PResult<ListAgentsResponseDto, VerifyIfIsProjectUserError> {
    const { projectId, userId } = params;

    const verifyResult = await this.verifyIfProjectUser({
      userId,
      projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const agents = await this.prisma.agent.findMany({
      where: {
        projectId,
        deletedAt: null,
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
