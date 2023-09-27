import { Injectable } from '@nestjs/common';
import { AuthMethodType } from '@prisma/client';
import * as dayjs from 'dayjs';
import { err, ok, PResult } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterResponseDto } from './dtos/register.response.dto';
import {
  RegisterMemberVerifyAuthMethodError,
  RegisterPasswordlessEmailError,
} from './members.errors';

export const AUTH_CODE_EXPIRATION_DELAY_MINUTES = 15;

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyProjectAuthMethod(params: {
    projectId: string;
    authMethodType: AuthMethodType;
  }): PResult<
    {
      isVerified: boolean;
    },
    RegisterMemberVerifyAuthMethodError
  > {
    const { projectId, authMethodType } = params;
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        authMethods: true,
      },
    });

    if (!project) {
      return err('ProjectNotFound');
    }

    const authMethod = project.authMethods.find((method) => {
      return method.type === authMethodType;
    });

    if (!authMethod) {
      return err('AuthMethodNotConfigured');
    }

    if (!authMethod.isEnabled) {
      return err('DisabledAuthMethod');
    }

    return ok({
      isVerified: true,
    });
  }

  private random6DigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private random6DigitCodeExpiration(): Date {
    return dayjs().add(AUTH_CODE_EXPIRATION_DELAY_MINUTES, 'minute').toDate();
  }

  private generateVerificationCode() {
    return {
      code: this.random6DigitCode(),
      expiresAt: this.random6DigitCodeExpiration(),
    };
  }

  async requestPasswordlessEmail(params: {
    projectId: string;
    email: string;
  }): PResult<RegisterResponseDto, RegisterPasswordlessEmailError> {
    const { projectId, email } = params;

    const verifyMethodResult = await this.verifyProjectAuthMethod({
      projectId,
      authMethodType: 'PASSWORDLESS_EMAIL',
    });

    if (!verifyMethodResult.ok) {
      return err(verifyMethodResult.error);
    }

    const memberCreatedOrUpdated = await this.prisma.$transaction(
      async (tx) => {
        const member = await tx.member.findFirst({
          where: {
            projectId,
            email,
          },
        });

        const verificationCode = this.generateVerificationCode();

        if (!member) {
          const memberCreated = tx.member.create({
            data: {
              projectId,
              email,
              firstName: null,
              lastName: null,
              verificationCode: {
                create: verificationCode,
              },
              identities: {
                create: [
                  {
                    provider: 'EMAIL',
                    providerUserId: email,
                    lastSignedInAt: null,
                    accessToken: null,
                    refreshToken: null,
                    accessTokenExpiresAt: null,
                    refreshTokenExpiresAt: null,
                  },
                ],
              },
            },
          });
          // TODO: send verification code email
          return memberCreated;
        }

        const memberUpdated = await tx.member.update({
          where: {
            id: member.id,
          },
          data: {
            email: email,
            firstName: null,
            lastName: null,
            identities: {
              connectOrCreate: [
                {
                  where: {
                    memberId_provider: {
                      memberId: member.id,
                      provider: 'EMAIL',
                    },
                  },
                  create: {
                    provider: 'EMAIL',
                    providerUserId: email,
                  },
                },
              ],
            },
            verificationCode: {
              connectOrCreate: {
                where: {
                  memberId: member.id,
                },
                create: {
                  code: verificationCode.code,
                  expiresAt: verificationCode.expiresAt,
                },
              },
            },
          },
        });
        // TODO: send verification code email

        return memberUpdated;
      },
    );

    return ok(memberCreatedOrUpdated);
  }
}
