/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const USER_LIB_TYPES = [
  { lib: 'userMovie', media: 'movie', mediaIdField: 'movieId', type: 'movie', mediaKind: 'movie' },
  { lib: 'userTvShow', media: 'tvShow', mediaIdField: 'tvShowId', type: 'tvShow' },
  { lib: 'userAnime', media: 'anime', mediaIdField: 'animeId', type: 'anime' },
  { lib: 'userBook', media: 'book', mediaIdField: 'bookId', type: 'book' },
  { lib: 'userGame', media: 'game', mediaIdField: 'gameId', type: 'game' },
  { lib: 'userMusicAlbum', media: 'musicAlbum', mediaIdField: 'musicAlbumId', type: 'musicAlbum' },
  { lib: 'userPodcast', media: 'podcast', mediaIdField: 'podcastId', type: 'podcast' },
  { lib: 'userCourse', media: 'course', mediaIdField: 'courseId', type: 'course' },
];

@Injectable()
export class ChallengesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private db(): Record<string, any> {
    return this.prisma as unknown as Record<string, any>;
  }

  async getIncompleteByGenre(userId: string): Promise<Map<string, { count: number; items: any[] }>> {
    const byGenre = new Map<string, { count: number; items: any[] }>();
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, status: { not: 'COMPLETED' }, deletedAt: null },
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true } } },
      });
      for (const item of items) {
        const media = item[cfg.media];
        for (const g of (media?.genres ?? [])) {
          const entry = byGenre.get(g) || { count: 0, items: [] };
          entry.count++;
          if (entry.items.length < 3) {
            entry.items.push({ id: media.id, title: media.title, posterUrl: media.posterUrl, mediaType: cfg.type });
          }
          byGenre.set(g, entry);
        }
      }
    }
    return byGenre;
  }

  async getJournalCount(userId: string): Promise<number> {
    const delegate = this.db().journalEntry;
    if (!delegate) return 0;
    return delegate.count({ where: { userId } });
  }

  async getMemoryCount(userId: string): Promise<number> {
    const delegate = this.db().memory;
    if (!delegate) return 0;
    return delegate.count({ where: { userId } });
  }

  async getCompletedThisMonth(userId: string): Promise<number> {
    let count = 0;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      count += await delegate.count({
        where: { userId, status: 'COMPLETED', updatedAt: { gte: start }, deletedAt: null },
      });
    }
    return count;
  }

  async getLibraryItems(userId: string): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true } } },
        orderBy: { createdAt: 'asc' },
      });
      for (const item of items) {
        results.push({ ...item, _type: cfg.type, _media: item[cfg.media] });
      }
    }
    return results;
  }
}
