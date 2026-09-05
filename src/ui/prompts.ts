import { createInterface } from 'node:readline/promises';
import type { Terminal } from './terminal.js';
import { t } from '../i18n/index.js';

export class Cancelled extends Error {}
export function requireInteractive(): void {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error(t('noTTY'));
}
export interface Choice { name: string; value: string }
export async function askText(message: string, ui: Terminal): Promise<string> {
  requireInteractive();
  if (!ui.caps.limited && ui.caps.color && ui.caps.unicode) {
    const { input } = await import('@inquirer/prompts');
    return input({ message }, { clearPromptOnDone: true });
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  const abort = new AbortController();
  const cancel = (): void => abort.abort();
  process.once('SIGINT', cancel);
  rl.once('close', cancel);
  try { return await rl.question(`${message}: `, { signal: abort.signal }); }
  catch { throw new Cancelled(); }
  finally { process.off('SIGINT', cancel); rl.close(); }
}
export async function choose(message: string, choices: Choice[], ui: Terminal): Promise<string> {
  requireInteractive();
  if (!ui.caps.limited && ui.caps.color && ui.caps.unicode) {
    const { select } = await import('@inquirer/prompts');
    return select({ message, choices, pageSize: Math.max(3, Math.min(10, (process.stdout.rows || 24) - 8)),
      theme: { prefix: { idle: '?', done: '>' }, icon: { cursor: '>' } } }, { clearPromptOnDone: true });
  }
  ui.line(message);
  choices.forEach((c, index) => ui.line(`${index + 1}. ${c.name}`));
  while (true) {
    const value = await askText('Number (or q to exit)', ui);
    if (value.trim().toLowerCase() === 'q') throw new Cancelled();
    const index = Number(value) - 1;
    if (Number.isInteger(index) && choices[index]) return choices[index].value;
    ui.line(`Choose a number from 1 to ${choices.length}.`);
  }
}
