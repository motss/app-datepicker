import { clampValue } from '../../../../../helpers/clamp-value.js';
import {
  keyArrowDown,
  keyArrowLeft,
  keyArrowRight,
  keyArrowUp,
  keyEnd,
  keyHome,
} from '../../../../../key-values.js';
import { defaultYearGridMaxColumn } from '../../constants.js';
import type { ToNextYearInit } from './types.js';

export function toNextYear({ key, maxDate, minDate, year }: ToNextYearInit): number {
  let newYear = year;

  switch (key) {
    case keyArrowUp: {
      newYear = year - defaultYearGridMaxColumn;
      break;
    }
    case keyArrowDown: {
      newYear = year + defaultYearGridMaxColumn;
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
    case keyEnd:
      return maxDate.getUTCFullYear();
    case keyHome:
      return minDate.getUTCFullYear();
    default:
      return year;
  }

  return clampValue(minDate.getUTCFullYear(), maxDate.getFullYear(), newYear);
}
