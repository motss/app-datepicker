import { keyCodesRecord } from '../constants.js';
import type { ToNextSelectableYearInit } from './typings.js';

const {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  END,
  HOME,
} = keyCodesRecord;

export function toNextSelectedYear({
  keyCode,
  max,
  min,
  year,
}: ToNextSelectableYearInit): number {
  switch (keyCode) {
    case ARROW_UP: return year - 4;
    case ARROW_DOWN: return year + 4;
    case ARROW_LEFT: return year - 1;
    case ARROW_RIGHT: return year  + 1;
    case END: return max.getUTCFullYear();
    case HOME: return min.getUTCFullYear();
    default:
      return year;
  }
}
