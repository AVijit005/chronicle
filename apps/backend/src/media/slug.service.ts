import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MEDIA_MODELS = [
  'movie',
  'tvShow',
  'tvSeason',
  'tvEpisode',
  'anime',
  'animeEpisode',
  'book',
  'game',
  'musicArtist',
  'musicAlbum',
  'musicTrack',
  'podcast',
  'podcastEpisode',
  'course',
  'courseModule',
  'courseLesson',
] as const;

export type MediaType = (typeof MEDIA_MODELS)[number];

export function getMediaModels(): readonly MediaType[] {
  return MEDIA_MODELS;
}

export function isValidMediaType(value: string): value is MediaType {
  return MEDIA_MODELS.includes(value as MediaType);
}

@Injectable()
export class SlugService {
  constructor(private readonly prisma: PrismaService) {}

  generate(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 200) || 'untitled'
    );
  }

  async ensureUnique(baseSlug: string, model: MediaType): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (await this.slugExists(slug, model)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  private async slugExists(slug: string, model: MediaType): Promise<boolean> {
    const prismaAny = this.prisma as unknown as Record<
      string,
      { findUnique: (args: { where: { slug: string } }) => Promise<unknown> }
    >;
    const delegate = prismaAny[model];
    if (!delegate) {
      return false;
    }
    const existing = await delegate.findUnique({ where: { slug } });
    return existing !== null;
  }
}
