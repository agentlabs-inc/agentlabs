import { Injectable } from '@nestjs/common';
import { AuthMethod, AuthMethodType, Prisma } from '@prisma/client';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { PResult, err, ok } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthMethodsConfig,
  InjectAuthMethodsConfig,
} from './auth-methods.config';
import {
  CreateAuthMethodError,
  CreateDemoAuthMethodsError,
  ListAuthMethodsError,
  UpsertAuthMethodError,
  VerifyIfIsProjectUserError,
} from './auth-methods.errors';
import { CreateAuthMethodDto } from './dtos/create.auth-method.dto';
import {
  CreateDemoAuthMethodsDto,
  SelectedAuthMethod,
} from './dtos/create.demo.auth-method.dto';
import { CreatedAuthMethodDto } from './dtos/created.auth-method.dto';
import { CreatedDemoAuthMethodsDto } from './dtos/created.demo.auth-method.dto';
import { ListAuthMethodResponseDto } from './dtos/list.auth-method.response.dto';
import { UpsertAuthMethodDto } from './dtos/upsert.auth-method.dto';
import { UpsertedAuthMethodDto } from './dtos/upserted.auth-method.dto';

@Injectable()
export class AuthMethodsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectAuthMethodsConfig()
    private readonly config: AuthMethodsConfig,
  ) {}

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
      const encrypted = this.encryptSecret(dto.clientSecret);

      const result = await this.prisma.authMethod.create({
        data: {
          type: this.determineMethodTypeFromProvider(dto.provider),
          provider: dto.provider,
          isEnabled: dto.isEnabled,
          project: {
            connect: {
              id: dto.projectId,
            },
          },
          clientId: dto.clientId,
          clientSecret: encrypted?.encrypted ?? null,
          clientSecretIv: encrypted?.iv ?? null,
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

  private encryptSecret(secret: string | null): null | {
    iv: string;
    encrypted: string;
  } {
    if (!secret) {
      return null;
    }

    const initVector = randomBytes(16);

    const cipher = createCipheriv(
      this.config.authMethodSecretEncryptionAlgorithm,
      Buffer.from(this.config.authMethodSecretEncryptionKey, 'hex'),
      initVector,
    );

    let encrypted = cipher.update(secret, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: initVector.toString('hex'),
      encrypted: encrypted,
    };
  }

  public decryptSecret(
    secret: string | null,
    iv: string | null,
  ): string | null {
    if (!secret || !iv) {
      return null;
    }

    const initVector = Buffer.from(iv, 'hex');

    const decipher = createDecipheriv(
      this.config.authMethodSecretEncryptionAlgorithm,
      Buffer.from(this.config.authMethodSecretEncryptionKey, 'hex'),
      initVector,
    );

    let result = decipher.update(secret, 'hex', 'utf-8');
    result += decipher.final('utf-8');
    return result;
  }

  private sanitizeAuthMethod(method: AuthMethod) {
    return {
      projectId: method.projectId,
      type: method.type,
      provider: method.provider,
      isEnabled: method.isEnabled,
      clientId: method.clientId,
      clientSecret: this.decryptSecret(
        method.clientSecret,
        method.clientSecretIv,
      ),
      scopes: method.scopes,
      createdAt: method.createdAt,
      updatedAt: method.updatedAt,
    };
  }

  private determineMethodTypeFromProvider(provider: string): AuthMethodType {
    const oauth = ['GOOGLE', 'GITHUB', 'GITLAB', 'MICROSOFT'];

    if (oauth.includes(provider)) {
      return 'OAUTH2';
    }

    const email = ['PASSWORDLESS_EMAIL', 'EMAIL_AND_PASSWORD'];

    if (email.includes(provider)) {
      return 'EMAIL';
    }

    if (provider === 'SMS') {
      return 'PHONE_NUMBER';
    }

    return 'ANONYMOUS';
  }

  async upsertAuthMethod(
    dto: UpsertAuthMethodDto & { userId: string },
  ): PResult<UpsertedAuthMethodDto, UpsertAuthMethodError> {
    const verifyResult = await this.verifyIfProjectUser({
      userId: dto.userId,
      projectId: dto.projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const encryptionResult = this.encryptSecret(dto.clientSecret);
    const data = {
      type: this.determineMethodTypeFromProvider(dto.provider),
      provider: dto.provider,
      isEnabled: dto.isEnabled,
      clientId: dto.clientId,
      clientSecret: encryptionResult?.encrypted ?? null,
      clientSecretIv: encryptionResult?.iv ?? null,
    };

    const createdOrUpdated = await this.prisma.authMethod.upsert({
      where: {
        projectId_provider: {
          projectId: dto.projectId,
          provider: dto.provider,
        },
      },
      create: {
        ...data,
        project: {
          connect: {
            id: dto.projectId,
          },
        },
      },
      update: {
        ...data,
      },
    });

    return ok(
      this.sanitizeAuthMethod({
        ...createdOrUpdated,
      }),
    );
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
      items: authMethods.map((authMethod) =>
        this.sanitizeAuthMethod(authMethod),
      ),
      total: authMethods.length,
    });
  }

  private selectedMethodToAuthMethodData(
    selectedMethod: SelectedAuthMethod,
  ): Omit<
    AuthMethod,
    'createdAt' | 'updatedAt' | 'projectId' | 'clientSecretIv'
  > {
    switch (selectedMethod) {
      case 'PASSWORDLESS_EMAIL':
        return {
          type: 'EMAIL',
          provider: 'PASSWORDLESS_EMAIL',
          isEnabled: true,
          scopes: [],
          clientId: null,
          clientSecret: null,
        };

      case 'GOOGLE':
        return {
          type: 'OAUTH2',
          provider: 'GOOGLE',
          isEnabled: true,
          scopes: [],
          clientId: null,
          clientSecret: null,
        };
    }
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

    const { methods } = params;

    const partialAuthMethods = methods.map((method) => {
      return this.selectedMethodToAuthMethodData(method);
    });

    const onboarding = await this.prisma.onboarding.findUnique({
      where: {
        userId: params.userId,
        projectId: params.projectId,
      },
    });

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const partialAuthMethod of partialAuthMethods) {
          await tx.authMethod.create({
            data: {
              ...partialAuthMethod,
              project: {
                connect: {
                  id: params.projectId,
                },
              },
            },
          });
        }

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
