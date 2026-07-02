import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentEpisode?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentSeason?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentChapter?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentTrack?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentLesson?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentModule?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hoursSpent?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minutesSpent?: number;
}

export class ProgressResponseDto {
  progress: number;
  progressPercentage: number;
  currentEpisode: number | null;
  currentSeason: number | null;
  currentChapter: number | null;
  currentPage: number | null;
  currentTrack: number | null;
  currentLesson: number | null;
  currentModule: number | null;
  hoursSpent: number | null;
  minutesSpent: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  lastInteractionAt: string | null;
  status: string;
  mediaType: string;
  total: ProgressTotalDto;
}

export class ProgressTotalDto {
  totalEpisodes: number | null;
  totalSeasons: number | null;
  totalChapters: number | null;
  totalPages: number | null;
  totalTracks: number | null;
  totalLessons: number | null;
  totalModules: number | null;
  runtime: number | null;
  remaining: ProgressRemainingDto;
}

export class ProgressRemainingDto {
  episodes: number | null;
  pages: number | null;
  lessons: number | null;
  runtime: number | null;
}

export class RecentProgressItemDto {
  libraryId: string;
  mediaId: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  mediaType: string;
  progress: number;
  progressPercentage: number;
  status: string;
  updatedAt: string;
}
