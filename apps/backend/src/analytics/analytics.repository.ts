/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface UserLibConfig {
  delegate: string;
  mediaDelegate: string;
  mediaIdField: string;
  type: string;
  // ─── Rich Calendar Year ───────────────────────────────────────────────────

  async getCalendarYearData(userId: string, year: number): Promise<{ months: CalendarMonthRaw[]; heatmapCells: { week: number; day: number; value: number }[] }> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    const months: CalendarMonthRaw[] = [];
    const dayActivity: Record<string, number> = {};

    // Initialize empty month buckets
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let m = 0; m < 12; m++) {
      months.push({ month: m, name: monthNames[m], journalCount: 0, storyCount: 0, hoursTracked: 0, topMediaIds: [] as string[], dayHits: 0 });
    }

    // Journal entries for the year
    const journal = this.prismaAny().journalEntry;
    if (journal) {
      const entries = await journal.findMany({
        where: { userId, createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true },
      });
      for (const e of entries) {
        const m = e.createdAt.getMonth();
        months[m].journalCount++;
        months[m].dayHits++;
        const key = e.createdAt.toISOString().slice(0, 10);
        dayActivity[key] = (dayActivity[key] ?? 0) + 1;
      }
    }

    // Library items updated/completed this year
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;

      const items = await delegate.findMany({
        where: {
          userId,
          OR: [
            { updatedAt: { gte: startDate, lte: endDate } },
            { createdAt: { gte: startDate, lte: endDate } },
          ],
          deletedAt: null,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          status: true,
          hoursSpent: true,
          minutesSpent: true,
        },
        include: {
          [cfg.mediaDelegate]: {
            select: { id: true, title: true, posterUrl: true },
          },
        },
      });

      for (const item of items) {
        const date = item.updatedAt ?? item.createdAt;
        if (date < startDate || date > endDate) continue;
        const m = date.getMonth();
        months[m].storyCount++;
        months[m].dayHits++;
        months[m].hoursTracked += (item.hoursSpent ?? 0) + (item.minutesSpent ?? 0) / 60;

        const media = item[cfg.mediaDelegate] as { id: string; title: string; posterUrl: string | null } | null;
        if (media?.id && !months[m].topMediaIds.includes(media.id)) {
          months[m].topMediaIds.push(media.id);
        }

        const key = date.toISOString().slice(0, 10);
        dayActivity[key] = (dayActivity[key] ?? 0) + 1;
      }
    }

    // Build heatmap: 52 weeks × 7 days from dayActivity
    const heatmapCells: { week: number; day: number; value: number }[] = [];
    const yearStart = new Date(year, 0, 1);
    const daysInYear = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    for (let d = 0; d < daysInYear; d++) {
      const date = new Date(yearStart);
      date.setDate(date.getDate() + d);
      const key = date.toISOString().slice(0, 10);
      const value = dayActivity[key] ?? 0;
      const weekOfYear = Math.floor(d / 7);
      const dayOfWeek = date.getDay();
      if (value > 0) {
        heatmapCells.push({ week: weekOfYear, day: dayOfWeek, value: Math.min(1, value / 5) });
      }
    }

    return { months, heatmapCells };
  }

  async getYearHighlights(userId: string, year: number): Promise<any[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    const highlights: any[] = [];

    // Best day: most activity in a single day
    const activity = await this.getActivityData(userId, 365);
    let bestDay = { date: '', count: 0 };
    for (const [date, count] of Object.entries(activity)) {
      if (count > bestDay.count) { bestDay = { date, count }; }
    }
    if (bestDay.date) {
      highlights.push({
        label: 'Best Day',
        value: new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        note: `${bestDay.count} activities`,
        mediaId: 'interstellar',
        posterUrl: null,
        accent: 'oklch(0.72 0.18 255 / 0.3)',
      });
    }

    // Longest single-sitting media
    let longestTitle = '';
    let longestHours = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null, status: 'COMPLETED' },
        select: { hoursSpent: true, minutesSpent: true },
        include: { [cfg.mediaDelegate]: { select: { title: true, posterUrl: true } } },
        orderBy: { hoursSpent: 'desc' },
        take: 1,
      });
      for (const item of items) {
        const h = (item.hoursSpent ?? 0) + (item.minutesSpent ?? 0) / 60;
        if (h > longestHours) {
          longestHours = h;
          const media = item[cfg.mediaDelegate] as any;
          longestTitle = media?.title ?? '';
        }
      }
    }
    if (longestTitle) {
      highlights.push({
        label: 'Longest Session',
        value: longestTitle,
        note: `${Math.round(longestHours)}h spent`,
        mediaId: 'longest',
        posterUrl: null,
        accent: 'oklch(0.65 0.22 295 / 0.3)',
      });
    }

    return highlights;
  }

  async getYearStreaks(userId: string): Promise<any[]> {
    // These are computed from streak service — return placeholder structure
    return [];
  }

  async getYearUpcoming(userId: string): Promise<any[]> {
    // Find media with status PLANNING
    const upcoming: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, status: 'PLANNING', deletedAt: null },
        include: { [cfg.mediaDelegate]: { select: { id: true, title: true, posterUrl: true, releaseDate: true } } },
        take: 4,
      });
      for (const item of items) {
        const media = item[cfg.mediaDelegate] as any;
        upcoming.push({
          title: media?.title ?? 'Untitled',
          posterUrl: media?.posterUrl ?? null,
          mediaType: cfg.type,
          releaseDate: media?.releaseDate,
        });
      }
    }
    return upcoming.slice(0, 4);
  }
}

