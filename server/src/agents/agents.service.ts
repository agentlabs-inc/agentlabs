import { Injectable } from '@nestjs/common';
import { Agent } from '@prisma/client';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { PResult, err, ok } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import { acceptedLogoMimeTypes } from './agents.constants';
import {
  CreateAgentError,
  GetAgentByIdError,
  UpdateAgentError,
  UploadAgentLogoError,
  VerifyIfCanUpdateAgentError,
  VerifyIfIsProjectUserError,
} from './agents.errors';
import { CreatedAgentDto } from './dtos/created.agent.dto';
import { GetAgentResponseDto } from './dtos/get.agent.response.dto';
import { ListAgentsResponseDto } from './dtos/list.agents.response.dto';
import { UpdatedAgentDto } from './dtos/updated.agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

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

  async verifyIfCanUpdateAgent(params: {
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

  private isAcceptedAgentLogoMimeType(mimeType: string): boolean {
    return acceptedLogoMimeTypes.includes(mimeType);
  }

  findAgentById(agentId: string): Promise<Agent | null> {
    const agent = this.prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    });

    return agent;
  }

  async uploadAgentLogo(
    agentId: string,
    buffer: Buffer,
    mimeType: string,
  ): PResult<{ isUploaded: true }, UploadAgentLogoError> {
    const isAcceptedMimeType = this.isAcceptedAgentLogoMimeType(mimeType);

    if (!isAcceptedMimeType) {
      return err('ProhibitedMimeType');
    }

    const attachment = await this.attachmentsService.createOneSync({
      mimeType,
      data: buffer,
      filename: `${agentId}-logo`,
      isPublic: true,
    });

    await this.prisma.agent.update({
      data: {
        logoUrl: `/api/attachments/viewById/${attachment.id}`,
      },
      where: {
        id: agentId,
      },
    });

    return ok({ isUploaded: true });
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
    const eventCount = await this.prisma.agentConnectionLog.count({
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
        deletedAt: null,
      },
    });

    return ok({
      items: agents.map((agent) => ({ ...agent })),
      total: agents.length,
    });
  }

  async findProjectAgent(
    projectId: string,
    agentId: string,
  ): Promise<Agent | null> {
    const agent = await this.prisma.agent.findUnique({
      where: {
        id: agentId,
        projectId,
      },
    });

    return agent;
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
