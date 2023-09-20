import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginatedResponse } from '../../common/paginated.response';

class ListAgentItem {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsString()
  creatorId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ListAgentsResponseDto implements PaginatedResponse<ListAgentItem> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListAgentItem)
  items: ListAgentItem[];

  @IsNumber()
  total: number;
}
