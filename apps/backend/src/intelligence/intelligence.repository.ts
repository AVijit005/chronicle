/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const USER_LIB_TYPES = [
  { lib: 'userMovie', media: 'movie', mediaIdField: 'movieId', type: 'movie' },
  { lib: 'userTvShow', media: 'tvShow', mediaIdField: 'tvShowId', type: 'tvShow' },
  { lib: 'userAnime', media: 'anime', mediaIdField: 'animeId', type: 'anime' },
  { lib: 'userBook', media: 'book', mediaIdField: 'bookId', type: 'book' },
  { lib: 'userGame', media: 'game', mediaIdField: 'gameId', type: 'game' },
  { lib: 'userMusicAlbum', media: 'musicAlbum', mediaIdField: 'musicAlbumId', type: 'music' },
  { lib: 'userPodcast', media: 'podcast', mediaIdField: 'podcastId', type: 'podcast' },
  { lib: 'userCourse', media: 'course', mediaIdField: 'courseId', type: 'course' },
];

const TIME_SLOTS: { label: string; start: number; end: number }[] = [
  { label: 'Early morning', start: 4, end: 8 },
  { label: 'Morning', start: 8, end: 12 },
  { label: 'Afternoon', start: 12, end: 17 },
  { label: 'Evening', start: 17, end: 21 },
  { label: 'Late evening', start: 21, end: 24 },
  { label: 'Late night', start: 0, end: 4 },
];

const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'];
const COMPANIONS = ['Alone', 'With partner', 'With friends', 'With family', 'In public'];

function getSeason(date: Date): string {
  const m = date.getMonth();
  if (m < 2 || m === 11) return 'Winter';
  if (m < 5) return 'Spring';
  if (m < 8) return 'Summer';
  return 'Autumn';
}

function getTimeSlot(date: Date): string {
  const h = date.getHours();
  const slot = TIME_SLOTS.find((s) => h >= s.start && h < s.end);
  return slot?.label ?? 'Evening';
}

@Injectable()
export class IntelligenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private db(): Record<string, any> {
    return this.prisma as unknown as Record<string, any>;
  }

  async getFullLibraryWithMedia(userId: string): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        include: {
          [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true, creator: true, runtime: true, language: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      for (const item of items) {
        const media = item[cfg.media];
        results.push({
          id: item.id,
          type: cfg.type,
          status: item.status,
          progress: item.progressPercentage ?? 0,
          rating: item.rating,
          favorite: item.favorite ?? false,
          hoursSpent: (item.hoursSpent ?? 0) + (item.minutesSpent ?? 0) / 60,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          lastInteractionAt: item.lastInteractionAt,
          mediaId: media?.id,
          title: media?.title,
          posterUrl: media?.posterUrl,
          genres: media?.genres ?? [],
          year: media?.year,
          creator: media?.creator,
          runtime: media?.runtime,
          language: media?.language,
        });
      }
    }
    return results;
  }

  async getJournalEntries(userId: string): Promise<any[]> {
    const delegate = this.db().journalEntry;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { content: true, mood: true, weather: true, createdAt: true, updatedAt: true },
    });
  }

  async getMemories(userId: string): Promise<any[]> {
    const delegate = this.db().memory;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { title: true, emotion: true, memoryDate: true, createdAt: true },
    });
  }

  async getCompletedItemDates(userId: string): Promise<Date[]> {
    const dates: Date[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, status: 'COMPLETED', updatedAt: { not: null }, deletedAt: null },
        select: { updatedAt: true },
      });
      items.forEach((i) => dates.push(i.updatedAt!));
    }
    return dates;
  }
}
