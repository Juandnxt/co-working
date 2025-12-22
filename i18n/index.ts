import { locales } from '../lib/locales';
import type { Locale } from '../lib/locales';

export { locales };
export type { Locale };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}