const USER_LIB_TYPES: UserLibConfig[] = [
  { delegate: 'userMovie', mediaDelegate: 'movie', mediaIdField: 'movieId', type: 'movie' },
  { delegate: 'userTvShow', mediaDelegate: 'tvShow', mediaIdField: 'tvShowId', type: 'tvShow' },
  { delegate: 'userAnime', mediaDelegate: 'anime', mediaIdField: 'animeId', type: 'anime' },
  { delegate: 'userBook', mediaDelegate: 'book', mediaIdField: 'bookId', type: 'book' },
  { delegate: 'userGame', mediaDelegate: 'game', mediaIdField: 'gameId', type: 'game' },
  { delegate: 'userMusicAlbum', mediaDelegate: 'musicAlbum', mediaIdField: 'musicAlbumId', type: 'musicAlbum' },
  { delegate: 'userPodcast', mediaDelegate: 'podcast', mediaIdField: 'podcastId', type: 'podcast' },
  { delegate: 'userCourse', mediaDelegate: 'course', mediaIdField: 'courseId', type: 'course' },
];

const _MEDIA_DELEGATES = ['movie', 'tvShow', 'anime', 'book', 'game', 'musicAlbum', 'podcast', 'course'];

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private prismaAny(): Record<string, any> {
    return this.prisma as unknown as Record<string, any>;
  }

  // ─── Library Stats ────────────────────────────────────────────────────────

  async countByStatus(userId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        select: { status: true },
      });
      for (const item of items) {
        counts[item.status] = (counts[item.status] ?? 0) + 1;
      }
    }
    return counts;
  }

  async countCompletedByType(userId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const count = await delegate.count({
        where: { userId, status: 'COMPLETED', deletedAt: null },
      });
      if (count > 0) counts[cfg.type] = count;
    }
    return counts;
  }

  async countTotalByType(userId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const count = await delegate.count({
        where: { userId, deletedAt: null },
      });
      if (count > 0) counts[cfg.type] = count;
    }
    return counts;
  }

  async getTotalLibraryItems(userId: string): Promise<number> {
    let total = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      total += await delegate.count({ where: { userId, deletedAt: null } });
    }
    return total;
  }

  async getProgressDistribution(userId: string): Promise<Record<string, number>> {
    const dist: Record<string, number> = {};
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        select: { progressPercentage: true },
      });
      for (const item of items) {
        const pct = item.progressPercentage ?? 0;
        if (pct === 0) dist['0'] = (dist['0'] ?? 0) + 1;
        else if (pct <= 25) dist['1-25'] = (dist['1-25'] ?? 0) + 1;
        else if (pct <= 50) dist['26-50'] = (dist['26-50'] ?? 0) + 1;
        else if (pct <= 75) dist['51-75'] = (dist['51-75'] ?? 0) + 1;
        else if (pct < 100) dist['76-99'] = (dist['76-99'] ?? 0) + 1;
        else dist['100'] = (dist['100'] ?? 0) + 1;
      }
    }
    return dist;
  }

  async getRatingsDistribution(userId: string): Promise<Record<string, number>> {
    const dist: Record<string, number> = {};
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, rating: { not: null }, deletedAt: null },
        select: { rating: true },
      });
      for (const item of items) {
        const r = item.rating ?? 0;
        const key = `${r}`;
        dist[key] = (dist[key] ?? 0) + 1;
      }
    }
    return dist;
  }

  async getAverageRating(userId: string): Promise<number | null> {
    let total = 0;
    let count = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, rating: { not: null }, deletedAt: null },
        select: { rating: true },
      });
      for (const item of items) {
        total += item.rating ?? 0;
        count++;
      }
    }
    return count > 0 ? total / count / 2 : null; // Convert to 0.5-5.0 scale
  }

  async getFavoriteCount(userId: string): Promise<number> {
    let total = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      total += await delegate.count({ where: { userId, favorite: true, deletedAt: null } });
    }
    return total;
  }

  async getReviewCount(userId: string): Promise<number> {
    let total = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        select: { metadata: true },
      });
      for (const item of items) {
        const meta = item.metadata as Record<string, any> | null;
        if (meta?.review) total++;
      }
    }
    return total;
  }

  async getBookmarkCount(userId: string): Promise<number> {
    let total = 0;
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const count = await delegate.count({
        where: { userId, deletedAt: null, bookmarked: true },
      });
      total += count;
    }
    return total;
  }

  // ─── Continue Watching / Reading / Playing / Listening / Learning ──────────

  async getInProgressByType(userId: string, type: string, statuses: string[], limit = 10): Promise<any[]> {
    const cfg = USER_LIB_TYPES.find((c) => c.type === type);
    if (!cfg) return [];

    const delegate = this.prismaAny()[cfg.delegate];
    if (!delegate) return [];

    return delegate.findMany({
      where: {
        userId,
        status: { in: statuses },
        deletedAt: null,
        progress: { gt: 0 },
        progressPercentage: { lt: 100 },
      },
      orderBy: { lastInteractionAt: 'desc' },
      take: limit,
      include: { [cfg.mediaDelegate]: { select: { id: true, slug: true, title: true, posterUrl: true } } },
    });
  }

  // ─── Recently Added / Completed ────────────────────────────────────────────

  async getRecentlyAdded(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { [cfg.mediaDelegate]: { select: { id: true, slug: true, title: true, posterUrl: true } } },
      });
      for (const item of items) results.push({ ...item, _mediaType: cfg.type });
    }
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return results.slice(0, limit);
  }

  async getRecentlyCompleted(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, status: 'COMPLETED', deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: { [cfg.mediaDelegate]: { select: { id: true, slug: true, title: true, posterUrl: true } } },
      });
      for (const item of items) results.push({ ...item, _mediaType: cfg.type });
    }
    results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return results.slice(0, limit);
  }

  // ─── Pinned Collections ───────────────────────────────────────────────────

  async getPinnedCollections(userId: string): Promise<any[]> {
    const delegate = this.prismaAny().collection;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId, isPinned: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { items: true } } },
    });
  }

  // ─── Journal & Memories ───────────────────────────────────────────────────

  async getRecentJournalEntries(userId: string, limit = 5): Promise<any[]> {
    const delegate = this.prismaAny().journalEntry;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecentMemories(userId: string, limit = 5): Promise<any[]> {
    const delegate = this.prismaAny().memory;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getJournalEntryDates(userId: string, limit = 365): Promise<Date[]> {
    const delegate = this.prismaAny().journalEntry;
    if (!delegate) return [];
    const items = await delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { createdAt: true },
    });
    return items.map((i: any) => i.createdAt);
  }

  // ─── Activity Heatmap ──────────────────────────────────────────────────────

  async getActivityData(userId: string, days = 365): Promise<Record<string, number>> {
    const heatmap: Record<string, number> = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Library items created
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, createdAt: { gte: startDate }, deletedAt: null },
        select: { createdAt: true },
      });
      for (const item of items) {
        const key = item.createdAt.toISOString().slice(0, 10);
        heatmap[key] = (heatmap[key] ?? 0) + 1;
      }
    }

    // Journal entries
    const journal = this.prismaAny().journalEntry;
    if (journal) {
      const entries = await journal.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { createdAt: true },
      });
      for (const e of entries) {
        const key = e.createdAt.toISOString().slice(0, 10);
        heatmap[key] = (heatmap[key] ?? 0) + 1;
      }
    }

    // Memories
    const memory = this.prismaAny().memory;
    if (memory) {
      const mems = await memory.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { createdAt: true },
      });
      for (const m of mems) {
        const key = m.createdAt.toISOString().slice(0, 10);
        heatmap[key] = (heatmap[key] ?? 0) + 1;
      }
    }

    return heatmap;
  }

  // ─── Calendar ──────────────────────────────────────────────────────────────

  async getCalendarData(userId: string, year: number, month: number): Promise<CalendarRawData> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const journalCounts: Record<string, number> = {};
    const memoryCounts: Record<string, number> = {};
    const completedCounts: Record<string, number> = {};
    const hoursTracked: Record<string, number> = {};

    // Journal entries
    const journal = this.prismaAny().journalEntry;
    if (journal) {
      const entries = await journal.findMany({
        where: { userId, createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true },
      });
      for (const e of entries) {
        const key = e.createdAt.toISOString().slice(0, 10);
        journalCounts[key] = (journalCounts[key] ?? 0) + 1;
      }
    }

    // Memories
    const memory = this.prismaAny().memory;
    if (memory) {
      const mems = await memory.findMany({
        where: { userId, createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true },
      });
      for (const m of mems) {
        const key = m.createdAt.toISOString().slice(0, 10);
        memoryCounts[key] = (memoryCounts[key] ?? 0) + 1;
      }
    }

    // Completed items + hours tracked
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, updatedAt: { gte: startDate, lte: endDate }, status: 'COMPLETED', deletedAt: null },
        select: { updatedAt: true, minutesSpent: true, hoursSpent: true },
      });
      for (const item of items) {
        const key = item.updatedAt.toISOString().slice(0, 10);
        completedCounts[key] = (completedCounts[key] ?? 0) + 1;
        const hours = (item.hoursSpent ?? 0) + (item.minutesSpent ?? 0) / 60;
        hoursTracked[key] = (hoursTracked[key] ?? 0) + hours;
      }
    }

    return { journalCounts, memoryCounts, completedCounts, hoursTracked };
  }

  // ─── Genre Stats ──────────────────────────────────────────────────────────

  async getGenreData(userId: string): Promise<GenreRawData> {
    const genreCounts: Record<string, number> = {};
    const genreCompleted: Record<string, number> = {};
    const genreRatings: Record<string, { total: number; count: number }> = {};
    const genreTime: Record<string, number> = {};

    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.prismaAny()[cfg.delegate];
      if (!delegate) continue;

      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        select: { status: true, rating: true, minutesSpent: true, hoursSpent: true },
        include: { [cfg.mediaDelegate]: { select: { genres: true } } },
      });

      for (const item of items) {
        const media = item[cfg.mediaDelegate];
        const genres: string[] = media?.genres ?? [];
        for (const genre of genres) {
          genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
          if (item.status === 'COMPLETED') genreCompleted[genre] = (genreCompleted[genre] ?? 0) + 1;
          if (item.rating) {
            if (!genreRatings[genre]) genreRatings[genre] = { total: 0, count: 0 };
            genreRatings[genre].total += item.rating;
            genreRatings[genre].count++;
          }
          const hours = (item.hoursSpent ?? 0) + (item.minutesSpent ?? 0) / 60;
          genreTime[genre] = (genreTime[genre] ?? 0) + hours;
        }
      }
    }

    return { genreCounts, genreCompleted, genreRatings, genreTime };
  }

  // ─── Timeline / Activity Feed ──────────────────────────────────────────────

  async getRecentTimelineEvents(userId: string, limit = 20): Promise<any[]> {
    const delegate = this.prismaAny().timelineEvent;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { eventDate: 'desc' },
      take: limit,
    });
  }

  // ─── Analytics Snapshot ───────────────────────────────────────────────────

  async saveSnapshot(userId: string, data: Record<string, any>): Promise<void> {
    const delegate = this.prismaAny().analyticsSnapshot;
    if (!delegate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await delegate.upsert({
      where: { userId_snapshotDate: { userId, snapshotDate: today } },
      update: { ...data, metadata: {} },
      create: { userId, snapshotDate: today, ...data },
    });
  }

  async getSnapshots(userId: string, limit = 30): Promise<any[]> {
    const delegate = this.prismaAny().analyticsSnapshot;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }
}

interface CalendarRawData {
  journalCounts: Record<string, number>;
  memoryCounts: Record<string, number>;
  completedCounts: Record<string, number>;
  hoursTracked: Record<string, number>;
}

interface GenreRawData {
  genreCounts: Record<string, number>;
  genreCompleted: Record<string, number>;
  genreRatings: Record<string, { total: number; count: number }>;
  genreTime: Record<string, number>;
}
