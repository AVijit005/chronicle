import { describe, it, expect, beforeEach } from 'bun:test';
import { ReleaseValidationService } from './release-validation.service';

describe('ReleaseValidationService', () => {
  let service: ReleaseValidationService;

  beforeEach(() => {
    service = new ReleaseValidationService();
  });

  it('validates release readiness', async () => {
    const report = await service.validate('1.0.0');
    expect(report.version).toBe('1.0.0');
    expect(report.checks.length).toBeGreaterThan(0);
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(['ready', 'blocked']).toContain(report.recommendation);
  });

  it('majority of checks pass', async () => {
    const report = await service.validate();
    expect(report.score).toBeGreaterThanOrEqual(80);
  });
});
