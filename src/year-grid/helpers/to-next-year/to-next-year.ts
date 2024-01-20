import { clampValue } from '../../../helpers/clamp-value.js';
import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyHome } from '../../../key-values.js';
import { yearGridMaxColumn } from '../../constants.js';
import type { ToNextYearInit } from './types.js';

export function toNextYear({
  key,
  max,
  min,
  year,
}: ToNextYearInit): number {
  let newYear = year;

  switch (key) {
    case keyArrowUp: {
      newYear = year - yearGridMaxColumn;
      break;
    }
    case keyArrowDown: {
      newYear = year + yearGridMaxColumn;
      break;
    }
    case keyArrowLeft: {
      newYear = year - 1;
      break;
    }
    case keyArrowRight: {
      newYear = year + 1;
      break;
    }
    case keyEnd: return max.getUTCFullYear();
    case keyHome: return min.getUTCFullYear();
    default:
      return year;
  }

  return clampValue(min.getUTCFullYear(), max.getFullYear(), newYear);
}
