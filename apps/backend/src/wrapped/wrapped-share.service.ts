import { Injectable } from '@nestjs/common';
import type { WrappedShareDto, WrappedInsightDto, WrappedCardDto, WrappedStatDto } from './dto';

@Injectable()
export class WrappedShareService {
  buildSharePayload(
    wrappedId: string,
    year: number,
    summary: string,
    highlights: WrappedInsightDto[],
    topCards: WrappedCardDto[],
    stats: WrappedStatDto[],
  ): WrappedShareDto {
    return {
      id: wrappedId,
      year,
      summary,
      highlights: highlights.slice(0, 5),
      topCards: topCards.slice(0, 8),
      stats: stats.slice(0, 10),
    };
  }
}
