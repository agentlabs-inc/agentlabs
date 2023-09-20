import { IsBoolean } from 'class-validator';

export class ProjectExistsResponseDto {
  @IsBoolean()
  exists: boolean;
}
