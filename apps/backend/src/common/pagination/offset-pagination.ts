import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OffsetPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;
}

export interface OffsetPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OffsetPaginated<T> {
  data: T[];
  meta: OffsetPaginationMeta;
}

export function buildOffsetMeta(page: number, limit: number, total: number): OffsetPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
