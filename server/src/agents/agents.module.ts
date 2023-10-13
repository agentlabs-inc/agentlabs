import { Module } from '@nestjs/common';
import { ProjectBackendConnectionManagerModule } from 'src/project-backend-connection-manager/project-backend-connection-manager.module';
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
    ProjectBackendConnectionManagerModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
