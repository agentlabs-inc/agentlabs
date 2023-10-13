import { Module } from '@nestjs/common';
import { AgentAttachmentsModule } from './agent-attachments/agent-attachments.module';
import { AgentMessagesModule } from './agent-messages/agent-messages.module';
import { AgentsModule } from './agents/agents.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthMethodsModule } from './auth-methods/auth-methods.module';
import { ConfigModule } from './config/config.module';
import { ConversationsModule } from './conversations/conversations.module';
import { FrontendConnectionManagerModule } from './frontend-connection-manager/frontend-connection-manager.module';
import { FrontendConnectionModule } from './frontend-connection/frontend-connection.module';
import { IamModule } from './iam/iam.module';
import { MailerModule } from './mailer/mailer.module';
import { MembersModule } from './members/members.module';
import { OauthProvidersModule } from './oauth-providers/oauth-providers.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectBackendConnectionManagerModule } from './project-backend-connection-manager/project-backend-connection-manager.module';
import { ProjectBackendConnectionModule } from './project-backend-connection/project-backend-connection.module';
import { ProjectsModule } from './projects/projects.module';
import { SdkSecretsModule } from './sdk-secrets/sdk-secrets.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TelemetryService } from './telemetry/telemetry.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UsersModule,
    IamModule,
    ProjectsModule,
    AgentsModule,
    AuthMethodsModule,
    ProjectBackendConnectionManagerModule,
    FrontendConnectionManagerModule,
    ProjectBackendConnectionModule,
    FrontendConnectionModule,
    MembersModule,
    AgentAttachmentsModule,
    MailerModule,
    SdkSecretsModule,
    AttachmentsModule,
    OauthProvidersModule,
    TelemetryModule,
    ConversationsModule,
    AgentMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelemetryService],
})
export class AppModule {}
