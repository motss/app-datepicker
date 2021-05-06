import { toDateRange } from './to-date-range.js';

export function toYearList(min: Date, max: Date): number[] {
  if (toDateRange(min, max) < 864e5) return [];

  const fy = min.getUTCFullYear();

  return Array.from(Array(max.getUTCFullYear() - fy + 1), (_, i) => i + fy);
}