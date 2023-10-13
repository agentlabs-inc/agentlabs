import { Module } from '@nestjs/common';
import { AgentChatModule } from 'src/agent-chat/agent-chat.module';
import { ProjectBackendConnectionManagerModule } from 'src/project-backend-connection-manager/project-backend-connection-manager.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { MembersModule } from 'src/members/members.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { FrontendConnectionGateway } from './frontend-connection.gateway';

@Module({
  imports: [
    ProjectBackendConnectionManagerModule,
    FrontendConnectionManagerModule,
    AgentChatModule,
    ProjectsModule,
    MembersModule,
  ],
  providers: [FrontendConnectionGateway],
})
export class FrontendConnectionModule {}
