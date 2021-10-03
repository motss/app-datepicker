import { clampValue } from './clamp-value.js';

export function adjustOutOfRangeValue(min: Date, max: Date, date: Date): Date {
  return new Date(
    clampValue(
      min.getTime(),
      max.getTime(),
      date.getTime()
    )
  );
}
