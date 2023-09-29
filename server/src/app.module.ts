import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AgentsModule } from './agents/agents.module';
import { AuthMethodsModule } from './auth-methods/auth-methods.module';
import { AgentConnectionManagerModule } from './agent-connection-manager/agent-connection-manager.module';
import { FrontendConnectionManagerModule } from './frontend-connection-manager/frontend-connection-manager.module';
import { AgentConnectionModule } from './agent-connection/agent-connection.module';
import { FrontendConnectionModule } from './frontend-connection/frontend-connection.module';

@Module({
  imports: [ConfigModule, PrismaModule, UsersModule, IamModule, ProjectsModule, AgentsModule, AuthMethodsModule, AgentConnectionManagerModule, FrontendConnectionManagerModule, AgentConnectionModule, FrontendConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
