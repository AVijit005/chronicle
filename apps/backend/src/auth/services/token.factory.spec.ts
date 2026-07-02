import { describe, it, expect } from 'bun:test';
import { TokenFactory } from './token.factory';

describe('TokenFactory', () => {
  const factory = new TokenFactory();

  it('generates a non-empty token', () => {
    const token = factory.generateSecureToken();
    expect(token.length).toBeGreaterThan(0);
  });

  it('generates unique tokens', () => {
    const a = factory.generateSecureToken();
    const b = factory.generateSecureToken();
    expect(a).not.toBe(b);
  });

  it('respects custom length', () => {
    const token = factory.generateSecureToken(64);
    expect(token.length).toBeGreaterThanOrEqual(64);
  });
});
