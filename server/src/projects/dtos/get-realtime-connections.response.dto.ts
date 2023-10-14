import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SerializedProjectBackendConnectionDto } from '../../project-backend-connection-manager/dto/serialized-project-backend-connection.dto';

export class GetRealtimeConnectionsResponseDto {
  @ValidateNested({ each: true })
  @Type(() => SerializedProjectBackendConnectionDto)
  items: SerializedProjectBackendConnectionDto[];
}
