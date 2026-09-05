import { describe, expect, it } from 'vitest';
import { capabilities, wrap } from '../src/ui/terminal.js';
import { brandBanner, combineColumns, largeWord } from '../src/ui/banner.js';

describe('terminal fallbacks', () => {
  it('uses plain output for pipes and dumb terminals', () => {
    expect(capabilities(undefined, { TERM: 'xterm', LANG: 'en_US.UTF-8' }, 'linux', false).unicode).toBe(false);
    const dumb = capabilities(undefined, { TERM: 'dumb' }, 'win32', true);
    expect(dumb.color).toBe(false);
    expect(dumb.limited).toBe(true);
  });
  it('honors NO_COLOR, ASCII preference and conservative encoding detection', () => {
    expect(capabilities(undefined, { NO_COLOR: '', WT_SESSION: 'test' }, 'win32', true).color).toBe(false);
    expect(capabilities(undefined, {}, 'win32', true).unicode).toBe(false);
    expect(capabilities(undefined, { LANG: 'C' }, 'linux', true).unicode).toBe(false);
    expect(capabilities(undefined, { LANG: 'en_US.UTF-8' }, 'linux', true).unicode).toBe(true);
    expect(capabilities(undefined, { LANG: 'en_US.UTF-8', CODEGUREX_ASCII: '1' }, 'linux', true).unicode).toBe(false);
  });
  it('wraps prose to even narrow terminal widths', () => {
    for (const width of [1, 12, 40, 80]) expect(wrap('A long explanation with extraordinarilylongwords and new\nlines.', width).split('\n').every(l => l.length <= width)).toBe(true);
  });
  it('renders the full brand and verified channels at standard widths', () => {
    const banner = brandBanner(80, true);
    expect(banner.sideBySide).toBe(true);
    expect(banner.wordmark).toContain('P A T H  /  SECURITY LEARNING EXPERIENCE');
    expect(banner.details.join('\n')).toContain('github.com/codegurex');
    expect(banner.details.join('\n')).toContain('linkedin.com/in/codegurex');
    expect(combineColumns(banner.logo, banner.wordmark).every(line => line.length <= 80)).toBe(true);
    expect(largeWord('CODEGUREX', false)).toHaveLength(5);
  });
  it('uses an unboxed compact identity in narrow terminals', () => {
    for (const width of [1, 20, 40, 57]) {
      const banner = brandBanner(width, false);
      expect(banner.sideBySide).toBe(false);
      expect(banner.wordmark).toEqual(['CODEGUREX PATH']);
      expect(banner.details.join('\n')).toContain('codegurex.com');
    }
  });
});
