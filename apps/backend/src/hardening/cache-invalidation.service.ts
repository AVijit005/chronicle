import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from './cache.service';

export type CacheDomain = 'analytics' | 'wrapped' | 'search' | 'trending' | 'filters';

@Injectable()
export class CacheInvalidationService {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(private readonly cache: RedisCacheService) {}

  async invalidateDomain(domain: CacheDomain): Promise<void> {
    this.logger.log(`Invalidating cache domain: ${domain}`);
    await this.cache.clearPattern(`${domain}:*`);
  }

  async invalidateUserDomain(domain: CacheDomain, userId: string): Promise<void> {
    this.logger.log(`Invalidating ${domain} cache for user ${userId}`);
    await this.cache.delete(`${domain}:user:${userId}`);
  }

  async invalidateAnalytics(userId?: string): Promise<void> {
    if (userId) {
      await this.invalidateUserDomain('analytics', userId);
    } else {
      await this.invalidateDomain('analytics');
    }
  }

  async invalidateWrapped(userId: string): Promise<void> {
    await this.invalidateUserDomain('wrapped', userId);
  }

  async invalidateSearch(): Promise<void> {
    // Search suggestions and trending are global — clear when new media is added
    await this.cache.clearPattern('search:trending');
    await this.cache.clearPattern('search:suggestions:*');
  }

  async invalidateFilters(): Promise<void> {
    await this.invalidateDomain('filters');
  }

  async invalidateAll(): Promise<void> {
    await this.cache.flushAll();
  }
}
