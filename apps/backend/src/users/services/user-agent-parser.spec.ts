import 'reflect-metadata';
import { describe, it, expect } from 'bun:test';
import { UserAgentParser } from './user-agent-parser';

describe('UserAgentParser', () => {
  const parser = new UserAgentParser();

  it('returns empty object for null and undefined input', () => {
    expect(parser.parse(null)).toEqual({});
    expect(parser.parse(undefined)).toEqual({});
    expect(parser.parse('')).toEqual({});
  });

  it('detects Chrome on Windows', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
    expect(parser.parse(ua)).toEqual({ browser: 'Chrome', os: 'Windows' });
  });

  it('detects Firefox on macOS', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:115.0) Gecko/20100101 Firefox/115.0';
    expect(parser.parse(ua)).toEqual({ browser: 'Firefox', os: 'macOS' });
  });

  it('detects Safari on iOS', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
    expect(parser.parse(ua)).toEqual({ browser: 'Safari', os: 'iOS' });
  });

  it('detects Chrome on Android', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36';
    expect(parser.parse(ua)).toEqual({ browser: 'Chrome', os: 'Android' });
  });

  it('detects Edge on Windows', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.83';
    expect(parser.parse(ua).browser).toBe('Edge');
  });

  it('detects Linux without a browser name', () => {
    const ua = 'curl/8.4.0 (Linux x86_64) custom-client';
    expect(parser.parse(ua)).toEqual({ os: 'Linux' });
  });

  it('returns an empty object when nothing matches', () => {
    expect(parser.parse('totally-made-up-agent/1.0')).toEqual({});
  });
});
