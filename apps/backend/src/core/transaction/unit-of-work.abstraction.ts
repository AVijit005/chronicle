import { DomainEvent } from '../domain';

export interface UnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  addDomainEvents(events: DomainEvent[]): void;
}
