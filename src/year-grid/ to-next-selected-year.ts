import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyHome } from '../key-values.js';
import type { ToNextSelectableYearInit } from './typings.js';

export function toNextSelectedYear({
  key,
  max,
  min,
  year,
}: ToNextSelectableYearInit): number {
  switch (key) {
    case keyArrowUp: return year - 4;
    case keyArrowDown: return year + 4;
    case keyArrowLeft: return year - 1;
    case keyArrowRight: return year  + 1;
    case keyEnd: return max.getUTCFullYear();
    case keyHome: return min.getUTCFullYear();
    default:
      return year;
  }
}
