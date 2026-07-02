import { DomainEvent } from './domain-event.base';

export abstract class AggregateRoot<T extends { id: string }> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(protected readonly props: T) {}

  get id(): string {
    return this.props.id;
  }

  public addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }

  public equals(other: AggregateRoot<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.props.id === other.props.id;
  }

  public getProps(): T {
    return this.props;
  }
}
