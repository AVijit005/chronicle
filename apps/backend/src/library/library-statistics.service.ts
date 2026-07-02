import { Injectable } from '@nestjs/common';
import { LibraryRepository } from './library.repository';

export interface LibraryStatistics {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  favoriteCount: number;
  completionRate: number;
}

@Injectable()
export class LibraryStatisticsService {
  constructor(private readonly repository: LibraryRepository) {}

  async getStatistics(userId: string): Promise<LibraryStatistics> {
    const byStatus = await this.repository.countByStatus(userId);
    const byType = await this.repository.countByType(userId);

    const total = Object.values(byType).reduce((sum, count) => sum + count, 0);
    const completed = byStatus['COMPLETED'] ?? 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      byStatus,
      byType,
      favoriteCount: 0,
      completionRate,
    };
  }
}
