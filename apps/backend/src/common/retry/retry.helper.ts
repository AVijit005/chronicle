import { RetryPolicy, DEFAULT_RETRY_POLICY } from './retry.policy';

export async function retry<T>(fn: () => Promise<T>, policy: RetryPolicy = DEFAULT_RETRY_POLICY): Promise<T> {
  let lastError: unknown;
  let delay = policy.delayMs;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const shouldRetry = policy.retryable?.(error) ?? true;
      if (!shouldRetry || attempt === policy.maxAttempts) {
        throw error;
      }
      await sleep(delay);
      delay = calculateNextDelay(delay, policy);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateNextDelay(currentDelay: number, policy: RetryPolicy): number {
  if (!policy.backoffMultiplier) return currentDelay;
  const next = currentDelay * policy.backoffMultiplier;
  return policy.maxDelayMs ? Math.min(next, policy.maxDelayMs) : next;
}
