import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../core/domain';
import { EVENT_PUBLISHER, type EventPublisher } from '../core';

// ─── Domain Events ─────────────────────────────────────────────────────────────

export class RatingAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
    public readonly rating: number,
  ) {
    super(aggregateId);
  }
}

export class RatingUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
    public readonly oldRating: number,
    public readonly newRating: number,
  ) {
    super(aggregateId);
  }
}

export class ReviewCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class ReviewUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class ReviewDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class FavoriteAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class FavoriteRemovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class BookmarkAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class BookmarkRemovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class HistoryRecordedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
    public readonly eventType: string,
  ) {
    super(aggregateId);
  }
}

// ─── Event Service ─────────────────────────────────────────────────────────────

@Injectable()
export class InteractionEventService {
  private readonly logger = new Logger(InteractionEventService.name);

  constructor(@Inject(EVENT_PUBLISHER) private readonly publisher: EventPublisher) {}

  async emitRatingAdded(userId: string, libraryId: string, mediaType: string, rating: number): Promise<void> {
    await this.publisher.publish(new RatingAddedEvent(libraryId, userId, libraryId, mediaType, rating));
    this.logger.debug(`RatingAdded: user=${userId} library=${libraryId} type=${mediaType} rating=${rating}`);
  }

  async emitRatingUpdated(
    userId: string,
    libraryId: string,
    mediaType: string,
    oldRating: number,
    newRating: number,
  ): Promise<void> {
    await this.publisher.publish(new RatingUpdatedEvent(libraryId, userId, libraryId, mediaType, oldRating, newRating));
    this.logger.debug(`RatingUpdated: user=${userId} library=${libraryId} type=${mediaType} ${oldRating}→${newRating}`);
  }

  async emitReviewCreated(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ReviewCreatedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ReviewCreated: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitReviewUpdated(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ReviewUpdatedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ReviewUpdated: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitReviewDeleted(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ReviewDeletedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ReviewDeleted: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitFavoriteAdded(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new FavoriteAddedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`FavoriteAdded: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitFavoriteRemoved(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new FavoriteRemovedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`FavoriteRemoved: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitBookmarkAdded(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new BookmarkAddedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`BookmarkAdded: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitBookmarkRemoved(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new BookmarkRemovedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`BookmarkRemoved: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitHistoryRecorded(userId: string, libraryId: string, mediaType: string, eventType: string): Promise<void> {
    await this.publisher.publish(new HistoryRecordedEvent(libraryId, userId, libraryId, mediaType, eventType));
    this.logger.debug(`HistoryRecorded: user=${userId} library=${libraryId} type=${mediaType} event=${eventType}`);
  }
}
