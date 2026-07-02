import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../domain';
import { EventPublisher } from './event-publisher.abstraction';

@Injectable()
export class InMemoryEventPublisher implements EventPublisher {
  private readonly logger = new Logger(InMemoryEventPublisher.name);
  private readonly events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
    this.logger.debug(`Published ${event.constructor.name} for aggregate ${event.aggregateId}`);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  publishedEvents(): readonly DomainEvent[] {
    return this.events.slice();
  }

  clear(): void {
    this.events.length = 0;
  }
}
