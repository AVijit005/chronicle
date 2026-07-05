/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InteractionRepository } from './interaction.repository';
import { InteractionEventService } from './interaction-event.service';
import type {
  UpdateRatingDto,
  UpdateFavoriteDto,
  UpdateBookmarkDto,
  CreateReviewDto,
  UpdateReviewDto,
  RatingResponseDto,
  FavoriteResponseDto,
  BookmarkResponseDto,
  ReviewResponseDto,
} from './dto';

// Internal: rating stored as Int (0-10), API speaks 0.5-5.0
function apiToInternal(rating: number): number {
  return Math.round(rating * 2);
}

function internalToApi(rating: number | null): number | null {
  if (rating === null || rating === null) return null;
  return rating / 2;
}

@Injectable()
export class InteractionService {
  constructor(
    private readonly repository: InteractionRepository,
    private readonly events: InteractionEventService,
  ) {}

  // ─── Rating ────────────────────────────────────────────────────────────────

  async updateRating(userId: string, id: string, type: string, dto: UpdateRatingDto): Promise<RatingResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const oldRating = item.rating ?? 0;
    const newRating = apiToInternal(dto.rating);

    const updated = await this.repository.updateLibraryItem(id, type, userId, { rating: newRating });
    if (!updated) throw new NotFoundException('Library item not found');

    if (oldRating === 0 && newRating > 0) {
      await this.events.emitRatingAdded(userId, id, type, newRating);
    } else {
      await this.events.emitRatingUpdated(userId, id, type, oldRating, newRating);
    }

    await this.repository.recordHistory(userId, 'RATED', id, type, { oldRating, newRating });

