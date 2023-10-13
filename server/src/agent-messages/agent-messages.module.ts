import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { AgentMessagesController } from './agent-messages.controller';
import { AgentMessagesService } from './agent-messages.service';

@Module({
  imports: [ConversationsModule],
  providers: [AgentMessagesService],
  exports: [AgentMessagesService],
  controllers: [AgentMessagesController],
})
export class AgentMessagesModule {}
