import { describe, expect, it } from 'vitest';
import { capabilities, wrap } from '../src/ui/terminal.js';

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
});
