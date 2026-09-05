import { askText, choose, requireInteractive } from '../ui/prompts.js';
import { t } from '../i18n/index.js';
import { update, type Context } from './context.js';

export async function settings(ctx: Context): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    ctx.ui.line(JSON.stringify(ctx.state.settings, null, 2));
    return;
  }
  while (true) {
    const action = await choose('Settings / English (more languages planned)', [
      { name: `Color: ${ctx.state.settings.color}`, value: 'color' },
      { name: `Unicode: ${ctx.state.settings.unicode}`, value: 'unicode' },
      { name: t('back'), value: 'back' },
    ], ctx.ui);
    if (action === 'back') return;
    if (action === 'color' || action === 'unicode') await update(ctx, state => { state.settings[action] = state.settings[action] === 'auto' ? 'off' : 'auto'; });
  }
}
export async function reset(ctx: Context, confirmation?: string): Promise<void> {
  let answer = confirmation;
  if (answer === undefined) { requireInteractive(); answer = await askText(t('reset'), ctx.ui); }
  if (answer !== 'RESET') { ctx.ui.line(t('cancelled')); return; }
  const backup = await ctx.storage.reset();
  ctx.ui.line(`Progress and settings reset.${backup ? ` Previous data archived at ${backup}` : ''}`);
}
