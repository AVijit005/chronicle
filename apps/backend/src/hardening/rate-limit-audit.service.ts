import { Injectable, Logger } from '@nestjs/common';

export interface RateLimitRule {
  endpoint: string;
  method: string;
  limit: number;
  windowMs: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RateLimitAuditReport {
  timestamp: Date;
  rules: RateLimitRule[];
  recommendations: string[];
}

@Injectable()
export class RateLimitAuditService {
  private readonly logger = new Logger(RateLimitAuditService.name);

  getSuggestedRules(): RateLimitAuditReport {
    const rules: RateLimitRule[] = [
      // Authentication endpoints
      { endpoint: '/api/auth/login', method: 'POST', limit: 5, windowMs: 60000, priority: 'high' },
      { endpoint: '/api/auth/register', method: 'POST', limit: 3, windowMs: 60000, priority: 'high' },
      { endpoint: '/api/auth/refresh', method: 'POST', limit: 10, windowMs: 60000, priority: 'high' },
      { endpoint: '/api/auth/verify-email', method: 'POST', limit: 5, windowMs: 60000, priority: 'high' },
      { endpoint: '/api/auth/resend-verification', method: 'POST', limit: 2, windowMs: 60000, priority: 'high' },

      // Search
      { endpoint: '/api/search', method: 'GET', limit: 30, windowMs: 60000, priority: 'medium' },
      { endpoint: '/api/search/suggestions', method: 'GET', limit: 60, windowMs: 60000, priority: 'medium' },

      // Upload
      { endpoint: '/api/storage/upload', method: 'POST', limit: 10, windowMs: 60000, priority: 'high' },
      { endpoint: '/api/storage/avatar', method: 'POST', limit: 5, windowMs: 60000, priority: 'medium' },
      { endpoint: '/api/storage/cover', method: 'POST', limit: 5, windowMs: 60000, priority: 'medium' },

      // Generation
      { endpoint: '/api/wrapped/generate', method: 'POST', limit: 2, windowMs: 60000, priority: 'medium' },
      { endpoint: '/api/analytics', method: 'GET', limit: 20, windowMs: 60000, priority: 'medium' },

      // Notifications
      { endpoint: '/api/notifications', method: 'GET', limit: 30, windowMs: 60000, priority: 'medium' },
    ];

    const recommendations = [
      'Use @nestjs/throttler for declarative rate limiting',
      'Apply rate limiting globally with different limits per route',
      'Use Redis as the throttler store for distributed rate limiting',
      'Return Retry-After header with 429 responses',
      'Monitor rate limit violations in observability metrics',
    ];

    return { timestamp: new Date(), rules, recommendations };
  }
}
