import { Module } from '@nestjs/common';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  imports: [ProjectsModule, AttachmentsModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
