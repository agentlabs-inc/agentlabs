import { Module } from '@nestjs/common';
import { AgentChatModule } from 'src/agent-chat/agent-chat.module';
import { AgentConnectionManagerModule } from 'src/agent-connection-manager/agent-connection-manager.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { FrontendConnectionGateway } from './frontend-connection.gateway';

@Module({
  imports: [
    AgentConnectionManagerModule,
    FrontendConnectionManagerModule,
    AgentChatModule,
  ],
  providers: [FrontendConnectionGateway],
})
export class FrontendConnectionModule {}
