import { describe, it, expect } from 'bun:test';
import { DomainEvent } from '../domain';
import { InMemoryEventPublisher } from './in-memory-event-publisher.service';

class SampleEvent extends DomainEvent {
  constructor(public readonly value: string) {
    super('aggregate-1');
  }
}

class OtherEvent extends DomainEvent {
  constructor() {
    super('aggregate-2');
  }
}

describe('InMemoryEventPublisher', () => {
  it('stores published events', async () => {
    const publisher = new InMemoryEventPublisher();
    await publisher.publish(new SampleEvent('first'));
    await publisher.publish(new SampleEvent('second'));

    const events = publisher.publishedEvents();
    expect(events.length).toBe(2);
    expect(events[0]).toBeInstanceOf(SampleEvent);
    expect((events[0] as SampleEvent).value).toBe('first');
    expect((events[1] as SampleEvent).value).toBe('second');
  });

  it('publishAll stores every event in order', async () => {
    const publisher = new InMemoryEventPublisher();
    await publisher.publishAll([new SampleEvent('a'), new OtherEvent(), new SampleEvent('b')]);

    const events = publisher.publishedEvents();
    expect(events.map((e) => e.constructor.name)).toEqual(['SampleEvent', 'OtherEvent', 'SampleEvent']);
    expect(events.map((e) => e.aggregateId)).toEqual(['aggregate-1', 'aggregate-2', 'aggregate-1']);
  });

  it('returns an empty array initially', () => {
    const publisher = new InMemoryEventPublisher();
    expect(publisher.publishedEvents().length).toBe(0);
  });

  it('clear() removes all stored events', async () => {
    const publisher = new InMemoryEventPublisher();
    await publisher.publish(new SampleEvent('x'));
    expect(publisher.publishedEvents().length).toBe(1);
    publisher.clear();
    expect(publisher.publishedEvents().length).toBe(0);
  });

  it('publishedEvents() returns a defensive copy', async () => {
    const publisher = new InMemoryEventPublisher();
    await publisher.publish(new SampleEvent('immutable'));
    const snapshot = publisher.publishedEvents();
    await publisher.publish(new SampleEvent('second'));
    expect(snapshot.length).toBe(1);
    expect(publisher.publishedEvents().length).toBe(2);
  });

  it('captures occurredAt on each event', async () => {
    const publisher = new InMemoryEventPublisher();
    const before = new Date();
    await publisher.publish(new SampleEvent('time'));
    const after = new Date();
    const event = publisher.publishedEvents()[0];
    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
