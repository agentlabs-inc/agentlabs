export interface PaginatedResponse<T> {
  items: T[];
  resultCount: number;
  totalCount: number;
  hasMore: boolean;
}
