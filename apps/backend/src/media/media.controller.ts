import { Controller, Get, Param, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaFilterDto, MediaSearchDto, MediaSortDto, IdParamDto, TypeParamDto } from './dto';
import { MediaResponseDto } from './dto/media-response.dto';
import type { MediaListResult, SearchResult } from './media.service';
import type { MediaMetadata } from './media-metadata.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async list(@Query() filter: MediaFilterDto, @Query() sort: MediaSortDto): Promise<MediaListResult> {
    return this.mediaService.list({
      genre: filter.genre,
      language: filter.language,
      country: filter.country,
      releaseYear: filter.releaseYear,
      status: filter.status,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      cursor: filter.cursor,
      limit: filter.limit,
    });
  }

  @Get('search')
  async search(
    @Query() searchDto: MediaSearchDto,
    @Query() filter: MediaFilterDto,
    @Query() sort: MediaSortDto,
  ): Promise<SearchResult> {
    return this.mediaService.search(searchDto.search, {
      mediaType: filter.mediaType,
      genre: filter.genre,
      language: filter.language,
      country: filter.country,
      releaseYear: filter.releaseYear,
      status: filter.status,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      cursor: searchDto.cursor,
      limit: searchDto.limit,
    });
  }

  @Get('type/:type')
  async listByType(
    @Param() params: TypeParamDto,
    @Query() filter: MediaFilterDto,
    @Query() sort: MediaSortDto,
  ): Promise<MediaListResult> {
    return this.mediaService.listByType(params.type, {
      genre: filter.genre,
      language: filter.language,
      country: filter.country,
      releaseYear: filter.releaseYear,
      status: filter.status,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      cursor: filter.cursor,
      limit: filter.limit,
    });
  }

  @Get(':id')
  async findById(@Param() params: IdParamDto, @Query('type') type?: string): Promise<MediaResponseDto> {
    const mediaType = type ?? 'movie';
    return this.mediaService.findById(mediaType, params.id);
  }

  @Get(':id/related')
  async getRelated(@Param() params: IdParamDto, @Query('type') type?: string): Promise<MediaResponseDto[]> {
    const mediaType = type ?? 'movie';
    return this.mediaService.getRelated(mediaType, params.id);
  }

  @Get(':id/metadata')
  async getMetadata(@Param() params: IdParamDto, @Query('type') type?: string): Promise<MediaMetadata> {
    const mediaType = type ?? 'movie';
    return this.mediaService.getMetadata(mediaType, params.id);
  }
}
