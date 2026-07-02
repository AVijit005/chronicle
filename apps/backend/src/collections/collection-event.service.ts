import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../core/domain';
import { EVENT_PUBLISHER, type EventPublisher } from '../core';

export class CollectionCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class CollectionUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class CollectionDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class CollectionItemAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class CollectionItemRemovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class CollectionReorderedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly collectionId: string,
  ) {
    super(aggregateId);
  }
}
export class ShelfCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly shelfId: string,
  ) {
    super(aggregateId);
  }
}
export class ShelfUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly shelfId: string,
  ) {
    super(aggregateId);
  }
}
export class ShelfDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly shelfId: string,
  ) {
    super(aggregateId);
  }
}

@Injectable()
export class CollectionEventService {
  private readonly logger = new Logger(CollectionEventService.name);

  constructor(@Inject(EVENT_PUBLISHER) private readonly publisher: EventPublisher) {}

  async emitCollectionCreated(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionCreatedEvent(collectionId, userId, collectionId));
    this.logger.debug(`CollectionCreated: user=${userId} collection=${collectionId}`);
  }
  async emitCollectionUpdated(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionUpdatedEvent(collectionId, userId, collectionId));
  }
  async emitCollectionDeleted(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionDeletedEvent(collectionId, userId, collectionId));
  }
  async emitItemAdded(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionItemAddedEvent(collectionId, userId, collectionId));
  }
  async emitItemRemoved(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionItemRemovedEvent(collectionId, userId, collectionId));
  }
  async emitReordered(userId: string, collectionId: string): Promise<void> {
    await this.publisher.publish(new CollectionReorderedEvent(collectionId, userId, collectionId));
  }
  async emitShelfCreated(userId: string, shelfId: string): Promise<void> {
    await this.publisher.publish(new ShelfCreatedEvent(shelfId, userId, shelfId));
  }
  async emitShelfUpdated(userId: string, shelfId: string): Promise<void> {
    await this.publisher.publish(new ShelfUpdatedEvent(shelfId, userId, shelfId));
  }
  async emitShelfDeleted(userId: string, shelfId: string): Promise<void> {
    await this.publisher.publish(new ShelfDeletedEvent(shelfId, userId, shelfId));
  }
}
