import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { CollectionsService } from './collections.service';
import {
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
} from './dto';

@ApiTags('Collections')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  // ─── Collections ────────────────────────────────────────────────────────────

  @Post('collections')
  @ApiOperation({ summary: 'Create a collection' })
  async create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateCollectionDto,
  ): Promise<CollectionResponseDto> {
    return this.collectionsService.create(user.sub, dto);
  }

  @Get('collections')
  @ApiOperation({ summary: 'List all collections' })
  async findAll(@CurrentUser() user: AccessTokenPayload): Promise<CollectionResponseDto[]> {
    return this.collectionsService.findAll(user.sub);
  }

  @Get('collections/:id')
  @ApiOperation({ summary: 'Get a collection with items' })
  async findOne(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string): Promise<CollectionResponseDto> {
    return this.collectionsService.findOne(id, user.sub);
  }

  @Patch('collections/:id')
  @ApiOperation({ summary: 'Update a collection' })
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ): Promise<CollectionResponseDto> {
    return this.collectionsService.update(id, user.sub, dto);
  }

  @Delete('collections/:id')
  @ApiOperation({ summary: 'Delete a collection' })
  async remove(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string): Promise<void> {
    return this.collectionsService.remove(id, user.sub);
  }

  // ─── Collection Items ────────────────────────────────────────────────────────

  @Post('collections/:id/items')
  @ApiOperation({ summary: 'Add an item to a collection' })
  async addItem(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: AddCollectionItemDto,
  ): Promise<CollectionItemResponseDto> {
    return this.collectionsService.addItem(id, user.sub, dto);
  }

  @Delete('collections/:id/items/:itemId')
  @ApiOperation({ summary: 'Remove an item from a collection' })
  async removeItem(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.collectionsService.removeItem(id, itemId, user.sub);
  }

  @Patch('collections/:id/items/reorder')
  @ApiOperation({ summary: 'Reorder items in a collection' })
  async reorderItems(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: ReorderItemsDto,
  ): Promise<void> {
    return this.collectionsService.reorderItems(id, user.sub, dto);
  }

  // ─── Statistics ──────────────────────────────────────────────────────────────

  @Get('collections/:id/stats')
  @ApiOperation({ summary: 'Get collection statistics' })
  async getStats(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string): Promise<CollectionStatsDto> {
    return this.collectionsService.getStatistics(id, user.sub);
  }

  // ─── Shelves ─────────────────────────────────────────────────────────────────

  @Post('shelves')
  @ApiOperation({ summary: 'Create a shelf' })
  async createShelf(@CurrentUser() user: AccessTokenPayload, @Body() dto: CreateShelfDto): Promise<ShelfResponseDto> {
    return this.collectionsService.createShelf(user.sub, dto);
  }

  @Get('shelves')
  @ApiOperation({ summary: 'List all shelves' })
  async findAllShelves(@CurrentUser() user: AccessTokenPayload): Promise<ShelfResponseDto[]> {
    return this.collectionsService.findAllShelves(user.sub);
  }

  @Get('shelves/:id')
  @ApiOperation({ summary: 'Get a shelf with items' })
  async findOneShelf(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string): Promise<ShelfResponseDto> {
    return this.collectionsService.findOneShelf(id, user.sub);
  }

  @Patch('shelves/:id')
  @ApiOperation({ summary: 'Update a shelf' })
  async updateShelf(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: UpdateShelfDto,
  ): Promise<ShelfResponseDto> {
    return this.collectionsService.updateShelf(id, user.sub, dto);
  }

  @Delete('shelves/:id')
  @ApiOperation({ summary: 'Delete a shelf' })
  async removeShelf(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string): Promise<void> {
    return this.collectionsService.removeShelf(id, user.sub);
  }
}
