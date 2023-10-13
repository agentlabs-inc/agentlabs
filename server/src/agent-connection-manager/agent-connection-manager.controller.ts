import { Controller } from '@nestjs/common';
import { AgentConnectionManagerService } from './agent-connection-manager.service';

@Controller('agent-connection-manager')
export class AgentConnectionManagerController {
  constructor(
    private readonly agentConnectionManager: AgentConnectionManagerService,
  ) {}
}
