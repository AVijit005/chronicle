import { describe, it, expect, beforeEach } from 'bun:test';
import { DatabaseOptimizationService } from './database-optimization.service';

describe('DatabaseOptimizationService', () => {
  let service: DatabaseOptimizationService;

  beforeEach(() => {
    service = new DatabaseOptimizationService();
  });

  it('returns suggested indexes', () => {
    const indexes = service.getSuggestedIndexes();
    expect(indexes.length).toBeGreaterThan(0);
    indexes.forEach((opt) => {
      expect(opt.table).toBeDefined();
      expect(opt.issue).toBeDefined();
      expect(opt.suggestion.toLowerCase()).toContain('index');
    });
  });

  it('suggests high-impact indexes', () => {
    const indexes = service.getSuggestedIndexes();
    const high = indexes.filter((i) => i.impact === 'high');
    expect(high.length).toBeGreaterThanOrEqual(3);
  });

  it('returns query optimizations', () => {
    const queries = service.getQueryOptimizations();
    expect(queries.length).toBeGreaterThan(0);
    queries.forEach((q) => {
      expect(q.query).toBeDefined();
      expect(q.frequency).toBeGreaterThan(0);
      expect(q.suggestions.length).toBeGreaterThan(0);
    });
  });

  it('identifies analytics as high-frequency query', () => {
    const queries = service.getQueryOptimizations();
    const analytics = queries.find((q) => q.query.includes('Analytics'));
    expect(analytics).toBeDefined();
    expect(analytics!.suggestions.length).toBeGreaterThan(0);
  });
});
