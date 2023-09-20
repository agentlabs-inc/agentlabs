import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
