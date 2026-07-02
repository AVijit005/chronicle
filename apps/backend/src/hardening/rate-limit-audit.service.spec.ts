import { describe, it, expect, beforeEach } from 'bun:test';
import { RateLimitAuditService } from './rate-limit-audit.service';

describe('RateLimitAuditService', () => {
  let service: RateLimitAuditService;

  beforeEach(() => {
    service = new RateLimitAuditService();
  });

  it('returns suggested rate limiting rules', () => {
    const report = service.getSuggestedRules();
    expect(report.rules.length).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  it('includes auth endpoint rules', () => {
    const report = service.getSuggestedRules();
    const authRules = report.rules.filter((r) => r.endpoint.includes('/auth/'));
    expect(authRules.length).toBeGreaterThanOrEqual(5);
    authRules.forEach((r) => expect(r.priority).toBe('high'));
  });

  it('includes search endpoint rules', () => {
    const report = service.getSuggestedRules();
    const searchRules = report.rules.filter((r) => r.endpoint.includes('/search'));
    expect(searchRules.length).toBeGreaterThanOrEqual(1);
  });

  it('includes upload endpoint rules', () => {
    const report = service.getSuggestedRules();
    const uploadRules = report.rules.filter((r) => r.endpoint.includes('/storage'));
    expect(uploadRules.length).toBeGreaterThanOrEqual(2);
  });

  it('each rule has valid limit and window', () => {
    const report = service.getSuggestedRules();
    report.rules.forEach((r) => {
      expect(r.limit).toBeGreaterThan(0);
      expect(r.windowMs).toBeGreaterThan(0);
    });
  });
});
