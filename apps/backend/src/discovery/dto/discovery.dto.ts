export class RecommendationDto {
  mediaId: string;
  mediaTitle: string;
  mediaSlug: string;
  mediaType: string;
  posterUrl: string | null;
  accent: string | null;
  reason: string;
  source: string;
  confidence: number;
  compatibility: number;
  discoveryTags: string[];
  year: number;
  rating: number | null;
  genres: string[];
}

export class DiscoveryResponseDto {
  recommendedToday: RecommendationDto | null;
  continueMood: RecommendationDto[];
  hiddenGems: RecommendationDto[];
  continueFranchises: FranchiseDto[];
  comfortStories: RecommendationDto[];
  seasonalStories: RecommendationDto[];
  genreExpansion: GenreExpansionDto[];
  creatorRecommendations: CreatorRecDto[];
  trendingInLibrary: RecommendationDto[];
  undiscoveredFavorites: RecommendationDto[];
  shortWeekendStories: RecommendationDto[];
  longJourneyStories: RecommendationDto[];
  rewatchSuggestions: RecommendationDto[];
  almostFinished: RecommendationDto[];
}

export class FranchiseDto {
  creator: string;
  accent: string;
  current: { id: string; title: string; posterUrl: string | null; progress: number } | null;
  next: { id: string; title: string; posterUrl: string | null } | null;
  totalWorks: number;
  completedWorks: number;
}

export class GenreExpansionDto {
  genre: string;
  recommendation: RecommendationDto | null;
  yourTopMedia: { id: string; title: string; posterUrl: string | null }[];
}

export class CreatorRecDto {
  creator: string;
  accent: string;
  completedCount: number;
  totalWorks: number;
  topPick: { id: string; title: string; posterUrl: string | null } | null;
}
