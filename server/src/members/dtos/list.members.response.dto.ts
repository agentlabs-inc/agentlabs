import { IsDate, IsString } from 'class-validator';
import { PaginatedResponse } from '../../common/paginated.response';

export class MemberItem {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string | null;

  @IsString()
  lastName: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  verifiedAt: Date | null;
}

export class ListMembersResponseDto implements PaginatedResponse<MemberItem> {
  items: MemberItem[];
  resultCount: number;
  totalCount: number;
  hasMore: boolean;
}
