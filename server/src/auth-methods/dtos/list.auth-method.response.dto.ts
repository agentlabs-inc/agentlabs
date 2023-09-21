import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { PaginatedResponse } from '../../common/paginated.response';
import { AuthMethodItemDto } from './auth-method.item.dto';

class ListAuthMethodItem extends AuthMethodItemDto {}

export class ListAuthMethodResponseDto
  implements PaginatedResponse<ListAuthMethodItem>
{
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListAuthMethodItem)
  items: ListAuthMethodItem[];

  @IsNumber()
  total: number;
}
