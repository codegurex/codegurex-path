import { Chalk } from 'chalk';
import type { State } from '../types/progress.js';

export function capabilities(settings?: State['settings'], env = process.env, platform = process.platform, tty = Boolean(process.stdout.isTTY), columns = process.stdout.columns || 80) {
  const limited = !tty || env.TERM === 'dumb';
  const unicode = !limited && settings?.unicode !== 'off' && env.CODEGUREX_ASCII !== '1' &&
    (platform === 'win32' ? Boolean(env.WT_SESSION || env.TERM_PROGRAM) : /utf-?8/i.test(`${env.LC_ALL || env.LC_CTYPE || env.LANG || ''}`));
  const color = !limited && settings?.color !== 'off' && env.NO_COLOR === undefined;
  return { tty, limited, unicode, color, width: Math.max(1, Math.min(columns, 96)) };
}

export function wrap(text: string, width: number): string {
  const size = Math.max(1, width);
  return text.split('\n').flatMap(line => {
    const lines: string[] = [];
    let current = '';
    for (const word of line.split(/\s+/).filter(Boolean)) {
      if (current && current.length + word.length + 1 > size) { lines.push(current); current = ''; }
      let rest = word;
      while (rest.length > size) { lines.push(rest.slice(0, size)); rest = rest.slice(size); }
      if (rest) current += (current ? ' ' : '') + rest;
    }
    lines.push(current);
    return lines;
  }).join('\n');
}

export class Terminal {
  caps = capabilities();
  private colors = new Chalk({ level: 0 });
  configure(settings?: State['settings'], plain = false): void {
    this.caps = capabilities(settings);
    if (plain) this.caps = { ...this.caps, limited: true, unicode: false, color: false };
    this.colors = new Chalk({ level: this.caps.color ? (process.stdout.getColorDepth?.() >= 8 ? 2 : 1) : 0 });
  }
  line(text = ''): void { console.log(wrap(text, this.caps.width)); }
  title(text: string): void {
    console.log('\n' + this.colors.blue.bold(wrap(text, this.caps.width)));
    console.log(this.colors.gray((this.caps.unicode ? '─' : '-').repeat(this.caps.width)));
  }
  section(title: string, text: string): void { console.log('\n' + this.colors.bold(wrap(title, this.caps.width))); this.line(text); }
  code(text: string): void {
    // Commands retain exact bytes so copying a wrapped command never inserts a newline.
    console.log(this.colors.cyan(text));
  }
  bar(percent: number): string {
    const width = Math.max(1, Math.min(24, this.caps.width - 8));
    const filled = Math.round(width * percent / 100);
    return (this.caps.unicode ? '█' : '#').repeat(filled) + (this.caps.unicode ? '░' : '.').repeat(width - filled) + ` ${percent}%`;
  }
  clear(): void { if (this.caps.tty && !this.caps.limited) process.stdout.write('\x1b[2J\x1b[H'); }
  banner(): void {
    if (this.caps.width >= 60) this.code('+----------------------+\n|  C G  /  P A T H      |\n+----------------------+');
    this.title('CODEGUREX PATH');
    this.line('CodeGurex Security | Security for the AI Era');
    this.line('Learn how systems work. Then learn how to secure them.');
    if (this.caps.width < 50) this.line('Compact view. Widen the terminal for easier reading.');
  }
}
