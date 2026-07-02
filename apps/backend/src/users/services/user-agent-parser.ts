import { ParsedUserAgent } from '../users.types';

const BROWSER_PATTERNS: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'Edge', pattern: /Edg(?:e|A|iOS)?\/[\d.]+/i },
  { name: 'Opera', pattern: /OPR\/[\d.]+|Opera\/[\d.]+/i },
  { name: 'Chrome', pattern: /Chrome\/[\d.]+|CriOS\/[\d.]+/i },
  { name: 'Firefox', pattern: /Firefox\/[\d.]+|FxiOS\/[\d.]+/i },
  { name: 'Safari', pattern: /Version\/[\d.]+.*Safari\//i },
  { name: 'SamsungBrowser', pattern: /SamsungBrowser\/[\d.]+/i },
  { name: 'IE', pattern: /MSIE[\s/][\d.]+|Trident\/[\d.]+/i },
];

const OS_PATTERNS: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'Windows', pattern: /Windows NT ([\d.]+)/i },
  { name: 'iOS', pattern: /iPhone|iPad|iPod|CFNetwork.*Darwin/i },
  { name: 'Android', pattern: /Android[\s/][\d.]*/i },
  { name: 'macOS', pattern: /Mac OS X|Macintosh|Mac_PowerPC/i },
  { name: 'Linux', pattern: /Linux|X11/i },
];

export class UserAgentParser {
  parse(userAgent: string | null | undefined): ParsedUserAgent {
    if (!userAgent || typeof userAgent !== 'string') {
      return {};
    }

    const browser = this.matchFirst(BROWSER_PATTERNS, userAgent);
    const os = this.matchFirst(OS_PATTERNS, userAgent);

    const result: ParsedUserAgent = {};
    if (browser !== undefined) {
      result.browser = browser;
    }
    if (os !== undefined) {
      result.os = os;
    }
    return result;
  }

  private matchFirst(
    patterns: ReadonlyArray<{ name: string; pattern: RegExp }>,
    userAgent: string,
  ): string | undefined {
    for (const { name, pattern } of patterns) {
      if (pattern.test(userAgent)) {
        return name;
      }
    }
    return undefined;
  }
}

export const userAgentParser = new UserAgentParser();
