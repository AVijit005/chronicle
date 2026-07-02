import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import type { TrendingItemDto, FilterOptionsDto } from './dto';

@Injectable()
export class SearchStatisticsService {
  constructor(private readonly repository: SearchRepository) {}

  async getTrending(limit = 10): Promise<TrendingItemDto[]> {
    const media = await this.repository.getTrendingMedia(limit);
    return media.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      subtitle: m.subtitle,
      imageUrl: m.imageUrl,
      score: m.score,
    }));
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    return this.repository.getFilterOptions();
  }
}