    return {
      rating: dto.rating,
      ratedAt: new Date().toISOString(),
    };
  }

  async getRating(userId: string, id: string, type: string): Promise<RatingResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    return {
      rating: internalToApi(item.rating),
      ratedAt: item.updatedAt.toISOString(),
    };
  }

  // ─── Favorite ──────────────────────────────────────────────────────────────

  async toggleFavorite(userId: string, id: string, type: string, dto: UpdateFavoriteDto): Promise<FavoriteResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const updated = await this.repository.updateLibraryItem(id, type, userId, { favorite: dto.favorite });
    if (!updated) throw new NotFoundException('Library item not found');

    if (dto.favorite) {
      await this.events.emitFavoriteAdded(userId, id, type);
    } else {
      await this.events.emitFavoriteRemoved(userId, id, type);
    }

    await this.repository.recordHistory(userId, dto.favorite ? 'FAVORITED' : 'UNFAVORITED', id, type);

    return {
      favorite: dto.favorite,
      favoritedAt: dto.favorite ? new Date().toISOString() : null,
    };
  }

  async getFavorite(userId: string, id: string, type: string): Promise<FavoriteResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    return {
      favorite: item.favorite,
      favoritedAt: item.updatedAt.toISOString(),
    };
  }

  // ─── Bookmark ──────────────────────────────────────────────────────────────

  async toggleBookmark(userId: string, id: string, type: string, dto: UpdateBookmarkDto): Promise<BookmarkResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const updateData: Record<string, unknown> = { bookmarked: dto.bookmark };
    if (dto.bookmark) {
      updateData.bookmarkedAt = new Date();
    } else {
      updateData.bookmarkedAt = null;
    }

    const updated = await this.repository.updateLibraryItem(id, type, userId, updateData);
    if (!updated) throw new NotFoundException('Library item not found');

    if (dto.bookmark) {
      await this.events.emitBookmarkAdded(userId, id, type);
    } else {
      await this.events.emitBookmarkRemoved(userId, id, type);
    }

    await this.repository.recordHistory(userId, dto.bookmark ? 'BOOKMARKED' : 'UNBOOKMARKED', id, type);

    return {
      bookmarked: dto.bookmark,
      bookmarkedAt: updated.bookmarkedAt ? updated.bookmarkedAt.toISOString() : null,
    };
  }

  async getBookmark(userId: string, id: string, type: string): Promise<BookmarkResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    return {
      bookmarked: item.bookmarked ?? false,
      bookmarkedAt: item.bookmarkedAt ? item.bookmarkedAt.toISOString() : null,
    };
  }

  // ─── Review ────────────────────────────────────────────────────────────────

  async createReview(userId: string, id: string, type: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const metadata = (item.metadata as Record<string, any>) ?? {};
    if (metadata.review) {
      throw new ConflictException('A review already exists for this item');
    }

    const now = new Date();
    metadata.review = {
      title: dto.title,
      body: dto.body,
      spoiler: dto.spoiler,
      visibility: dto.visibility,
      createdAt: now.toISOString(),
      editedAt: null,
    };

    const updated = await this.repository.updateLibraryItem(id, type, userId, { metadata });
    if (!updated) throw new NotFoundException('Library item not found');

    await this.events.emitReviewCreated(userId, id, type);
    await this.repository.recordHistory(userId, 'REVIEWED', id, type, { action: 'created' });

    return this.mapReview(metadata.review);
  }

  async updateReview(userId: string, id: string, type: string, dto: UpdateReviewDto): Promise<ReviewResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const metadata = (item.metadata as Record<string, any>) ?? {};
    if (!metadata.review) {
      throw new NotFoundException('No review found for this item');
    }

    const review = metadata.review;
    if (dto.title !== undefined) review.title = dto.title;
    if (dto.body !== undefined) review.body = dto.body;
    if (dto.spoiler !== undefined) review.spoiler = dto.spoiler;
    if (dto.visibility !== undefined) review.visibility = dto.visibility;
    review.editedAt = new Date().toISOString();

    const updated = await this.repository.updateLibraryItem(id, type, userId, { metadata });
    if (!updated) throw new NotFoundException('Library item not found');

    await this.events.emitReviewUpdated(userId, id, type);
    await this.repository.recordHistory(userId, 'REVIEW_UPDATED', id, type, { action: 'updated' });

    return this.mapReview(metadata.review);
  }

  async deleteReview(userId: string, id: string, type: string): Promise<void> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const metadata = (item.metadata as Record<string, any>) ?? {};
    if (!metadata.review) {
      throw new NotFoundException('No review found for this item');
    }

    delete metadata.review;

    const updated = await this.repository.updateLibraryItem(id, type, userId, { metadata });
    if (!updated) throw new NotFoundException('Library item not found');

    await this.events.emitReviewDeleted(userId, id, type);
    await this.repository.recordHistory(userId, 'REVIEW_DELETED', id, type, { action: 'deleted' });
  }

  async getReview(userId: string, id: string, type: string): Promise<ReviewResponseDto> {
    const item = await this.repository.findLibraryItem(id, type);
    if (!item) throw new NotFoundException('Library item not found');
    if (item.userId !== userId) throw new NotFoundException('Library item not found');

    const metadata = (item.metadata as Record<string, any>) ?? {};
    if (!metadata.review) {
      throw new NotFoundException('No review found for this item');
    }

    return this.mapReview(metadata.review);
  }

  // ─── List Queries ──────────────────────────────────────────────────────────

  async listReviews(
    userId: string,
    type?: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ items: any[]; total: number; hasMore: boolean; cursor: string | null }> {
    const items = await this.repository.findWithReviews(userId, type, cursor, limit);
    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;

    const mapped = sliced.map((item: any) => {
      const metadata = (item.metadata as Record<string, any>) ?? {};
      return {
        libraryId: item.id,
        mediaId: item[`${item._mediaType}Id`],
        title: item[item._mediaType]?.title ?? 'Unknown',
        slug: item[item._mediaType]?.slug ?? '',
        posterUrl: item[item._mediaType]?.posterUrl ?? null,
        mediaType: item._mediaType,
        review: metadata.review ?? null,
      };
    });

    return {
      items: mapped,
      total: mapped.length,
      hasMore,
      cursor: sliced.length > 0 ? sliced[sliced.length - 1].updatedAt.toISOString() : null,
    };
  }

  async listFavorites(
    userId: string,
    type?: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ items: any[]; total: number; hasMore: boolean; cursor: string | null }> {
    const items = await this.repository.findFavorites(userId, type, cursor, limit);
    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;

    const mapped = sliced.map((item: any) => ({
      libraryId: item.id,
      mediaId: item[`${item._mediaType}Id`],
      title: item[item._mediaType]?.title ?? 'Unknown',
      slug: item[item._mediaType]?.slug ?? '',
      posterUrl: item[item._mediaType]?.posterUrl ?? null,
      mediaType: item._mediaType,
      favorite: item.favorite,
      favoritedAt: item.updatedAt.toISOString(),
    }));

    return {
      items: mapped,
      total: mapped.length,
      hasMore,
      cursor: sliced.length > 0 ? sliced[sliced.length - 1].updatedAt.toISOString() : null,
    };
  }

  async listBookmarks(
    userId: string,
    type?: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ items: any[]; total: number; hasMore: boolean; cursor: string | null }> {
    const items = await this.repository.findBookmarks(userId, type, cursor, limit);
    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;

    const mapped = sliced.map((item: any) => ({
      libraryId: item.id,
      mediaId: item[`${item._mediaType}Id`],
      title: item[item._mediaType]?.title ?? 'Unknown',
      slug: item[item._mediaType]?.slug ?? '',
      posterUrl: item[item._mediaType]?.posterUrl ?? null,
      mediaType: item._mediaType,
      bookmarked: item.bookmarked ?? true,
      bookmarkedAt: item.bookmarkedAt?.toISOString() ?? null,
    }));

    return {
      items: mapped,
      total: mapped.length,
      hasMore,
      cursor: sliced.length > 0 ? sliced[sliced.length - 1].updatedAt.toISOString() : null,
    };
  }

  async listHistory(
    userId: string,
    type?: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ items: any[]; total: number; hasMore: boolean; cursor: string | null }> {
    const items = await this.repository.findHistory(userId, type, cursor, limit);
    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;

    const mapped = sliced.map((item: any) => ({
      id: item.id,
      event: item.title,
      type: item.type,
      description: item.description,
      metadata: item.metadata,
      timestamp: item.createdAt.toISOString(),
    }));

    return {
      items: mapped,
      total: mapped.length,
      hasMore,
      cursor: sliced.length > 0 ? sliced[sliced.length - 1].createdAt.toISOString() : null,
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private mapReview(review: Record<string, any>): ReviewResponseDto {
    return {
      id: 'review-' + (review.createdAt ?? Date.now()),
      title: review.title,
      body: review.body,
      spoiler: review.spoiler ?? false,
      visibility: review.visibility ?? 'PUBLIC',
      createdAt: review.createdAt ?? new Date().toISOString(),
      editedAt: review.editedAt ?? null,
    };
  }
}
