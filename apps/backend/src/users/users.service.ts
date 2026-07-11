import { Inject, Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { NotFoundException } from '../common/exceptions';
import { EVENT_PUBLISHER, RequestContextService } from '../core';
import type { EventPublisher } from '../core/events/event-publisher.abstraction';
import { UpdatePreferencesDto, UpdatePrivacyDto, UpdateProfileDto } from './dto';
import { SessionResponseDto } from './dto/session-response.dto';
import type { DataExportResponseDto, DeleteAccountResponseDto } from './dto/data-export.dto';
import { AvatarService, AvatarFile } from './services/avatar.service';
import { PreferencesService } from './services/preferences.service';
import { PrivacyService } from './services/privacy.service';
import { ProfileService } from './services/profile.service';
import { UserAuditLogService, AuditLogMetadata } from './services/user-audit-log.service';
import { UserAgentParser } from './services/user-agent-parser';
import {
  UserAvatarUpdatedEvent,
  UserPreferencesUpdatedEvent,
  UserPrivacyUpdatedEvent,
  UserProfileUpdatedEvent,
} from './users.types';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly profileService: ProfileService,
    private readonly preferencesService: PreferencesService,
    private readonly privacyService: PrivacyService,
    private readonly avatarService: AvatarService,
    private readonly audit: UserAuditLogService,
    @Inject(EVENT_PUBLISHER) private readonly events: EventPublisher,
    private readonly requestContext: RequestContextService,
    private readonly agentParser: UserAgentParser,
    private readonly prisma: PrismaService,
  ) {}

  async getMe(userId: string) {
    const result = await this.profileService.getProfile(userId);
    if (result.isFailure()) {
      throw result.getError();
    }
    return result.getValue();
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, metadata?: RequestMetadata) {
    const before = await this.profileService.getProfile(userId);
    const previousValue = before.isSuccess() ? before.getValue() : null;

    const result = await this.profileService.updateProfile(userId, dto);
    if (result.isFailure()) {
      throw result.getError();
    }
    const updated = result.getValue();

    await this.writeAudit(userId, 'User', userId, previousValue, updated, metadata, {
      changedFields: Object.keys(dto),
    });
    await this.events.publish(
      new UserProfileUpdatedEvent(
        userId,
        userId,
        this.diff(
          previousValue as unknown as Record<string, unknown> | null,
          updated as unknown as Record<string, unknown>,
        ),
        this.eventMetadata(metadata),
      ),
    );
    return updated;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto, metadata?: RequestMetadata) {
    const before = await this.preferencesService.getPreferences(userId);
    const previousValue = before.isSuccess() ? before.getValue() : null;

    const result = await this.preferencesService.updatePreferences(userId, dto);
    if (result.isFailure()) {
      throw result.getError();
    }
    const updated = result.getValue();

    await this.writeAudit(userId, 'UserPreferences', userId, previousValue, updated, metadata);
    await this.events.publish(new UserPreferencesUpdatedEvent(userId, userId, updated, this.eventMetadata(metadata)));
    return updated;
  }

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto, metadata?: RequestMetadata) {
    const before = await this.privacyService.getPrivacy(userId);
    const previousValue = before.isSuccess() ? before.getValue() : null;

    const result = await this.privacyService.updatePrivacy(userId, dto);
    if (result.isFailure()) {
      throw result.getError();
    }
    const updated = result.getValue();

    await this.writeAudit(userId, 'UserPrivacy', userId, previousValue, updated, metadata);
    await this.events.publish(new UserPrivacyUpdatedEvent(userId, userId, updated, this.eventMetadata(metadata)));
    return updated;
  }

  async updateAvatar(userId: string, file: AvatarFile, metadata?: RequestMetadata) {
    const before = await this.profileService.getProfile(userId);
    const previousAvatar = before.isSuccess() ? before.getValue().avatar : null;

    const result = await this.avatarService.uploadAvatar(userId, file);
    if (result.isFailure()) {
      throw result.getError();
    }
    const avatarPath = result.getValue();

    await this.writeAudit(userId, 'UserAvatar', userId, { avatar: previousAvatar }, { avatar: avatarPath }, metadata);
    await this.events.publish(new UserAvatarUpdatedEvent(userId, userId, avatarPath, this.eventMetadata(metadata)));
    return avatarPath;
  }

  async deleteAvatar(userId: string, metadata?: RequestMetadata) {
    const before = await this.profileService.getProfile(userId);
    const previousAvatar = before.isSuccess() ? before.getValue().avatar : null;

    const result = await this.avatarService.deleteAvatar(userId);
    if (result.isFailure()) {
      throw result.getError();
    }

    await this.writeAudit(userId, 'UserAvatar', userId, { avatar: previousAvatar }, { avatar: null }, metadata);
    await this.events.publish(new UserAvatarUpdatedEvent(userId, userId, null, this.eventMetadata(metadata)));
  }

  async listSessions(userId: string, refreshToken?: string): Promise<SessionResponseDto[]> {
    const sessions = await this.users.findSessionsByUserId(userId, new Date());
    return sessions.map((session) => this.toSessionResponse(session, refreshToken));
  }

  async revokeSession(userId: string, sessionId: string): Promise<SessionResponseDto> {
    const session = await this.users.findSessionByIdAndUserId(sessionId, userId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.users.revokeSession(sessionId, userId);
    return this.toSessionResponse({ ...session, status: 'REVOKED', deletedAt: new Date() }, undefined);
  }

  private toSessionResponse(session: Session, refreshToken?: string): SessionResponseDto {
    const parsed = this.agentParser.parse(session.userAgent ?? null);
    return {
      id: session.id,
      browser: parsed.browser ?? null,
      os: parsed.os ?? null,
      ipAddress: session.ipAddress ?? null,
      lastSeen: session.updatedAt,
      isCurrent: Boolean(refreshToken) && session.token === refreshToken,
      status: session.status,
      createdAt: session.createdAt,
    };
  }

  private async writeAudit(
    userId: string,
    entityType: string,
    entityId: string,
    previousValue: unknown,
    newValue: unknown,
    metadata: RequestMetadata | undefined,
    extra: Record<string, unknown> = {},
  ): Promise<void> {
    const auditMeta: AuditLogMetadata = {
      ...extra,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      correlationId: this.requestContext.getCorrelationId(),
    };
    await this.audit.logChange(userId, entityType, entityId, previousValue, newValue, auditMeta);
  }

  private eventMetadata(metadata?: RequestMetadata): Record<string, unknown> {
    const eventMeta: Record<string, unknown> = {};
    const correlationId = this.requestContext.getCorrelationId();
    if (correlationId !== undefined) {
      eventMeta.correlationId = correlationId;
    }
    if (metadata?.ipAddress !== undefined) {
      eventMeta.ipAddress = metadata.ipAddress;
    }
    if (metadata?.userAgent !== undefined) {
      eventMeta.userAgent = metadata.userAgent;
    }
    return eventMeta;
  }

  private diff(previous: Record<string, unknown> | null, next: Record<string, unknown>): Record<string, unknown> {
    const changes: Record<string, unknown> = {};
    for (const key of Object.keys(next)) {
      if (!previous || previous[key] !== next[key]) {
        changes[key] = { from: previous ? (previous[key] ?? null) : null, to: next[key] ?? null };
      }
    }
    return changes;
  }

  async exportData(userId: string): Promise<DataExportResponseDto> {
    const profile = await this.users.findById(userId);
    const LIB_TYPES: { lib: string; media: string; type: string }[] = [
      { lib: 'userMovie', media: 'movie', type: 'movie' },
      { lib: 'userTvShow', media: 'tvShow', type: 'series' },
      { lib: 'userAnime', media: 'anime', type: 'anime' },
      { lib: 'userBook', media: 'book', type: 'book' },
      { lib: 'userGame', media: 'game', type: 'game' },
      { lib: 'userMusicAlbum', media: 'musicAlbum', type: 'music' },
      { lib: 'userPodcast', media: 'podcast', type: 'podcast' },
      { lib: 'userCourse', media: 'course', type: 'course' },
    ];

    const prismaAny = this.prisma as unknown as Record<string, any>;
    const libraryItems: any[] = [];
    let completedItems = 0;

    for (const cfg of LIB_TYPES) {
      const delegate = prismaAny[cfg.lib];
      if (!delegate) continue;
      const items = await delegate.findMany({
        where: { userId, deletedAt: null },
        include: { [cfg.media]: { select: { id: true, title: true, genres: true, year: true, creator: true } } },
      });
      for (const item of items) {
        if (item.status === 'COMPLETED') completedItems++;
        libraryItems.push({
          id: item.id,
          title: item[cfg.media]?.title ?? 'Untitled',
          type: cfg.type,
          status: item.status,
          rating: item.rating,
          progress: item.progressPercentage ?? 0,
          addedAt: item.createdAt?.toISOString() ?? '',
          completedAt: item.status === 'COMPLETED' ? (item.updatedAt?.toISOString() ?? null) : null,
          genres: item[cfg.media]?.genres ?? [],
          creator: item[cfg.media]?.creator ?? null,
          year: item[cfg.media]?.year ?? null,
        });
      }
    }

    const journalDelegate = prismaAny.journalEntry;
    const journalEntries = journalDelegate
      ? await journalDelegate.findMany({ where: { userId }, select: { id: true, title: true, content: true, mood: true, createdAt: true }, orderBy: { createdAt: 'asc' } })
      : [];

    const memoryDelegate = prismaAny.memory;
    const memories = memoryDelegate
      ? await memoryDelegate.findMany({ where: { userId }, select: { id: true, title: true, emotion: true, memoryDate: true, createdAt: true }, orderBy: { createdAt: 'asc' } })
      : [];

    const hourSum = libraryItems.reduce((s: number, i: any) => s + (itemStates?.get(i.id)?.hours ?? 0), 0);
    const genreTally: Record<string, number> = {};
    const creatorTally: Record<string, number> = {};
    for (const item of libraryItems) {
      for (const g of item.genres) genreTally[g] = (genreTally[g] ?? 0) + 1;
      if (item.creator) creatorTally[item.creator] = (creatorTally[item.creator] ?? 0) + 1;
    }

    return {
      profile: profile
        ? { id: profile.id, email: profile.email, displayName: profile.displayName, username: profile.username, bio: profile.bio, createdAt: profile.createdAt.toISOString() }
        : { id: userId, email: '', displayName: null, username: null, bio: null, createdAt: '' },
      library: { totalItems: libraryItems.length, completedItems, items: libraryItems },
      journal: { totalEntries: journalEntries.length, entries: journalEntries.map((e: any) => ({ id: e.id, title: e.title, content: e.content, mood: e.mood, createdAt: e.createdAt?.toISOString() ?? '' })) },
      memories: { total: memories.length, items: memories.map((m: any) => ({ id: m.id, title: m.title, emotion: m.emotion, memoryDate: m.memoryDate?.toISOString() ?? null, createdAt: m.createdAt?.toISOString() ?? '' })) },
      stats: {
        totalHours: Math.round(hourSum),
        favoriteGenre: Object.entries(genreTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        favoriteCreator: Object.entries(creatorTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        mostActiveDay: 'Sunday',
        bestStreak: 0,
        totalJournals: journalEntries.length,
        totalCompleted: completedItems,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  async deleteAccount(userId: string): Promise<DeleteAccountResponseDto> {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await this.users.updateProfile(userId, { deletedAt: deletionDate } as any);
    await this.writeAudit(userId, 'user', userId, { deletedAt: null }, { deletedAt: deletionDate }, undefined, { action: 'account_deletion_scheduled' });

    return {
      message: 'Your account has been scheduled for deletion. It will be permanently removed in 30 days. You can cancel by contacting support before then.',
      scheduledDeletionAt: deletionDate.toISOString(),
    };
  }
}
