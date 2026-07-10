import { Injectable } from '@nestjs/common';
import { IntelligenceRepository } from './intelligence.repository';
import type {
  IntelligenceResponseDto,
  TasteProfileDto,
  PersonalStatementDto,
  MediaEvolutionDto,
  MemoryDNADto,
} from './dto';

const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'];
const COMPANIONS = ['Alone', 'With partner', 'With friends', 'With family'];

function getSeason(date: Date): string {
  const m = date.getMonth();
  if (m < 2 || m === 11) return 'Winter';
  if (m < 5) return 'Spring';
  if (m < 8) return 'Summer';
  return 'Autumn';
}

function getTimeSlot(date: Date): string {
  const h = date.getHours();
  if (h >= 4 && h < 8) return 'Early morning';
  if (h >= 8 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 21) return 'Evening';
  if (h >= 21) return 'Late evening';
  return 'Late night';
}

@Injectable()
export class IntelligenceService {
  constructor(private readonly repo: IntelligenceRepository) {}

  async getIntelligence(userId: string): Promise<IntelligenceResponseDto> {
    const [library, journalEntries, memories, completedDates] = await Promise.all([
      this.repo.getFullLibraryWithMedia(userId),
      this.repo.getJournalEntries(userId),
      this.repo.getMemories(userId),
      this.repo.getCompletedItemDates(userId),
    ]);

    const tasteProfile = this.buildTasteProfile(library, journalEntries, completedDates);
    const statements = this.buildPersonalStatements(library, journalEntries);
    const evolution = this.buildMediaEvolution(library, journalEntries);
    const insight = this.buildEditorialInsight(library, journalEntries);

    return {
      tasteProfile,
      personalStatements: statements,
      mediaEvolution: evolution,
      editorialInsight: insight,
      impactSummary: this.buildImpactSummary(library, journalEntries),
    };
  }

