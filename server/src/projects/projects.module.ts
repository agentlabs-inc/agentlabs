import { Module } from '@nestjs/common';
import { ProjectBackendConnectionManagerModule } from 'src/project-backend-connection-manager/project-backend-connection-manager.module';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
  imports: [TelemetryModule, ProjectBackendConnectionManagerModule],
})
export class ProjectsModule {}
