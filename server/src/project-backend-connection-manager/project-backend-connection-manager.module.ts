import { Module } from '@nestjs/common';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { ProjectBackendConnectionManagerController } from './project-backend-connection-manager.controller';
import { ProjectBackendConnectionManagerService } from './project-backend-connection-manager.service';

@Module({
  imports: [FrontendConnectionManagerModule],
  providers: [ProjectBackendConnectionManagerService],
  exports: [ProjectBackendConnectionManagerService],
  controllers: [ProjectBackendConnectionManagerController],
})
export class ProjectBackendConnectionManagerModule {}