  private buildTasteProfile(library: any[], journalEntries: any[], completedDates: Date[]): TasteProfileDto {
    const genreCount = new Map<string, number>();
    const creatorCount = new Map<string, number>();
    const eraCount = new Map<string, number>();
    const languageSet = new Set<string>();
    let totalRuntime = 0;
    let seasonTally: Record<string, number> = {};
    let timeTally: Record<string, number> = {};
    let slowCount = 0;
    let fastCount = 0;
    let totalMedia = 0;

    for (const item of library) {
      for (const g of item.genres) genreCount.set(g, (genreCount.get(g) ?? 0) + 1);
      if (item.creator) creatorCount.set(item.creator, (creatorCount.get(item.creator) ?? 0) + 1);
      if (item.year) {
        const era = `${Math.floor(item.year / 10) * 10}s`;
        eraCount.set(era, (eraCount.get(era) ?? 0) + 1);
      }
      if (item.language) languageSet.add(item.language);
      totalRuntime += item.hoursSpent;
      totalMedia++;
      if (item.progress >= 90 && item.status === 'COMPLETED') slowCount++;
      if (item.progress < 90) fastCount++;
    }

    for (const date of completedDates) {
      const season = getSeason(date);
      seasonTally[season] = (seasonTally[season] ?? 0) + 1;
      const slot = getTimeSlot(date);
      timeTally[slot] = (timeTally[slot] ?? 0) + 1;
    }

    const topSeason = Object.entries(seasonTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Winter';
    const topTime = Object.entries(timeTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Late evening';
    const companion = library.length > 5 ? 'Alone' : 'With partner';

    return {
      favoriteGenres: [...genreCount].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
      favoriteCreators: [...creatorCount].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
      favoriteEras: [...eraCount].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => ({ name, count })),
      favoriteLanguages: [...languageSet].slice(0, 3),
      favoriteRuntime: totalMedia > 0
        ? `${Math.round(totalRuntime / totalMedia)}h avg · ${slowCount > fastCount ? 'Slow & complete' : 'Quick sessions'}`
        : '2–3h films',
      favoritePlatforms: ['Personal library'],
      favoriteSeasons: [topSeason, ...Object.keys(seasonTally).filter((s) => s !== topSeason)].slice(0, 2),
      favoriteTimeOfDay: topTime,
      favoriteMood: journalEntries.length > 0
        ? (Object.entries(journalEntries.reduce((acc: Record<string, number>, j) => {
          if (j.mood) acc[j.mood] = (acc[j.mood] ?? 0) + 1;
          return acc;
        }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Reflective')
        : 'Awe',
      favoriteCompanion: companion,
      favoriteCompletionPattern: slowCount > fastCount ? 'Slow & complete' : fastCount > slowCount ? 'Quick & varied' : 'Steady rhythm',
    };
  }

  private buildPersonalStatements(library: any[], journalEntries: any[]): PersonalStatementDto[] {
    const statements: PersonalStatementDto[] = [];
    const completed = library.filter((l) => l.status === 'COMPLETED');
    const dropped = library.filter((l) => l.status === 'DROPPED');
    const rated = library.filter((l) => l.rating);
    const avgRating = rated.length ? rated.reduce((s, l) => s + (l.rating ?? 0), 0) / rated.length : 0;

    if (completed.length > dropped.length && completed.length > 3) {
      statements.push({ statement: 'You finish what you start.', confidence: 0.85, evidence: `${completed.length} completed vs ${dropped.length} dropped` });
    }
    if (avgRating >= 4) {
      statements.push({ statement: 'You rate generously — you love what you love.', confidence: 0.7, evidence: `${avgRating.toFixed(1)} avg rating across ${rated.length} titles` });
    }
    if (journalEntries.length > 10) {
      statements.push({ statement: 'You process stories through words.', confidence: 0.8, evidence: `${journalEntries.length} journal entries` });
    }
    if (library.some((l) => l.genres.includes('Sci-Fi') || l.genres.includes('Fantasy'))) {
      statements.push({ statement: 'You're drawn to worlds beyond this one.', confidence: 0.65, evidence: 'Sci-Fi / Fantasy in your library' });
    }
    if (completed.length >= 5) {
      statements.push({ statement: 'You prefer quiet, meaningful completions.', confidence: 0.6, evidence: `${completed.length} stories finished` });
    }
    return statements.slice(0, 5);
  }

  private buildMediaEvolution(library: any[], journalEntries: any[]): MediaEvolutionDto[] {
    const byYear = new Map<string, { count: number; hours: number; genres: Record<string, number>; journals: number }>();
    for (const item of library) {
      const year = item.createdAt ? new Date(item.createdAt).getFullYear().toString() : 'Unknown';
      const entry = byYear.get(year) || { count: 0, hours: 0, genres: {}, journals: 0 };
      entry.count++;
      entry.hours += item.hoursSpent;
      for (const g of item.genres) entry.genres[g] = (entry.genres[g] ?? 0) + 1;
      byYear.set(year, entry);
    }
    for (const j of journalEntries) {
      const year = new Date(j.createdAt).getFullYear().toString();
      const entry = byYear.get(year);
      if (entry) entry.journals++;
    }

    return [...byYear].sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([year, data]) => ({
      year,
      focus: Object.entries(data.genres).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mixed',
      mediaCount: data.count,
      hoursSpent: Math.round(data.hours),
      topGenre: Object.entries(data.genres).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—',
      journalCount: data.journals,
    }));
  }

  private buildEditorialInsight(library: any[], journalEntries: any[]): string {
    if (library.length === 0) return 'Your library is waiting to shape itself. Add a story to begin.';
    const topGenre = this.buildTasteProfile(library, journalEntries, []).favoriteGenres[0]?.name;
    if (topGenre && journalEntries.length > 5) {
      return `You love ${topGenre.toLowerCase()} stories, and you write about them — a rare combination of experiencing and processing.`;
    }
    if (topGenre) return `Your library orbits around ${topGenre.toLowerCase()} — a clear gravitational pull.`;
    return 'Your taste is still emerging. Keep adding stories and patterns will surface.';
  }

  private buildImpactSummary(library: any[], journalEntries: any[]): { label: string; value: number; evidence?: string }[] {
    const completed = library.filter((l) => l.status === 'COMPLETED').length;
    const total = library.length || 1;
    return [
      { label: 'Completion rate', value: Math.min(1, completed / total), evidence: `${completed}/${total} completed` },
      { label: 'Journal depth', value: Math.min(1, journalEntries.length / 20), evidence: `${journalEntries.length} entries` },
      { label: 'Comfort revisits', value: Math.min(1, library.filter((l) => l.progress >= 100 && l.status === 'COMPLETED').length / 10) },
      { label: 'Genre diversity', value: Math.min(1, new Set(library.flatMap((l) => l.genres)).size / 10) },
      { label: 'Rating confidence', value: Math.min(1, library.filter((l) => l.rating).length / total) },
    ];
  }

  async getMemoryDNA(library: any[], journalEntries: any[], mediaTitle?: string): Promise<MemoryDNADto | null> {
    const matchingJournals = journalEntries.filter((j) =>
      mediaTitle ? j.content?.toLowerCase().includes(mediaTitle.toLowerCase().slice(0, 15)) : false,
    );
    const relatedItems = library.filter((l) =>
      mediaTitle ? l.title?.toLowerCase().includes(mediaTitle.toLowerCase().slice(0, 15)) : false,
    );

    if (!matchingJournals.length && !relatedItems.length) {
      return {
        dominantEmotion: 'Reflective',
        season: 'Winter',
        companion: 'Alone',
        importance: 0.4,
        reflectionDepth: 0.2,
        journalRichness: 0.2,
        favoriteLevel: 0.3,
        memoryStrength: 0.3,
      };
    }

    const moodTally: Record<string, number> = {};
    for (const j of matchingJournals) {
      if (j.mood) moodTally[j.mood] = (moodTally[j.mood] ?? 0) + 1;
    }
    const dominantEmotion = Object.entries(moodTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Reflective';

    const dates = matchingJournals.map((j) => new Date(j.createdAt));
    const seasonTally: Record<string, number> = {};
    for (const d of dates) {
      const s = getSeason(d);
      seasonTally[s] = (seasonTally[s] ?? 0) + 1;
    }
    const topSeason = Object.entries(seasonTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Winter';

    return {
      dominantEmotion,
      season: topSeason,
      companion: matchingJournals.length > 3 ? 'Alone' : 'With partner',
      importance: Math.min(1, 0.4 + matchingJournals.length * 0.15),
      reflectionDepth: Math.min(1, matchingJournals.reduce((s, j) => s + (j.content?.length ?? 0), 0) / 2000),
      journalRichness: Math.min(1, matchingJournals.length / 5),
      favoriteLevel: Math.min(1, 0.3 + relatedItems.filter((r) => r.favorite).length * 0.2),
      memoryStrength: Math.min(1, 0.3 + matchingJournals.length * 0.1),
    };
  }
}
