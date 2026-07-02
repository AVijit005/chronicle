import { describe, it, expect, beforeEach } from 'bun:test';
import { LoadTestSupportService } from './load-test-support.service';

describe('LoadTestSupportService', () => {
  let service: LoadTestSupportService;

  beforeEach(() => {
    service = new LoadTestSupportService();
  });

  it('generates seed data payload', () => {
    const result = service.generateSeedPayload({
      users: 10,
      librariesPerUser: 5,
      interactionsPerLibrary: 3,
      journalEntriesPerUser: 2,
    });

    expect(result.userIds.length).toBe(10);
    expect(result.libraryItemIds.length).toBe(50);
    expect(result.interactionIds.length).toBe(30);
    expect(result.journalIds.length).toBe(20);
  });

  it('generates valid UUIDs', () => {
    const result = service.generateSeedPayload({
      users: 2,
      librariesPerUser: 1,
      interactionsPerLibrary: 1,
      journalEntriesPerUser: 1,
    });

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(uuidPattern.test(result.userIds[0])).toBe(true);
  });

  it('returns load profiles', () => {
    const profiles = service.getLoadProfiles();
    expect(Object.keys(profiles)).toContain('smoke');
    expect(Object.keys(profiles)).toContain('load');
    expect(Object.keys(profiles)).toContain('stress');
    expect(Object.keys(profiles)).toContain('spike');
    expect(Object.keys(profiles)).toContain('soak');
  });

  it('each profile has valid configuration', () => {
    const profiles = service.getLoadProfiles();
    Object.values(profiles).forEach((p) => {
      expect(p.rps).toBeGreaterThan(0);
      expect(p.duration).toBeDefined();
      expect(p.users).toBeGreaterThan(0);
    });
  });
});
