export class GenerateWrappedDto {
  year: number;
}

export class WrappedCardDto {
  rank: number;
  title: string;
  type: string;
  subtitle: string | null;
  imageUrl: string | null;
  stat: string | null;
}

export class WrappedStatDto {
  title: string;
  value: string;
  icon: string | null;
  sortOrder: number;
}

export class WrappedInsightDto {
  text: string;
  icon: string;
  category: string;
}

export class WrappedDto {
  id: string;
  userId: string;
  year: number;
  generatedAt: string;
  version: number;
  cards: WrappedCardDto[];
  stats: WrappedStatDto[];
  insights: WrappedInsightDto[];
  summary: string;
  sharePayload: Record<string, unknown>;
}

export class WrappedSummaryDto {
  id: string;
  year: number;
  generatedAt: string;
  version: number;
  totalCompleted: number;
  totalHours: number;
  totalJournalEntries: number;
}

export class WrappedShareDto {
  id: string;
  year: number;
  summary: string;
  highlights: WrappedInsightDto[];
  topCards: WrappedCardDto[];
  stats: WrappedStatDto[];
}

export class WrappedListDto {
  items: WrappedSummaryDto[];
}
