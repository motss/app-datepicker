export function toDateRange(min: number | Date, max: number | Date): number {
  return +max - +min;
}