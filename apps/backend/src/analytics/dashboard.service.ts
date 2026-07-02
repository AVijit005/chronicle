/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import type { DashboardDto, ContinueItemDto, RecentActivityItemDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getDashboard(userId: string): Promise<DashboardDto> {
    const [
      inProgressMovies,
      inProgressBooks,
      inProgressGames,
      inProgressMusic,
      inProgressCourses,
      recentlyAdded,
      recentlyCompleted,
      recentMemories,
      recentJournal,
      pinnedColls,
    ] = await Promise.all([
      this.repository.getInProgressByType(userId, 'movie', ['WATCHING'], 5),
      this.repository.getInProgressByType(userId, 'book', ['READING'], 5),
      this.repository.getInProgressByType(userId, 'game', ['PLAYING'], 5),
      this.repository.getInProgressByType(userId, 'musicAlbum', ['LISTENING'], 5),
      this.repository.getInProgressByType(userId, 'course', ['LEARNING'], 5),
      this.repository.getRecentlyAdded(userId, 5),
      this.repository.getRecentlyCompleted(userId, 5),
      this.repository.getRecentMemories(userId, 5),
      this.repository.getRecentJournalEntries(userId, 5),
      this.repository.getPinnedCollections(userId),
    ]);

    return {
      continueWatching: inProgressMovies.map((i: any) => this.toContinueItem(i, 'movie')),
      continueReading: inProgressBooks.map((i: any) => this.toContinueItem(i, 'book')),
      continuePlaying: inProgressGames.map((i: any) => this.toContinueItem(i, 'game')),
      continueListening: inProgressMusic.map((i: any) => this.toContinueItem(i, 'musicAlbum')),
      continueLearning: inProgressCourses.map((i: any) => this.toContinueItem(i, 'course')),
      recentlyAdded: recentlyAdded.map((i: any) => this.toRecentItem(i, 'added')),
      recentlyCompleted: recentlyCompleted.map((i: any) => this.toRecentItem(i, 'completed')),
      recentMemories: recentMemories.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: 'memory',
        date: m.createdAt?.toISOString() ?? '',
      })),
      recentJournalEntries: recentJournal.map((j: any) => ({
        id: j.id,
        title: j.title ?? 'Untitled',
        type: 'journal',
        date: j.createdAt?.toISOString() ?? '',
      })),
      pinnedCollections: pinnedColls.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        itemCount: c._count?.items ?? 0,
      })),
    };
  }

  private toContinueItem(item: any, mediaType: string): ContinueItemDto {
    const media = item[mediaType] ?? {};
    return {
      libraryId: item.id,
      mediaId: media.id ?? item[`${mediaType}Id`],
      title: media.title ?? 'Unknown',
      slug: media.slug ?? '',
      posterUrl: media.posterUrl ?? null,
      mediaType,
      progress: item.progress ?? 0,
      progressPercentage: item.progressPercentage ?? 0,
    };
  }

  private toRecentItem(item: any, action: string): RecentActivityItemDto {
    const mediaType = item._mediaType;
    const media = mediaType ? item[mediaType] : null;
    return {
      id: item.id,
      title: media?.title ?? 'Unknown',
      type: action,
      date: (action === 'completed' ? item.updatedAt : item.createdAt)?.toISOString() ?? '',
      metadata: { mediaType },
    };
  }
}
