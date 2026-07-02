import { describe, it, expect } from 'bun:test';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('hashes a password with argon2id', async () => {
    const hash = await service.hash('StrongP@ssw0rd123');
    expect(hash.length).toBeGreaterThan(0);
    expect(hash).toContain('$argon2id$');
  });

  it('returns true for matching password', async () => {
    const hash = await service.hash('StrongP@ssw0rd123');
    const valid = await service.compare('StrongP@ssw0rd123', hash);
    expect(valid).toBe(true);
  });

  it('returns false for non-matching password', async () => {
    const hash = await service.hash('StrongP@ssw0rd123');
    const valid = await service.compare('WrongPassword!', hash);
    expect(valid).toBe(false);
  });
});
