import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../core/domain';
import { EVENT_PUBLISHER, type EventPublisher } from '../core';

export class ProgressStartedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class ProgressUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
    public readonly progress: number,
    public readonly progressPercentage: number,
  ) {
    super(aggregateId);
  }
}

export class ProgressCompletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

export class ProgressResetEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly libraryId: string,
    public readonly mediaType: string,
  ) {
    super(aggregateId);
  }
}

@Injectable()
export class ProgressEventService {
  private readonly logger = new Logger(ProgressEventService.name);

  constructor(@Inject(EVENT_PUBLISHER) private readonly publisher: EventPublisher) {}

  async emitStarted(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ProgressStartedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ProgressStarted: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitUpdated(
    userId: string,
    libraryId: string,
    mediaType: string,
    progress: number,
    progressPercentage: number,
  ): Promise<void> {
    await this.publisher.publish(
      new ProgressUpdatedEvent(libraryId, userId, libraryId, mediaType, progress, progressPercentage),
    );
  }

  async emitCompleted(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ProgressCompletedEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ProgressCompleted: user=${userId} library=${libraryId} type=${mediaType}`);
  }

  async emitReset(userId: string, libraryId: string, mediaType: string): Promise<void> {
    await this.publisher.publish(new ProgressResetEvent(libraryId, userId, libraryId, mediaType));
    this.logger.debug(`ProgressReset: user=${userId} library=${libraryId} type=${mediaType}`);
  }
}
