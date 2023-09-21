import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuthMethodError,
  VerifyIfIsProjectUserError,
} from './auth-methods.errors';
import { CreateAuthMethodDto } from './dtos/create.auth-method.dto';
import { CreatedAuthMethodDto } from './dtos/created.auth-method.dto';

@Injectable()
export class AuthMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Move this to a shared service with in-memory cache
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

  async createAuthMethod(
    dto: CreateAuthMethodDto & { creatorId: string },
  ): PResult<CreatedAuthMethodDto, CreateAuthMethodError> {
    const verifyResult = await this.verifyIfProjectUser({
      userId: dto.creatorId,
      projectId: dto.projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    try {
      const result = await this.prisma.authMethod.create({
        data: {
          type: dto.type,
          provider: dto.provider,
          isEnabled: dto.isEnabled,
          project: {
            connect: {
              id: dto.projectId,
            },
          },
          clientId: dto.clientId,
          clientSecret: dto.clientSecret,
          scopes: dto.scopes,
        },
      });
      return ok({
        ...result,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return err('AuthMethodAlreadyExists');
        }

        console.error('Error while creating auth method', e);
      }
      throw e;
    }
  }
}
