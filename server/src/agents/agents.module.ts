import { Module } from '@nestjs/common';
import { AgentConnectionManagerModule } from 'src/agent-connection-manager/agent-connection-manager.module';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  imports: [
    ProjectsModule,
    AttachmentsModule,
    TelemetryModule,
    AgentConnectionManagerModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
