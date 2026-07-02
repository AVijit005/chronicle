import { describe, it, expect, beforeEach } from 'bun:test';
import { QueryAnalysisService } from './query-analysis.service';

describe('QueryAnalysisService', () => {
  let service: QueryAnalysisService;

  beforeEach(() => {
    service = new QueryAnalysisService();
  });

  it('returns a query analysis report', () => {
    const report = service.analyze();
    expect(report.timestamp).toBeDefined();
    expect(report.nPlusOne).toBeDefined();
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  it('detects potential N+1 issues', () => {
    const report = service.analyze();
    const nPlusOne = report.nPlusOne.filter((n) => n.type === 'Potential N+1');
    expect(nPlusOne.length).toBeGreaterThanOrEqual(1);
  });

  it('includes clear severity levels', () => {
    const report = service.analyze();
    report.nPlusOne.forEach((n) => {
      expect(['high', 'medium', 'low']).toContain(n.severity);
    });
  });

  it('provides actionable recommendations', () => {
    const report = service.analyze();
    expect(report.recommendations.length).toBeGreaterThanOrEqual(3);
    report.recommendations.forEach((r) => {
      expect(typeof r).toBe('string');
      expect(r.length).toBeGreaterThan(10);
    });
  });
});
