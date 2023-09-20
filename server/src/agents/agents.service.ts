import { Injectable } from '@nestjs/common';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentError, VerifyIfIsProjectUserError } from './agents.errors';
import { CreatedAgentDto } from './dtos/created.agent.dto';
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

  async listProjectAgents(params: {
    userId: string;
    projectId: string;
  }): PResult<ListAgentsResponseDto, VerifyIfIsProjectUserError> {
    const { userId, projectId } = params;

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
      },
    });

    return ok({
      items: agents.map((agent) => ({ ...agent })),
      total: agents.length,
    });
  }
}
