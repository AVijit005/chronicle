import { Injectable, NotFoundException } from '@nestjs/common';
import { buildCursorMeta } from '../common';
import { MediaRepository, type FindManyParams, type MediaRow } from './media.repository';
import { MediaMetadataService, type MediaMetadata } from './media-metadata.service';
import { SlugService, isValidMediaType } from './slug.service';
import { MediaResponseDto } from './dto/media-response.dto';

export interface MediaListResult {
  data: MediaResponseDto[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface SearchResult {
  data: MediaResponseDto[];
  hasMore: boolean;
  nextCursor?: string;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly repository: MediaRepository,
    private readonly metadataService: MediaMetadataService,
    private readonly slugService: SlugService,
  ) {}

  async list(params: FindManyParams): Promise<MediaListResult> {
    const limit = params.limit || 20;
    const items = await this.repository.findMany(undefined, { ...params, limit: limit + 1 });

    const meta = buildCursorMeta(items, (item) => item.id, limit);
    return {
      data: meta.data.map((item) => this.toResponse(item, params.mediaType ?? 'movie')),
      hasMore: meta.hasMore,
      nextCursor: meta.nextCursor,
    };
  }

  async listByType(type: string, params: FindManyParams): Promise<MediaListResult> {
    if (!isValidMediaType(type)) throw new NotFoundException(`Invalid media type: ${type}`);

    const limit = params.limit || 20;
    const items = await this.repository.findMany(type, { ...params, limit: limit + 1 });

    const meta = buildCursorMeta(items, (item) => item.id, limit);
    return {
      data: meta.data.map((item) => this.toResponse(item, type)),
      hasMore: meta.hasMore,
      nextCursor: meta.nextCursor,
    };
  }

  async search(query: string, params: FindManyParams): Promise<SearchResult> {
    const limit = params.limit || 20;
    const searchParams: FindManyParams = {
      ...params,
      search: query,
      limit: limit + 1,
    };

    const type = params.mediaType && isValidMediaType(params.mediaType) ? params.mediaType : undefined;
    const items = await this.repository.findMany(type, searchParams);

    const meta = buildCursorMeta(items, (item) => item.id, limit);
    return {
      data: meta.data.map((item) => this.toResponse(item, params.mediaType ?? type ?? 'movie')),
      hasMore: meta.hasMore,
      nextCursor: meta.nextCursor,
    };
  }

  async findById(type: string, id: string): Promise<MediaResponseDto> {
    if (!isValidMediaType(type)) throw new NotFoundException(`Invalid media type: ${type}`);

    const item = await this.repository.findById(type, id);
    if (!item) throw new NotFoundException(`${type} not found`);

    return this.toResponse(item, type);
  }

  async findBySlug(type: string, slug: string): Promise<MediaResponseDto> {
    if (!isValidMediaType(type)) throw new NotFoundException(`Invalid media type: ${type}`);

    const item = await this.repository.findBySlug(type, slug);
    if (!item) throw new NotFoundException(`${type} not found`);

    return this.toResponse(item, type);
  }

  async getRelated(type: string, id: string): Promise<MediaResponseDto[]> {
    if (!isValidMediaType(type)) throw new NotFoundException(`Invalid media type: ${type}`);

    const items = await this.repository.findRelated(type, id);
    return items.map((item) => this.toResponse(item, type));
  }

  async getMetadata(type: string, id: string): Promise<MediaMetadata> {
    if (!isValidMediaType(type)) throw new NotFoundException(`Invalid media type: ${type}`);

    const metadata = await this.metadataService.getMetadata(type, id);
    if (!metadata) throw new NotFoundException(`${type} not found`);

    return metadata;
  }

  private toResponse(row: MediaRow, mediaType: string): MediaResponseDto {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      originalTitle: row.originalTitle,
      description: row.description,
      overview: row.overview,
      posterUrl: row.posterUrl,
      backdropUrl: row.backdropUrl,
      bannerUrl: row.bannerUrl,
      coverImage: row.coverImage,
      thumbnail: row.thumbnail,
      releaseDate: row.releaseDate?.toISOString() ?? null,
      releaseYear: row.releaseYear,
      runtime: row.runtime,
      duration: row.duration,
      language: row.language,
      country: row.country,
      genres: row.genres ?? [],
      tags: row.tags ?? [],
      externalIds: row.externalIds as Record<string, unknown> | null,
      metadata: row.metadata as Record<string, unknown> | null,
      status: row.status,
      mediaType,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
