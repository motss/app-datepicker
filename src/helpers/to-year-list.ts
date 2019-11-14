import { arrayFilled } from './array-filled.js';

export function toYearList(min: Date, max: Date) {
  const fy = min.getUTCFullYear();
  return arrayFilled(max.getUTCFullYear() - fy + 1).map((_, i) => i + fy);
}
