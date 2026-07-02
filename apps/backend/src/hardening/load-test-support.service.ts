import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface SeedDataConfig {
  users: number;
  librariesPerUser: number;
  interactionsPerLibrary: number;
  journalEntriesPerUser: number;
}

export interface SeedDataResult {
  userIds: string[];
  libraryItemIds: string[];
  interactionIds: string[];
  journalIds: string[];
}

@Injectable()
export class LoadTestSupportService {
  private readonly logger = new Logger(LoadTestSupportService.name);

  generateSeedPayload(config: SeedDataConfig): SeedDataResult {
    const userIds = Array.from({ length: config.users }, () => randomUUID());
    const libraryItemIds = Array.from({ length: config.users * config.librariesPerUser }, () => randomUUID());
    const interactionIds = Array.from({ length: config.users * config.interactionsPerLibrary }, () => randomUUID());
    const journalIds = Array.from({ length: config.users * config.journalEntriesPerUser }, () => randomUUID());

    return { userIds, libraryItemIds, interactionIds, journalIds };
  }

  getLoadProfiles(): Record<
    string,
    { name: string; description: string; rps: number; duration: string; users: number }
  > {
    return {
      smoke: { name: 'Smoke Test', description: 'Verify endpoints work', rps: 1, duration: '30s', users: 1 },
      load: { name: 'Load Test', description: 'Normal traffic', rps: 50, duration: '5m', users: 100 },
      stress: { name: 'Stress Test', description: 'Find breaking point', rps: 200, duration: '2m', users: 500 },
      spike: { name: 'Spike Test', description: 'Sudden traffic surge', rps: 500, duration: '30s', users: 1000 },
      soak: { name: 'Soak Test', description: 'Sustained traffic', rps: 50, duration: '30m', users: 200 },
    };
  }
}
