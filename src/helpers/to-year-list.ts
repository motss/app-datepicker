import { emptyReadonlyArray } from '../constants.js';
import { toDayDiffInclusive } from './to-day-diff-inclusive.js';

export function toYearList(min: Date, max: Date): readonly number[] {
  if (toDayDiffInclusive(min, max) < 1) {
    return emptyReadonlyArray;
  }

  const fy = min.getUTCFullYear();

  return Array.from(Array(max.getUTCFullYear() - fy + 1), (_, i) => i + fy);
}
