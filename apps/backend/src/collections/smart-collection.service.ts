/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { CollectionsRepository } from './collections.repository';
import type { SmartCollectionConfigDto, CollectionItemResponseDto } from './dto';

@Injectable()
export class SmartCollectionService {
  constructor(private readonly repository: CollectionsRepository) {}

  async evaluate(userId: string, rules: SmartCollectionConfigDto): Promise<CollectionItemResponseDto[]> {
    if (!rules?.rules?.length) return [];

    const filters: Record<string, any> = {};
    const _matchMode = rules.matchMode ?? 'ALL';

    for (const rule of rules.rules) {
      if (rule.field === 'mediaType' || rule.field === 'hasReview') {
        continue;
      }
      if (rule.field === 'status') {
        filters.status = rule.value as string;
      } else if (rule.field === 'rating') {
        filters.rating = this.resolveRatingValue(rule.value);
        filters.ratingOperator = rule.operator;
      } else if (rule.field === 'favorite') {
        filters.favorite = rule.value;
      } else if (rule.field === 'hidden') {
        filters.hidden = rule.value;
      }
    }

    const items = await this.repository.findLibraryItems(userId, filters);

    // Post-filter for hasReview
    let filtered = items;
    for (const rule of rules.rules) {
      if (rule.field === 'hasReview') {
        const shouldHaveReview = rule.value === true;
        filtered = filtered.filter((item: any) => {
          const metadata = item.metadata ?? {};
          const hasReview = !!metadata.review;
          return shouldHaveReview ? hasReview : !hasReview;
        });
      }
    }

    return filtered.map((item: any) => ({
      id: item[`${item._mediaType}Id`] ?? item.id,
      position: 0,
      note: null,
      addedAt: item.createdAt?.toISOString() ?? new Date().toISOString(),
      mediaId: item[`${item._mediaType}Id`] ?? item.id,
      mediaType: item._mediaType,
      title: item[item._mediaType]?.title ?? 'Unknown',
      slug: item[item._mediaType]?.slug ?? '',
      posterUrl: item[item._mediaType]?.posterUrl ?? null,
    }));
  }

  private resolveRatingValue(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Handle rating like "8" or "4.5"
      const num = parseFloat(value);
      if (!isNaN(num)) return num * 2; // Convert API scale (0.5-5.0) to internal (1-10)
    }
    return 0;
  }
}
