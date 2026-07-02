import { RepositoryPort } from '../domain';

export abstract class BaseRepository<T> implements RepositoryPort<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract exists(id: string): Promise<boolean>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
