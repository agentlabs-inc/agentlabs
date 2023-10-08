import { Injectable } from '@nestjs/common';
import { AuthProvider, Member } from '@prisma/client';
import * as dayjs from 'dayjs';
import { readFileSync } from 'fs';
import * as jose from 'jose';
import * as path from 'path';
import { PResult, err, ok } from '../common/result';
import { MailerService } from '../mailer/mailer.service';
import { GoogleService } from '../oauth-providers/google/google.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListMembersResponseDto } from './dtos/list.members.response.dto';
import { LoginMemberResponseDto } from './dtos/login.member.response.dto';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { InjectMembersConfig, MembersConfig } from './members.config';
import {
  ListMembersError,
  OAuthLoginError,
  RegisterMemberVerifyAuthMethodError,
  RegisterPasswordlessEmailError,
  VerifiyIfIsProjectMemberError,
  VerifyIfIsProjectUserError,
  VerifyPasswordlessEmailError,
} from './members.errors';
import { AccessTokenPayload } from './members.types';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectMembersConfig()
    private readonly membersConfig: MembersConfig,
    private readonly mailerService: MailerService,
    private readonly googleService: GoogleService,
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

  async verifyIfProjectMember(params: {
    memberId: string;
    projectId: string;
  }): PResult<{ isVerified: true }, VerifiyIfIsProjectMemberError> {
    const { memberId, projectId } = params;
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
        projectId,
      },
    });

    if (!member) {
      return err('NotAProjectMember');
    }

    return ok({ isVerified: true });
  }

  private async verifyProjectAuthMethod(params: {
    projectId: string;
    provider: AuthProvider;
  }): PResult<
    {
      isVerified: boolean;
    },
    RegisterMemberVerifyAuthMethodError
  > {
    const { projectId, provider } = params;
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
      return method.provider === provider;
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
    return dayjs()
      .add(this.membersConfig.authCodeExpirationDelayInMinutes, 'minute')
      .toDate();
  }

  private generateVerificationCode() {
    return {
      code: this.random6DigitCode(),
      expiresAt: this.random6DigitCodeExpiration(),
    };
  }

  private async generateAccessToken(member: Member): Promise<string> {
    return this.signAccessToken({
      sub: member.id,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      projectId: member.projectId,
    });
  }

  private signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const secret = new TextEncoder().encode(
      this.membersConfig.accessTokenSecret,
    );
    return new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuer('https://agentlabs.dev')
      .setAudience('https://agentlabs.dev')
      .setExpirationTime(this.membersConfig.accessTokenExpirationTime)
      .setIssuedAt()
      .sign(secret);
  }

  async sendVerificationCodeEmail(params: {
    recipientEmail: string;
    code: string;
  }) {
    const { recipientEmail, code } = params;

    const html = readFileSync(
      path.join(__dirname, 'templates', 'passwordless-authentication.hbs'),
      'utf8',
    );

    await this.mailerService.sendEmailWithTemplate({
      template: html,
      recipientEmail,
      subject: 'Your authentication code',
      substitutions: {
        code,
        expireInMinutes: this.membersConfig.authCodeExpirationDelayInMinutes,
      },
    });
  }

  public async verifyAccessToken(jwt: string) {
    const secret = new TextEncoder().encode(
      this.membersConfig.accessTokenSecret,
    );
    const { payload } = await jose.jwtVerify(jwt, secret);

    return payload;
  }

  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: {
        id,
      },
    });
  }

  async listMembers(params: {
    userId: string;
    projectId: string;
    limit: number;
    page: number;
  }): PResult<ListMembersResponseDto, ListMembersError> {
    const { userId, projectId, limit, page } = params;

    const verify = await this.verifyIfProjectUser({
      projectId,
      userId,
    });

    if (!verify.ok) {
      return err(verify.error);
    }

    const count = await this.prisma.member.count({
      where: {
        projectId,
      },
    });

    const members = await this.prisma.member.findMany({
      where: {
        projectId,
      },
      take: limit,
      skip: limit * (page - 1),
    });

    return ok({
      items: members,
      resultCount: members.length,
      totalCount: count,
      hasMore: count > limit * page,
    });
  }

  async requestPasswordlessEmail(params: {
    projectId: string;
    email: string;
  }): PResult<RegisterResponseDto, RegisterPasswordlessEmailError> {
    const { projectId, email } = params;

    const verifyMethodResult = await this.verifyProjectAuthMethod({
      projectId,
      provider: 'PASSWORDLESS_EMAIL',
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
          const memberCreated = await tx.member.create({
            data: {
              projectId,
              email,
              firstName: null,
              lastName: null,
              verificationCode: {
                create: {
                  projectId,
                  code: verificationCode.code,
                  expiresAt: verificationCode.expiresAt,
                },
              },
              identities: {
                create: [
                  {
                    provider: 'PASSWORDLESS_EMAIL',
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
          await this.sendVerificationCodeEmail({
            recipientEmail: email,
            code: verificationCode.code,
          });
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
                      provider: 'PASSWORDLESS_EMAIL',
                    },
                  },
                  create: {
                    provider: 'PASSWORDLESS_EMAIL',
                    providerUserId: email,
                  },
                },
              ],
            },
            verificationCode: {
              upsert: {
                where: {
                  projectId: projectId,
                  memberId: member.id,
                },
                update: {
                  code: verificationCode.code,
                  expiresAt: verificationCode.expiresAt,
                },
                create: {
                  projectId: projectId,
                  code: verificationCode.code,
                  expiresAt: verificationCode.expiresAt,
                },
              },
            },
          },
        });

        await this.sendVerificationCodeEmail({
          recipientEmail: email,
          code: verificationCode.code,
        });

        return memberUpdated;
      },
    );

    return ok(memberCreatedOrUpdated);
  }

  async verifyPasswordlessEmail(params: {
    projectId: string;
    email: string;
    code: string;
  }): PResult<LoginMemberResponseDto, VerifyPasswordlessEmailError> {
    const { email, code } = params;

    const verificationCode =
      await this.prisma.memberAuthVerificationCode.findFirst({
        where: {
          projectId: params.projectId,
          code,
          member: {
            email,
          },
        },
        include: {
          member: true,
        },
      });

    if (!verificationCode) {
      return err('CodeNotFound');
    }

    if (verificationCode.expiresAt < new Date()) {
      return err('CodeExpired');
    }

    if (!verificationCode.member) {
      return err('MemberNotFound');
    }

    if (!!verificationCode.member.bannedAt) {
      return err('MemberBanned');
    }

    const member = verificationCode.member;

    const accessToken = await this.generateAccessToken(member);

    await this.prisma.$transaction(async () => {
      await this.prisma.memberAuthVerificationCode.delete({
        where: {
          projectId_memberId: {
            projectId: params.projectId,
            memberId: member.id,
          },
        },
      });

      await this.prisma.memberIdentity.update({
        where: {
          memberId_provider: {
            memberId: member.id,
            provider: 'PASSWORDLESS_EMAIL',
          },
        },
        data: {
          lastSignedInAt: new Date(),
        },
      });

      if (!member.verifiedAt) {
        await this.prisma.member.update({
          where: {
            id: member.id,
          },
          data: {
            verifiedAt: new Date(),
          },
        });
      }
    });

    return ok({
      accessToken,
      member: {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        verifiedAt: member.verifiedAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });
  }

  private async upsertMemberWithOAuth(params: {
    email: string;
    firstName?: string;
    lastName?: string;
    pictureUrl: string;
    signInMethod: 'google';
    providerUserId: string;
    isVerified: boolean;
    projectId: string;
    fullName: string;
  }): Promise<Member> {
    const { projectId, email, firstName, lastName, pictureUrl, fullName } =
      params;
    const memberCreatedOrUpdated = await this.prisma.$transaction(
      async (tx) => {
        const member = await tx.member.findFirst({
          where: {
            email,
          },
        });

        if (!member) {
          const memberCreated = await tx.member.create({
            data: {
              email,
              firstName,
              lastName,
              fullName,
              profilePictureUrl: pictureUrl,
              verifiedAt: params.isVerified ? new Date() : null,
              project: {
                connect: {
                  id: projectId,
                },
              },
            },
          });

          return memberCreated;
        }

        const memberUpdated = await tx.member.update({
          where: {
            id: member.id,
          },
          data: {
            email: email,
            fullName: fullName ?? member.fullName,
            firstName: firstName ?? member.firstName,
            lastName: lastName ?? member.lastName,
            profilePictureUrl: pictureUrl ?? member.profilePictureUrl,
            verifiedAt:
              member.verifiedAt ?? (params.isVerified ? new Date() : null),
          },
        });

        return memberUpdated;
      },
    );

    return memberCreatedOrUpdated;
  }

  async completeOAuthLogin(params: {
    code: string;
    state: string;
    redirectUri: string;
    providerId: string;
    projectId: string;
  }): PResult<LoginMemberResponseDto, OAuthLoginError> {
    const { projectId, providerId, code, state, redirectUri } = params;

    if (providerId !== 'GOOGLE') {
      return err('UnsupportedOAuthProvider');
    }

    const authMethod = await this.prisma.authMethod.findUnique({
      where: {
        projectId_provider_type: {
          provider: providerId,
          projectId,
          type: 'OAUTH2',
        },
      },
    });

    if (!authMethod?.isEnabled) {
      return err('DisabledAuthMethod');
    }

    const clientSecret =
      authMethod.clientSecret ?? this.membersConfig.googleDemoClientSecret;
    const clientId =
      authMethod.clientId ?? this.membersConfig.googleDemoClientId;

    if (!clientSecret) {
      return err('MissingClientSecret');
    }

    if (!clientId) {
      return err('MissingClientId');
    }

    const result = await this.googleService.getToken({
      code,
      clientSecret,
      clientId,
      redirectUri,
    });

    if (!result) {
      return err('TokenRequestFailed');
    }

    const user = await this.googleService.getUserInfo(result.access_token);

    if (!user) {
      return err('ImpossibleToGetUserInfo');
    }

    const memberCreatedOrUpdated = await this.upsertMemberWithOAuth({
      projectId,
      email: user.email,
      fullName: user.name,
      firstName: user.given_name,
      lastName: user.family_name,
      pictureUrl: user.picture,
      signInMethod: 'google',
      providerUserId: user.sub,
      isVerified: user.email_verified,
    });

    const ourAccessToken = await this.generateAccessToken(
      memberCreatedOrUpdated,
    );

    return ok({
      accessToken: ourAccessToken,
      member: memberCreatedOrUpdated,
    });
  }
}
