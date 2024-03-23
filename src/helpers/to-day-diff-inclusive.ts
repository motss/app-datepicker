/**
 * Compute the date range with given `min` and `max` (inclusive).
 * When the difference between `min` and `max` is within 1 day, it will be rounded as 1 day.
 */
export function toDayDiffInclusive(
  min: Date | number,
  max: Date | number
): number {
  return 1 + Math.floor((+max - +min) / 864e5);
}
