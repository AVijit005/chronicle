export class TasteProfileDto {
  favoriteGenres: { name: string; count: number }[];
  favoriteCreators: { name: string; count: number }[];
  favoriteEras: { name: string; count: number }[];
  favoriteLanguages: string[];
  favoriteRuntime: string;
  favoritePlatforms: string[];
  favoriteSeasons: string[];
  favoriteTimeOfDay: string;
  favoriteMood: string;
  favoriteCompanion: string;
  favoriteCompletionPattern: string;
}

export class MemoryDNADto {
  dominantEmotion: string;
  season: string;
  companion: string;
  importance: number;
  reflectionDepth: number;
  journalRichness: number;
  favoriteLevel: number;
  memoryStrength: number;
}

export class PersonalStatementDto {
  statement: string;
  confidence: number;
  evidence: string;
}

export class MediaEvolutionDto {
  year: string;
  focus: string;
  mediaCount: number;
  hoursSpent: number;
  topGenre: string;
  journalCount: number;
}

export class IntelligenceResponseDto {
  tasteProfile: TasteProfileDto;
  personalStatements: PersonalStatementDto[];
  mediaEvolution: MediaEvolutionDto[];
  editorialInsight: string;
  impactSummary: { label: string; value: number; evidence?: string }[];
}
