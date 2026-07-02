import { describe, it, expect, beforeEach } from 'bun:test';
import { SecurityAuditService } from './security-audit.service';

describe('SecurityAuditService', () => {
  let service: SecurityAuditService;

  beforeEach(() => {
    service = new SecurityAuditService();
  });

  it('returns a full audit report', async () => {
    const report = await service.runFullAudit();
    expect(report.timestamp).toBeDefined();
    expect(report.results.length).toBeGreaterThan(0);
    expect(report.summary.ok + report.summary.warn + report.summary.fail).toBe(report.results.length);
  });

  it('all authentication checks pass', async () => {
    const report = await service.runFullAudit();
    const authResults = report.results.filter((r) => r.category === 'Authentication');
    expect(authResults.length).toBeGreaterThanOrEqual(5);
    authResults.forEach((r) => expect(r.status).toBe('ok'));
  });

  it('reports authorization checks', async () => {
    const report = await service.runFullAudit();
    const authzResults = report.results.filter((r) => r.category === 'Authorization');
    expect(authzResults.length).toBeGreaterThan(0);
  });

  it('reports cookie security checks', async () => {
    const report = await service.runFullAudit();
    const cookieResults = report.results.filter((r) => r.category === 'Cookie Security');
    expect(cookieResults.length).toBeGreaterThanOrEqual(4);
  });

  it('reports header security checks', async () => {
    const report = await service.runFullAudit();
    const headerResults = report.results.filter((r) => r.category === 'Header Security');
    expect(headerResults.length).toBeGreaterThanOrEqual(3);
  });
});
