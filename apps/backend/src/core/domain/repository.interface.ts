export interface RepositoryPort<T> {
  findById(id: string): Promise<T | null>;
  exists(id: string): Promise<boolean>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
