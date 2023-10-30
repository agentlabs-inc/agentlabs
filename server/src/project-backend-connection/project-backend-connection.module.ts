import { Module } from '@nestjs/common';
import { AgentsModule } from 'src/agents/agents.module';
import { ChatMessagesModule } from 'src/chat-messages/chat-messages.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { ProjectBackendConnectionManagerModule } from 'src/project-backend-connection-manager/project-backend-connection-manager.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { TelemetryModule } from 'src/telemetry/telemetry.module';
import { SdkSecretsModule } from '../sdk-secrets/sdk-secrets.module';
import { AgentStreamManagerService } from './agent-stream-manager/agent-stream-manager.service';
import { ProjectBackendConnectionGateway } from './project-backend-connection.gateway';

@Module({
  imports: [
    ConversationsModule,
    ChatMessagesModule,
    ProjectBackendConnectionManagerModule,
    FrontendConnectionManagerModule,
    AgentsModule,
    SdkSecretsModule,
    TelemetryModule,
    ProjectsModule,
  ],
  providers: [ProjectBackendConnectionGateway, AgentStreamManagerService],
})
export class ProjectBackendConnectionModule {}
