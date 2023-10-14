import { PaginatedResponse } from '../../common/paginated.response';
import { SanitizedSdkSecretDto } from './sanitized.sdk-secret.dto';
export class ListSdkSecretDto
  implements PaginatedResponse<SanitizedSdkSecretDto>
{
  items: SanitizedSdkSecretDto[];
  resultCount: number;
  hasMore: boolean;
  totalCount: number;
}
