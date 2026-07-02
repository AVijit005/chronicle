import { describe, it, expect, beforeEach } from 'bun:test';
import { ProductionConfigurationService } from './production-configuration.service';

describe('ProductionConfigurationService', () => {
  let service: ProductionConfigurationService;

  beforeEach(() => {
    service = new ProductionConfigurationService();
  });

  it('returns recommended configuration', () => {
    const report = service.getRecommendedConfiguration();
    expect(report.settings.length).toBeGreaterThan(0);
    expect(typeof report.ready).toBe('boolean');
  });

  it('covers all configuration categories', () => {
    const report = service.getRecommendedConfiguration();
    const categories = new Set(report.settings.map((s) => s.category));
    expect(categories.has('Node.js')).toBe(true);
    expect(categories.has('Database')).toBe(true);
    expect(categories.has('Redis')).toBe(true);
    expect(categories.has('Security')).toBe(true);
  });

  it('each setting has a recommendation', () => {
    const report = service.getRecommendedConfiguration();
    report.settings.forEach((s) => {
      expect(s.recommendation.length).toBeGreaterThan(5);
    });
  });
});
