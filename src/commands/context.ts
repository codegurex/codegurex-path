import { Storage } from '../core/storage.js';
import { Terminal } from '../ui/terminal.js';
import type { State } from '../types/progress.js';
export interface Context { storage: Storage; ui: Terminal; state: State; plain: boolean }
export async function refresh(ctx: Context): Promise<void> {
  ctx.state = await ctx.storage.read();
  ctx.ui.configure(ctx.state.settings, ctx.plain);
}
export async function update(ctx: Context, change: (state: State) => void): Promise<void> {
  ctx.state = await ctx.storage.update(change);
  ctx.ui.configure(ctx.state.settings, ctx.plain);
}
