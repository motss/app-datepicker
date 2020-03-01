export function getDateRange(min: number | Date, max: number | Date): number {
  return +max - +min;
}
