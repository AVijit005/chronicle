export interface RetryPolicy {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  retryable?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  delayMs: 100,
  backoffMultiplier: 2,
  maxDelayMs: 5000,
  retryable: () => true,
};

export const NO_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 1,
  delayMs: 0,
};
