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

const GENRES = [
  'Sci-Fi', 'Drama', 'Adventure', 'Fantasy', 'Action', 'Comedy', 'Romance', 'Thriller',
  'Horror', 'Mystery', 'Documentary', 'Animation', 'Musical', 'Historical', 'Western',
];

@Injectable()
export class DiscoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private db(): Record<string, any> {
    return this.prisma as unknown as Record<string, any>;
  }

  async getTopRated(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, rating: { not: null }, deletedAt: null },
        orderBy: { rating: 'desc' },
        take: limit,
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true } } },
      });
      for (const item of items) results.push({ ...item, _type: cfg.type, _media: item[cfg.media] });
    }
    results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return results.slice(0, limit);
  }

  async getInProgress(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: {
          userId,
          status: { in: ['IN_PROGRESS', 'WATCHING', 'READING', 'PLAYING'] as any },
          progressPercentage: { gt: 0, lt: 100 },
          deletedAt: null,
        },
        orderBy: { lastInteractionAt: 'desc' },
        take: limit,
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true } } },
      });
      for (const item of items) results.push({ ...item, _type: cfg.type, _media: item[cfg.media] });
    }
    results.sort((a, b) => (b.lastInteractionAt?.getTime() ?? 0) - (a.lastInteractionAt?.getTime() ?? 0));
    return results.slice(0, limit);
  }

  async getHiddenGems(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, rating: { gte: 4 }, reviewCount: { lte: 3 } as any, deletedAt: null },
        orderBy: { rating: 'desc' },
        take: limit,
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true } } },
      });
      for (const item of items) results.push({ ...item, _type: cfg.type, _media: item[cfg.media] });
    }
    results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return results.slice(0, limit);
  }

  async getLibraryByCreator(userId: string): Promise<Map<string, any[]>> {
    const byCreator = new Map<string, any[]>();
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        include: {
          [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, creator: true, genres: true, year: true } },
        },
      });
      for (const item of items) {
        const media = item[cfg.media];
        if (!media?.creator) continue;
        const list = byCreator.get(media.creator) || [];
        list.push({
          id: media.id, title: media.title, slug: media.slug,
          posterUrl: media.posterUrl, creator: media.creator,
          genres: media.genres ?? [], year: media.year,
          type: cfg.type, status: item.status, progress: item.progressPercentage ?? 0,
        });
        byCreator.set(media.creator, list);
      }
    }
    return byCreator;
  }

  async getGenreData(userId: string): Promise<Map<string, { count: number; items: any[] }>> {
    const byGenre = new Map<string, { count: number; items: any[] }>();
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        include: {
          [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true } },
        },
      });
      for (const item of items) {
        const media = item[cfg.media];
        const genres: string[] = media?.genres ?? [];
        for (const g of genres) {
          const entry = byGenre.get(g) || { count: 0, items: [] };
          entry.count++;
          if (entry.items.length < 5) {
            entry.items.push({
              id: media.id, title: media.title, posterUrl: media.posterUrl,
              type: cfg.type, year: media.year,
            });
          }
          byGenre.set(g, entry);
        }
      }
    }
    return byGenre;
  }

  async getShortMedia(userId: string): Promise<any[]> {
    return []; // TODO: implement with minutes tracking
  }

  async getLongMedia(userId: string): Promise<any[]> {
    return []; // TODO: implement with minutes tracking
  }

  async getAlmostFinished(userId: string, limit = 10): Promise<any[]> {
    const results: any[] = [];
    for (const cfg of USER_LIB_TYPES) {
      const delegate = this.db()[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: {
          userId,
          status: { not: 'COMPLETED' },
          progressPercentage: { gte: 75 },
          deletedAt: null,
        },
        orderBy: { progressPercentage: 'desc' },
        take: limit,
        include: { [cfg.media]: { select: { id: true, title: true, slug: true, posterUrl: true, genres: true, year: true } } },
      });
      for (const item of items) results.push({ ...item, _type: cfg.type, _media: item[cfg.media] });
    }
    return results.slice(0, limit);
  }
}
