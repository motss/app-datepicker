import { DateTimeFormat, DEFAULT_LOCALE } from '../constants.js';

export function toResolvedLocale(): string {
  try {
    return DateTimeFormat().resolvedOptions().locale || DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
