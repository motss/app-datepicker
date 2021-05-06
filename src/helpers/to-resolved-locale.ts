import { DateTimeFormat, defaultLocale } from '../constants.js';

export function toResolvedLocale(): string {
  try {
    return DateTimeFormat().resolvedOptions().locale || defaultLocale;
  } catch {
    return defaultLocale;
  }
}