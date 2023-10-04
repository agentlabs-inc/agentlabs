import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ListResponse } from '../../common/list.response';

export class ListProjectItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  organizationId: string;

  @IsString()
  creatorId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ListProjectsResultDto implements ListResponse<ListProjectItemDto> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListProjectItemDto)
  items: ListProjectItemDto[];

  @IsNumber()
  total: number;
}
