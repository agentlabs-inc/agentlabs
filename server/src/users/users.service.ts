import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Result, err, ok } from '../common/result';
import { RegisterUserDto } from './dtos/register.user.dto';
import { UserCreatedDto } from './responses/user.created.dto';
import { RegisterUserError } from './users.service.errors';
import { CreatePasswordHashConfig } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {
    //
  }

  private generatePasswordHashConfig(): CreatePasswordHashConfig {
    return {
      algorithm: 'scrypt',
      memCost: 16384,
      keyLength: 32,
      salt: randomBytes(16).toString('hex'),
    };
  }

  private generatePasswordHash(
    password: string,
    hashConfig: CreatePasswordHashConfig,
  ): string {
    const hash = scryptSync(password, hashConfig.salt, hashConfig.keyLength, {
      cost: hashConfig.memCost,
    });

    return hash.toString('hex');
  }

  async registerWithEmailAndPassword(
    dto: RegisterUserDto,
  ): Promise<Result<UserCreatedDto, RegisterUserError>> {
    const hashConfig = this.generatePasswordHashConfig();

    try {
      const result = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: this.generatePasswordHash(dto.password, hashConfig),
          passwordHashConfig: {
            create: {
              ...hashConfig,
            },
          },
          fullName: dto.fullName,
          isVerified: false,
        },
        include: {
          passwordHashConfig: false,
        },
      });

      // TODO: send validation email

      return ok({
        id: result.id,
        email: result.email,
        fullName: result.fullName,
        hasPassword: result.hasPassword,
        isVerified: result.isVerified,
        lookupId: result.lookupId,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return err('UserAlreadyExists');
        }
      }

      console.error('Error while registering user', e);

      return err('UnknownError');
    }
  }

  findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  deserializeUser(userId: string, lookupId: string): Promise<User | null> {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
        lookupId,
      },
    });

    return user;
  }

  async findUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
