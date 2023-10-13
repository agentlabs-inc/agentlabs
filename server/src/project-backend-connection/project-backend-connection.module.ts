import { Module } from '@nestjs/common';
import { AgentChatModule } from 'src/agent-chat/agent-chat.module';
import { ProjectBackendConnectionManagerModule } from 'src/project-backend-connection-manager/project-backend-connection-manager.module';
import { AgentsModule } from 'src/agents/agents.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { SdkSecretsModule } from '../sdk-secrets/sdk-secrets.module';
import { AgentConnectionGateway } from './project-backend-connection.gateway';
import { AgentStreamManagerService } from './agent-stream-manager/agent-stream-manager.service';

@Module({
  imports: [
    ProjectBackendConnectionManagerModule,
    FrontendConnectionManagerModule,
    AgentChatModule,
    AgentsModule,
    SdkSecretsModule,
  ],
  providers: [AgentConnectionGateway, AgentStreamManagerService],
})
export class AgentConnectionModule {}
