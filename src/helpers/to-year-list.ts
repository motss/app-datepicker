import { getDateRange } from './get-date-range.js';

export function toYearList(min: Date, max: Date) {
  if (getDateRange(min, max) < 864e5) return [];

  const fy = min.getUTCFullYear();
  return Array.from(Array(max.getUTCFullYear() - fy + 1), (_, i) => i + fy);
}
