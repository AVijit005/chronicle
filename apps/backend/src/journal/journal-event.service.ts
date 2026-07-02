import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../core/domain';
import { EVENT_PUBLISHER, type EventPublisher } from '../core';

export class JournalEntryCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly entryId: string,
  ) {
    super(aggregateId);
  }
}
export class JournalEntryUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly entryId: string,
  ) {
    super(aggregateId);
  }
}
export class JournalEntryDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly entryId: string,
  ) {
    super(aggregateId);
  }
}
export class MemoryCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly memoryId: string,
  ) {
    super(aggregateId);
  }
}
export class MemoryUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly memoryId: string,
  ) {
    super(aggregateId);
  }
}
export class MemoryDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly memoryId: string,
  ) {
    super(aggregateId);
  }
}
export class QuoteCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly quoteId: string,
  ) {
    super(aggregateId);
  }
}
export class QuoteUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly quoteId: string,
  ) {
    super(aggregateId);
  }
}
export class QuoteDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly quoteId: string,
  ) {
    super(aggregateId);
  }
}
export class HighlightCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly highlightId: string,
  ) {
    super(aggregateId);
  }
}
export class HighlightUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly highlightId: string,
  ) {
    super(aggregateId);
  }
}
export class HighlightDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly highlightId: string,
  ) {
    super(aggregateId);
  }
}

@Injectable()
export class JournalEventService {
  private readonly logger = new Logger(JournalEventService.name);
  constructor(@Inject(EVENT_PUBLISHER) private readonly publisher: EventPublisher) {}

  async emitJournalCreated(userId: string, entryId: string): Promise<void> {
    await this.publisher.publish(new JournalEntryCreatedEvent(entryId, userId, entryId));
    this.logger.debug(`JournalCreated: user=${userId} entry=${entryId}`);
  }
  async emitJournalUpdated(userId: string, entryId: string): Promise<void> {
    await this.publisher.publish(new JournalEntryUpdatedEvent(entryId, userId, entryId));
  }
  async emitJournalDeleted(userId: string, entryId: string): Promise<void> {
    await this.publisher.publish(new JournalEntryDeletedEvent(entryId, userId, entryId));
  }
  async emitMemoryCreated(userId: string, memoryId: string): Promise<void> {
    await this.publisher.publish(new MemoryCreatedEvent(memoryId, userId, memoryId));
    this.logger.debug(`MemoryCreated: user=${userId} memory=${memoryId}`);
  }
  async emitMemoryUpdated(userId: string, memoryId: string): Promise<void> {
    await this.publisher.publish(new MemoryUpdatedEvent(memoryId, userId, memoryId));
  }
  async emitMemoryDeleted(userId: string, memoryId: string): Promise<void> {
    await this.publisher.publish(new MemoryDeletedEvent(memoryId, userId, memoryId));
  }
  async emitQuoteCreated(userId: string, quoteId: string): Promise<void> {
    await this.publisher.publish(new QuoteCreatedEvent(quoteId, userId, quoteId));
  }
  async emitQuoteUpdated(userId: string, quoteId: string): Promise<void> {
    await this.publisher.publish(new QuoteUpdatedEvent(quoteId, userId, quoteId));
  }
  async emitQuoteDeleted(userId: string, quoteId: string): Promise<void> {
    await this.publisher.publish(new QuoteDeletedEvent(quoteId, userId, quoteId));
  }
  async emitHighlightCreated(userId: string, highlightId: string): Promise<void> {
    await this.publisher.publish(new HighlightCreatedEvent(highlightId, userId, highlightId));
  }
  async emitHighlightUpdated(userId: string, highlightId: string): Promise<void> {
    await this.publisher.publish(new HighlightUpdatedEvent(highlightId, userId, highlightId));
  }
  async emitHighlightDeleted(userId: string, highlightId: string): Promise<void> {
    await this.publisher.publish(new HighlightDeletedEvent(highlightId, userId, highlightId));
  }
}
