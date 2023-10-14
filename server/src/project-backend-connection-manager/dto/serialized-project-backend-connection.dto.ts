import { IsString } from 'class-validator';

export class SerializedProjectBackendConnectionDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: string;

  @IsString()
  projectId: string;

  @IsString()
  ipAddress: string;
}
