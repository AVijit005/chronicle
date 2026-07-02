import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const SEARCH_MODES = ['global', 'library', 'media', 'journal', 'collections', 'timeline'] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

export const SORT_OPTIONS = [
  'relevance',
  'recently_added',
  'recently_updated',
  'rating',
  'release_date',
  'alphabetical',
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export class SearchQueryDto {
  @IsString()
  @MaxLength(200)
  q: string;

  @IsOptional()
  @IsIn(SEARCH_MODES)
  mode?: SearchMode;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class SuggestionQueryDto {
  @IsString()
  @MaxLength(100)
  q: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

export class SearchResultItemDto {
  id: string;
  type: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  matchedField: string | null;
  matchedText: string | null;
  score: number;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export class SearchResponseDto {
  items: SearchResultItemDto[];
  total: number;
  hasMore: boolean;
  cursor: string | null;
  facets?: SearchFacetsDto;
}

export class SearchFacetsDto {
  types: Record<string, number>;
  statuses?: Record<string, number>;
  genres?: Record<string, number>;
}

export class SuggestionDto {
  text: string;
  type: string;
  score: number;
}

export class SuggestionsResponseDto {
  suggestions: SuggestionDto[];
  recent: string[];
}

export class TrendingItemDto {
  id: string;
  type: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  score: number;
}

export class FilterOptionsDto {
  types: string[];
  statuses: string[];
  genres: string[];
  years: number[];
  moods: string[];
}
