import { describe, it, expect, beforeEach } from 'bun:test';
import { PerformanceAuditService } from './performance-audit.service';

describe('PerformanceAuditService', () => {
  let service: PerformanceAuditService;

  beforeEach(() => {
    service = new PerformanceAuditService();
  });

  it('returns a full performance audit report', () => {
    const report = service.runAudit();
    expect(report.timestamp).toBeDefined();
    expect(report.results.length).toBeGreaterThan(0);
    expect(report.summary.ok + report.summary.warn + report.summary.fail).toBe(report.results.length);
  });

  it('reports database findings', () => {
    const report = service.runAudit();
    const dbResults = report.results.filter((r) => r.area === 'Database');
    expect(dbResults.length).toBeGreaterThanOrEqual(3);
  });

  it('reports API findings', () => {
    const report = service.runAudit();
    const apiResults = report.results.filter((r) => r.area === 'API');
    expect(apiResults.length).toBeGreaterThanOrEqual(2);
  });

  it('reports memory findings', () => {
    const report = service.runAudit();
    const memResults = report.results.filter((r) => r.area === 'Memory');
    expect(memResults.length).toBeGreaterThanOrEqual(2);
  });

  it('reports concurrency findings', () => {
    const report = service.runAudit();
    const concResults = report.results.filter((r) => r.area === 'Concurrency');
    expect(concResults.length).toBeGreaterThanOrEqual(2);
  });
});
