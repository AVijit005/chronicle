import { Injectable } from '@nestjs/common';
import { MediaRepository } from './media.repository';

export interface MediaMetadata {
  posterUrl: string | null;
  backdropUrl: string | null;
  bannerUrl: string | null;
  coverImage: string | null;
  thumbnail: string | null;
  runtime: number | null;
  duration: number | null;
  genres: string[];
  studios: string[];
  publishers: string[];
  developers: string[];
  authors: string[];
  artists: string[];
  episodeCount: number | null;
  chapterCount: number | null;
  trackCount: number | null;
  moduleCount: number | null;
  externalIds: Record<string, unknown> | null;
  extra: Record<string, unknown> | null;
}

@Injectable()
export class MediaMetadataService {
  constructor(private readonly repository: MediaRepository) {}

  async getMetadata(type: string, id: string): Promise<MediaMetadata | null> {
    const data = await this.repository.getMetadata(type, id);
    if (!data) return null;

    return this.enrich(data);
  }

  private enrich(data: Record<string, unknown>): MediaMetadata {
    const externalIds = (data.externalIds as Record<string, unknown> | null) ?? null;
    const stored = (data.metadata as Record<string, unknown> | null) ?? null;

    return {
      posterUrl: data.posterUrl as string | null,
      backdropUrl: data.backdropUrl as string | null,
      bannerUrl: data.bannerUrl as string | null,
      coverImage: data.coverImage as string | null,
      thumbnail: data.thumbnail as string | null,
      runtime: data.runtime as number | null,
      duration: data.duration as number | null,
      genres: (data.genres as string[]) ?? [],
      studios: (stored?.studios as string[]) ?? [],
      publishers: (stored?.publishers as string[]) ?? [],
      developers: (stored?.developers as string[]) ?? [],
      authors: (stored?.authors as string[]) ?? [],
      artists: (stored?.artists as string[]) ?? [],
      episodeCount: (stored?.episodeCount as number) ?? null,
      chapterCount: (stored?.chapterCount as number) ?? null,
      trackCount: (stored?.trackCount as number) ?? null,
      moduleCount: (stored?.moduleCount as number) ?? null,
      externalIds,
      extra: stored as Record<string, unknown> | null,
    };
  }
}
