import { Module } from '@nestjs/common';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { AgentAttachmentsController } from './agent-attachments.controller';
import { AgentAttachmentsService } from './agent-attachments.service';

@Module({
  imports: [AttachmentsModule],
  providers: [AgentAttachmentsService],
  controllers: [AgentAttachmentsController],
})
export class AgentAttachmentsModule {}
