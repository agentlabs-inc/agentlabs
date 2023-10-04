import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  page: number;

  @IsNumber()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => Number.parseInt(value, 10))
  limit: number;
}
