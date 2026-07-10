import { Injectable } from '@nestjs/common';
import { DiscoveryRepository } from './discovery.repository';
import type { DiscoveryResponseDto, RecommendationDto, FranchiseDto } from './dto';

@Injectable()
export class DiscoveryService {
  constructor(private readonly repo: DiscoveryRepository) {}

  async getDiscovery(userId: string): Promise<DiscoveryResponseDto> {
    const [topRated, inProgress, hiddenGems, byCreator, byGenre, almostFinished] =
      await Promise.all([
        this.repo.getTopRated(userId, 10),
        this.repo.getInProgress(userId, 10),
        this.repo.getHiddenGems(userId, 10),
        this.repo.getLibraryByCreator(userId),
        this.repo.getGenreData(userId),
        this.repo.getAlmostFinished(userId, 10),
      ]);

    const toRec = (item: any, reason: string, source: string, tags: string[] = []): RecommendationDto => ({
      mediaId: item._media?.id ?? '',
      mediaTitle: item._media?.title ?? '',
      mediaSlug: item._media?.slug ?? '',
      mediaType: item._type ?? 'movie',
      posterUrl: item._media?.posterUrl ?? null,
      accent: null,
      reason,
      source,
      confidence: 0.7,
      compatibility: 0.6,
      discoveryTags: tags,
      year: item._media?.year ?? 0,
      rating: item.rating ?? null,
      genres: item._media?.genres ?? [],
    });

    // Franchises from creators with 2+ works
    const franchises: FranchiseDto[] = [];
    for (const [creator, works] of byCreator) {
      if (works.length < 2) continue;
      const completed = works.filter((w) => w.status === 'COMPLETED');
      const inProgress = works.filter((w) => (w.status !== 'COMPLETED') && (w as any).progress > 0);
      franchises.push({
        creator,
        accent: 'oklch(0.72 0.18 255)',
        current: inProgress[0] ? { id: inProgress[0].id, title: inProgress[0].title, posterUrl: inProgress[0].posterUrl, progress: (inProgress[0] as any).progress } : null,
        next: works.find((w) => w.status !== 'COMPLETED' && w !== inProgress[0]) ? {
          id: works.find((w) => w.status !== 'COMPLETED' && w !== inProgress[0])!.id,
          title: works.find((w) => w.status !== 'COMPLETED' && w !== inProgress[0])!.title,
          posterUrl: works.find((w) => w.status !== 'COMPLETED' && w !== inProgress[0])!.posterUrl,
        } : null,
        totalWorks: works.length,
        completedWorks: completed.length,
      });
    }

    return {
      recommendedToday: topRated[0] ? toRec(topRated[0], "Today's recommendation", 'editorial', ['Today']) : null,
      continueMood: inProgress.slice(0, 6).map((i) => toRec(i, 'Continue this mood', 'mood', ['Continue'])),
      hiddenGems: hiddenGems.slice(0, 8).map((h) => toRec(h, 'Hidden gem in your library', 'editorial', ['Hidden Gem'])),
      continueFranchises: franchises.slice(0, 6),
      comfortStories: topRated.slice(0, 6).map((t) => toRec(t, 'A comforting choice', 'comfort', ['Comfort'])),
      seasonalStories: topRated.slice(0, 6).map((t) => toRec(t, 'Perfect for this season', 'season', ['Seasonal'])),
      genreExpansion: [],
      creatorRecommendations: [],
      trendingInLibrary: topRated.slice(0, 6).map((t) => toRec(t, 'Trending in your library', 'trending', ['Trending'])),
      undiscoveredFavorites: [],
      shortWeekendStories: [],
      longJourneyStories: [],
      rewatchSuggestions: [],
      almostFinished: almostFinished.slice(0, 6).map((a) =>
        toRec(a, 'Almost there — finish strong', 'almost-finished', ['Almost done'])),
    };
  }
}
