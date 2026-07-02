/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CollectionsRepository } from './collections.repository';
import { SmartCollectionService } from './smart-collection.service';
import { CollectionStatisticsService } from './collection-statistics.service';
import { CollectionEventService } from './collection-event.service';
import type {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddCollectionItemDto,
  ReorderItemsDto,
  CreateShelfDto,
  UpdateShelfDto,
  CollectionResponseDto,
  CollectionItemResponseDto,
  ShelfResponseDto,
  CollectionStatsDto,
  SmartCollectionConfigDto,
} from './dto';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly repository: CollectionsRepository,
    private readonly smartCollection: SmartCollectionService,
    private readonly statsService: CollectionStatisticsService,
    private readonly events: CollectionEventService,
  ) {}

  // ─── Collections ─────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateCollectionDto): Promise<CollectionResponseDto> {
    const slug = this.generateSlug(dto.name);
    const exists = await this.repository.collectionExists(userId, slug);
    if (exists) throw new ConflictException('A collection with this name already exists');

    const metadata = dto.isSmartCollection && dto.smartRules ? { smartRules: dto.smartRules } : undefined;

    const collection = await this.repository.createCollection({
      userId,
      name: dto.name,
      description: dto.description,
      visibility: dto.visibility,
      isPinned: dto.isPinned,
      isSmartCollection: dto.isSmartCollection,
      icon: dto.icon,
      color: dto.color,
    });

    // Store smart rules in metadata if smart collection
    if (metadata) {
      await this.repository.updateCollection(collection.id, userId, { metadata });
      collection.metadata = metadata;
    }

    await this.events.emitCollectionCreated(userId, collection.id);
    return this.toCollectionResponse(collection, 0);
  }

  async findAll(userId: string): Promise<CollectionResponseDto[]> {
    const collections = await this.repository.findCollectionsByUserId(userId);
    return Promise.all(
      collections.map(async (c: any) => {
        const count = c._count?.items ?? 0;
        return this.toCollectionResponse(c, count);
      }),
    );
  }

  async findOne(id: string, userId: string): Promise<CollectionResponseDto> {
    const collection = await this.repository.findCollectionById(id, userId);
    if (!collection) throw new NotFoundException('Collection not found');

    if (collection.isSmartCollection) {
      // Smart collection: evaluate rules on read
      const metadata = (collection.metadata ?? {}) as Record<string, any>;
      const rules = metadata.smartRules as SmartCollectionConfigDto | undefined;
      if (rules) {
        const resolvedItems = await this.smartCollection.evaluate(userId, rules);
        return this.toCollectionResponse(collection, resolvedItems.length, resolvedItems);
      }
    }

    const items = this.mapItems(collection.items ?? []);
    return this.toCollectionResponse(collection, items.length, items);
  }

  async update(id: string, userId: string, dto: UpdateCollectionDto): Promise<CollectionResponseDto> {
    if (dto.name) {
      const slug = this.generateSlug(dto.name);
      const exists = await this.repository.collectionExists(userId, slug);
      // Allow same-name but reject rename-to-existing
      if (exists) {
        const existing = await this.repository.findCollectionById(id, userId);
        if (existing && existing.slug !== slug) {
          throw new ConflictException('A collection with this name already exists');
        }
      }
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.visibility !== undefined) updateData.visibility = dto.visibility;
    if (dto.isPinned !== undefined) updateData.isPinned = dto.isPinned;
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.color !== undefined) updateData.color = dto.color;

    // Handle smart rules update
    if (dto.smartRules !== undefined) {
      updateData.metadata = { smartRules: dto.smartRules };
    }

    const updated = await this.repository.updateCollection(id, userId, updateData);
    if (!updated) throw new NotFoundException('Collection not found');

    await this.events.emitCollectionUpdated(userId, id);
    const count = await this.getItemCount(id);
    return this.toCollectionResponse(updated, count);
  }

  async remove(id: string, userId: string): Promise<void> {
    const ok = await this.repository.softDeleteCollection(id, userId);
    if (!ok) throw new NotFoundException('Collection not found');
    await this.events.emitCollectionDeleted(userId, id);
  }

  // ─── Collection Items ────────────────────────────────────────────────────

  async addItem(id: string, userId: string, dto: AddCollectionItemDto): Promise<CollectionItemResponseDto> {
    const collection = await this.repository.findCollectionById(id, userId);
    if (!collection) throw new NotFoundException('Collection not found');
    if (collection.isSmartCollection) throw new ConflictException('Cannot add items to a smart collection');

    const item = await this.repository.addItem(id, userId, dto.mediaType, dto.mediaId, dto.note);
    if (!item) throw new ConflictException('Item already exists in this collection');

    await this.events.emitItemAdded(userId, id);
    return this.toItemResponse(item, dto.mediaType);
  }

  async removeItem(id: string, itemId: string, userId: string): Promise<void> {
    const ok = await this.repository.removeItem(itemId, id, userId);
    if (!ok) throw new NotFoundException('Item not found');
    await this.events.emitItemRemoved(userId, id);
  }

  async reorderItems(id: string, userId: string, dto: ReorderItemsDto): Promise<void> {
    const collection = await this.repository.findCollectionById(id, userId);
    if (!collection) throw new NotFoundException('Collection not found');

    const ok = await this.repository.reorderItems(id, userId, dto.itemIds);
    if (!ok) throw new NotFoundException('Collection not found');
    await this.events.emitReordered(userId, id);
  }

  // ─── Statistics ──────────────────────────────────────────────────────────

  async getStatistics(id: string, userId: string): Promise<CollectionStatsDto> {
    const collection = await this.repository.findCollectionById(id, userId);
    if (!collection) throw new NotFoundException('Collection not found');

    return this.statsService.getCollectionStats(userId, id);
  }

  // ─── Shelves ─────────────────────────────────────────────────────────────

  async createShelf(userId: string, dto: CreateShelfDto): Promise<ShelfResponseDto> {
    const slug = this.generateSlug(dto.title);
    const exists = await this.repository.shelfExists(userId, slug);
    if (exists) throw new ConflictException('A shelf with this name already exists');

    const shelf = await this.repository.createShelf({
      userId,
      title: dto.title,
      description: dto.description,
      visibility: dto.visibility,
      isPinned: dto.isPinned,
      icon: dto.icon,
      color: dto.color,
    });

    await this.events.emitShelfCreated(userId, shelf.id);
    return this.toShelfResponse(shelf);
  }

  async findAllShelves(userId: string): Promise<ShelfResponseDto[]> {
    const shelves = await this.repository.findShelvesByUserId(userId);
    return shelves.map((s: any) => this.toShelfResponse(s));
  }

  async findOneShelf(id: string, userId: string): Promise<ShelfResponseDto> {
    const shelf = await this.repository.findShelfById(id, userId);
    if (!shelf) throw new NotFoundException('Shelf not found');

    const items = this.mapItems(shelf.items ?? []);
    return this.toShelfResponse(shelf, items);
  }

  async updateShelf(id: string, userId: string, dto: UpdateShelfDto): Promise<ShelfResponseDto> {
    if (dto.title) {
      const slug = this.generateSlug(dto.title);
      const exists = await this.repository.shelfExists(userId, slug);
      if (exists) {
        const existing = await this.repository.findShelfById(id, userId);
        if (existing && existing.slug !== slug) {
          throw new ConflictException('A shelf with this name already exists');
        }
      }
    }

    const updateData: Record<string, any> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.visibility !== undefined) updateData.visibility = dto.visibility;
    if (dto.isPinned !== undefined) updateData.isPinned = dto.isPinned;
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.color !== undefined) updateData.color = dto.color;

    const updated = await this.repository.updateShelf(id, userId, updateData);
    if (!updated) throw new NotFoundException('Shelf not found');

    await this.events.emitShelfUpdated(userId, id);
    return this.toShelfResponse(updated);
  }

  async removeShelf(id: string, userId: string): Promise<void> {
    const ok = await this.repository.softDeleteShelf(id, userId);
    if (!ok) throw new NotFoundException('Shelf not found');
    await this.events.emitShelfDeleted(userId, id);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async getItemCount(collectionId: string): Promise<number> {
    const prisma: any = (this.repository as any).prisma;
    return prisma?.collectionItem?.count?.({ where: { collectionId } }) ?? 0;
  }

  private mapItems(items: any[]): CollectionItemResponseDto[] {
    return items.map((item: any) => {
      const mediaType = this.resolveMediaType(item);
      return this.toItemResponse(item, mediaType);
    });
  }

  private resolveMediaType(item: any): string {
    if (item.movie) return 'movie';
    if (item.tvShow) return 'tvShow';
    if (item.anime) return 'anime';
    if (item.book) return 'book';
    if (item.game) return 'game';
    if (item.musicAlbum) return 'musicAlbum';
    if (item.podcast) return 'podcast';
    if (item.course) return 'course';

    if (item.movieId) return 'movie';
    if (item.tvShowId) return 'tvShow';
    if (item.animeId) return 'anime';
    if (item.bookId) return 'book';
    if (item.gameId) return 'game';
    if (item.musicAlbumId) return 'musicAlbum';
    if (item.podcastId) return 'podcast';
    if (item.courseId) return 'course';
    return 'unknown';
  }

  private toItemResponse(item: any, mediaType: string): CollectionItemResponseDto {
    const media = item[mediaType] ?? {};
    return {
      id: item.id,
      position: item.position ?? 0,
      note: item.note ?? null,
      addedAt: item.addedAt?.toISOString() ?? new Date().toISOString(),
      mediaId: media?.id ?? item[`${mediaType}Id`] ?? item.id,
      mediaType,
      title: media?.title ?? 'Unknown',
      slug: media?.slug ?? '',
      posterUrl: media?.posterUrl ?? null,
    };
  }

  private toCollectionResponse(
    collection: any,
    itemCount: number,
    items?: CollectionItemResponseDto[],
  ): CollectionResponseDto {
    return {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description ?? null,
      visibility: collection.visibility,
      sortOrder: collection.sortOrder ?? 0,
      isPinned: collection.isPinned ?? false,
      isSmartCollection: collection.isSmartCollection ?? false,
      icon: collection.icon ?? null,
      color: collection.color ?? null,
      itemCount,
      items,
      createdAt: collection.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: collection.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  private toShelfResponse(shelf: any, items?: CollectionItemResponseDto[]): ShelfResponseDto {
    return {
      id: shelf.id,
      title: shelf.title,
      slug: shelf.slug,
      description: shelf.description ?? null,
      visibility: shelf.visibility,
      sortOrder: shelf.sortOrder ?? 0,
      isPinned: shelf.isPinned ?? false,
      icon: shelf.icon ?? null,
      color: shelf.color ?? null,
      items,
      createdAt: shelf.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: shelf.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200) || 'untitled'
    );
  }
}
