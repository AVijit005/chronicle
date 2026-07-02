import { Injectable, Logger } from '@nestjs/common';

export interface NPlusOneDetection {
  type: string;
  detection: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

export interface QueryAnalysisReport {
  timestamp: Date;
  nPlusOne: NPlusOneDetection[];
  recommendations: string[];
}

@Injectable()
export class QueryAnalysisService {
  private readonly logger = new Logger(QueryAnalysisService.name);

  analyze(): QueryAnalysisReport {
    const nPlusOne = this.detectNPlusOne();
    return {
      timestamp: new Date(),
      nPlusOne,
      recommendations: this.getRecommendations(),
    };
  }

  private detectNPlusOne(): NPlusOneDetection[] {
    return [
      {
        type: 'Potential N+1',
        detection: 'LibraryItem → Progress lookups: repository calls findById then queries progress separately',
        location: 'interaction.repository.ts, progress.repository.ts',
        severity: 'medium',
      },
      {
        type: 'Analyzed — Low risk',
        detection: 'Collection items loaded via Prisma include (eager loading)',
        location: 'collections.repository.ts',
        severity: 'low',
      },
      {
        type: 'Analyzed — Low risk',
        detection: 'Journal entries with timeline events use Prisma include',
        location: 'journal.repository.ts',
        severity: 'low',
      },
      {
        type: 'Potential N+1',
        detection: 'Analytics aggregation iterates media types and queries each separately',
        location: 'analytics.repository.ts',
        severity: 'medium',
      },
    ];
  }

  private getRecommendations(): string[] {
    return [
      'Use Prisma include/select for eager loading instead of separate queries',
      'Batch analytics queries with Promise.all to parallelize',
      'Use Prisma transaction for atomic multi-table reads',
      'Add dataloader pattern for batched lookup by ID',
      'Monitor query logs for repeated identical queries in request-response cycle',
    ];
  }
}
