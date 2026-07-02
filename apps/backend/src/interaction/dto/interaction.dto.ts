import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const RATING_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
export type RatingValue = (typeof RATING_VALUES)[number];

const VISIBILITY_VALUES = ['PUBLIC', 'PRIVATE', 'FRIENDS'] as const;
export type ReviewVisibility = (typeof VISIBILITY_VALUES)[number];

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export class UpdateRatingDto {
  @ApiProperty({ example: 4.5, description: 'Rating from 0.5 to 5.0 in 0.5 increments' })
  @IsIn(RATING_VALUES)
  rating: number;
}

export class UpdateFavoriteDto {
  @ApiProperty({ example: true, description: 'Favorite toggle' })
  @IsBoolean()
  favorite: boolean;
}

export class UpdateBookmarkDto {
  @ApiProperty({ example: true, description: 'Bookmark toggle' })
  @IsBoolean()
  bookmark: boolean;
}

export class CreateReviewDto {
  @ApiProperty({ example: 'A masterpiece', description: 'Review title' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'This film is...', description: 'Review body' })
  @IsString()
  @MaxLength(10_000)
  body: string;

  @ApiProperty({ example: false, description: 'Contains spoilers' })
  @IsBoolean()
  spoiler: boolean;

  @ApiProperty({ example: 'PUBLIC', description: 'Visibility level' })
  @IsIn(VISIBILITY_VALUES)
  visibility: ReviewVisibility;
}

export class UpdateReviewDto {
  @ApiProperty({ example: 'A true masterpiece', description: 'Review title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: 'Updated review body...', description: 'Review body' })
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  body?: string;

  @ApiProperty({ example: true, description: 'Contains spoilers' })
  @IsOptional()
  @IsBoolean()
  spoiler?: boolean;

  @ApiProperty({ example: 'PUBLIC', description: 'Visibility level' })
  @IsOptional()
  @IsIn(VISIBILITY_VALUES)
  visibility?: ReviewVisibility;
}

// ─── Response DTOs ─────────────────────────────────────────────────────────────

export class RatingResponseDto {
  rating: number | null;
  ratedAt: string | null;
}

export class FavoriteResponseDto {
  favorite: boolean;
  favoritedAt: string | null;
}

export class BookmarkResponseDto {
  bookmarked: boolean;
  bookmarkedAt: string | null;
}

export class ReviewResponseDto {
  id: string;
  title: string;
  body: string;
  spoiler: boolean;
  visibility: ReviewVisibility;
  createdAt: string;
  editedAt: string | null;
}

export class HistoryEventDto {
  event: string;
  timestamp: string;
  progress?: number;
  metadata?: Record<string, unknown>;
}

export class InteractionQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class ReviewQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class InteractionListResponseDto {
  items: (RatingResponseDto | ReviewResponseDto | FavoriteResponseDto | HistoryEventDto)[];
  total: number;
  hasMore: boolean;
  cursor: string | null;
}
