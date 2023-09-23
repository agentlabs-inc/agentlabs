import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuthMethodError,
  CreateDemoAuthMethodsError,
  ListAuthMethodsError,
  VerifyIfIsProjectUserError,
} from './auth-methods.errors';
import { CreateAuthMethodDto } from './dtos/create.auth-method.dto';
import { CreateDemoAuthMethodsDto } from './dtos/create.demo.auth-method.dto';
import { CreatedAuthMethodDto } from './dtos/created.auth-method.dto';
import { CreatedDemoAuthMethodsDto } from './dtos/created.demo.auth-method.dto';
import { ListAuthMethodResponseDto } from './dtos/list.auth-method.response.dto';

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

  async listAuthMethodsForProject(params: {
    userId: string;
    projectId: string;
  }): PResult<ListAuthMethodResponseDto, ListAuthMethodsError> {
    const verifyResult = await this.verifyIfProjectUser(params);
    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const authMethods = await this.prisma.authMethod.findMany({
      where: {
        projectId: params.projectId,
      },
    });

    return ok({
      items: authMethods.map((authMethod) => ({ ...authMethod })),
      total: authMethods.length,
    });
  }

  async createDemoAuthMethods(
    params: CreateDemoAuthMethodsDto & { userId: string },
  ): PResult<CreatedDemoAuthMethodsDto, CreateDemoAuthMethodsError> {
    const verifyResult = await this.verifyIfProjectUser({
      userId: params.userId,
      projectId: params.projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const emailProvider = params.methodTypes.find(
      (type) => type === 'PASSWORDLESS_EMAIL',
    );

    if (!emailProvider) {
      return err('OnlyEmailMethodAcceptedAtTheMoment');
    }

    const onboarding = await this.prisma.onboarding.findUnique({
      where: {
        userId: params.userId,
        projectId: params.projectId,
      },
    });

    // At the moment we only support passwordless email but we'll support more soon.
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.authMethod.create({
          data: {
            type: 'PASSWORDLESS_EMAIL',
            provider: 'EMAIL',
            isEnabled: true,
            scopes: [],
            hasClientSecret: false,
            clientId: null,
            clientSecret: null,
            project: {
              connect: {
                id: params.projectId,
              },
            },
          },
        });

        if (onboarding?.id && !onboarding.hasAddedAuthMethod) {
          await tx.onboarding.update({
            where: {
              id: onboarding.id,
            },
            data: {
              hasAddedAuthMethod: true,
            },
          });
        }
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          // We want it to be idempotent if it exists already.
          return ok({ success: true });
        }

        console.error('Error while creating auth method', e);
      }
    }

    return ok({ success: true });
  }
}
