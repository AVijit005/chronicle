export interface IdempotencyService {
  checkOrStore(key: string, payloadHash: string): Promise<boolean>;
  markCompleted(key: string): Promise<void>;
}
