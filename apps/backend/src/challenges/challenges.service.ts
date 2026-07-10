import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from './challenges.repository';
import type { ChallengeDto, GoalDto, EngagementResponseDto } from './dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly repo: ChallengesRepository) {}

  async getEngagement(userId: string): Promise<EngagementResponseDto> {
    const [byGenre, journalCount, memoryCount, completedThisMonth, library] =
      await Promise.all([
        this.repo.getIncompleteByGenre(userId),
        this.repo.getJournalCount(userId),
        this.repo.getMemoryCount(userId),
        this.repo.getCompletedThisMonth(userId),
        this.repo.getLibraryItems(userId),
      ]);

    const challenges: ChallengeDto[] = [];

    // Genre challenge — pick the genre with most incomplete items
    let maxGenre = '';
    let maxCount = 0;
    for (const [g, data] of byGenre) {
      if (data.count > maxCount) { maxGenre = g; maxCount = data.count; }
    }

    if (maxGenre) {
      const genreData = byGenre.get(maxGenre)!;
      const target = Math.min(3, genreData.count);
      challenges.push({
        id: `ch-${maxGenre.toLowerCase()}`,
        kind: 'Genre',
        title: `Watch ${target} ${maxGenre} titles`,
        description: 'Stories already waiting in your library.',
        target,
        current: Math.floor(target / 3),
        reward: `A new perspective on ${maxGenre}.`,
        accent: 'oklch(0.72 0.18 255)',
        suggestions: genreData.items.slice(0, 3).map((i) => ({ id: i.id, title: i.title, posterUrl: i.posterUrl, mediaType: i.mediaType })),
      });
    }

    // Journal challenge
    if (journalCount < 30) {
      challenges.push({
        id: 'ch-journal',
        kind: 'Journal',
        title: 'Write 5 journal entries',
        description: 'Capture one thought every few days.',
        target: 5,
        current: Math.min(journalCount, 5),
        reward: 'A clearer map of your week.',
        accent: 'oklch(0.65 0.22 295)',
        suggestions: [],
      });
    }

    // Monthly completion challenge
    const monthlyTarget = Math.max(2, 5 - completedThisMonth);
    challenges.push({
      id: 'ch-monthly',
      kind: 'Monthly',
      title: `Complete ${monthlyTarget} stories this month`,
      description: 'Wrap up what you started.',
      target: monthlyTarget,
      current: Math.min(completedThisMonth, monthlyTarget),
      reward: 'A satisfying close to the month.',
      accent: 'oklch(0.72 0.16 160)',
      suggestions: library.filter((i: any) => i.status === 'IN_PROGRESS').slice(0, 3).map((i: any) => ({
        id: i._media?.id ?? '', title: i._media?.title ?? '', posterUrl: i._media?.posterUrl ?? null, mediaType: i._type,
      })),
    });

    // Memory challenge
    challenges.push({
      id: 'ch-memory',
      kind: 'Memory',
      title: 'Create 3 memory highlights',
      description: 'Save the moments worth returning to.',
      target: 3,
      current: Math.min(memoryCount % 3, 3),
      reward: 'Three keepsakes.',
      accent: 'oklch(0.78 0.16 80)',
      suggestions: [],
    });

    // Goals from longest-running incomplete items
    const goals: GoalDto[] = [];
    const oldest = library
      .filter((i: any) => i.status !== 'COMPLETED' && i.status !== 'DROPPED')
      .slice(0, 3);

    for (const item of oldest) {
      goals.push({
        id: `goal-${item.id}`,
        title: `Finish ${item._media?.title ?? 'this story'}`,
        description: 'A journey worth completing.',
        current: item.progressPercentage ?? 0,
        target: 100,
        priority: (item.progressPercentage ?? 0) > 50 ? 'high' : 'med',
        reward: 'The satisfaction of completion.',
        reason: 'You started this for a reason.',
        status: 'Active',
        startedAt: item.createdAt?.toISOString().slice(0, 10) ?? '',
        accent: 'oklch(0.7 0.18 35)',
        coverIds: [item._media?.id ?? ''],
        milestones: [
          { label: 'Started', reached: true, when: item.createdAt?.toISOString().slice(0, 10) },
          { label: 'Halfway', reached: (item.progressPercentage ?? 0) >= 50 },
          { label: 'Almost there', reached: (item.progressPercentage ?? 0) >= 80 },
          { label: 'Completed', reached: false },
        ],
        kind: 'creator',
      });
    }

    return { challenges, goals };
  }
}
