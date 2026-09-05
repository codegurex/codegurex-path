import { en, type MessageKey } from './en.js';
export function t(key: MessageKey, locale: 'en' = 'en'): string {
  const catalogs = { en };
  return catalogs[locale][key];
}
