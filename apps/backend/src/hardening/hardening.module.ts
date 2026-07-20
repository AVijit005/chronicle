import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { RedisCacheService } from './cache.service';
import { CacheInvalidationService } from './cache-invalidation.service';
import { PerformanceAuditService } from './performance-audit.service';
import { RateLimitAuditService } from './rate-limit-audit.service';
import { DatabaseOptimizationService } from './database-optimization.service';
import { QueryAnalysisService } from './query-analysis.service';
import { LoadTestSupportService } from './load-test-support.service';

@Module({
  imports: [RedisModule],
  providers: [
    RedisCacheService,
    CacheInvalidationService,
    PerformanceAuditService,
    RateLimitAuditService,
    DatabaseOptimizationService,
    QueryAnalysisService,
    LoadTestSupportService,
  ],
  exports: [
    RedisCacheService,
    CacheInvalidationService,
    PerformanceAuditService,
    RateLimitAuditService,
    DatabaseOptimizationService,
    QueryAnalysisService,
    LoadTestSupportService,
  ],
})
export class HardeningModule {}
