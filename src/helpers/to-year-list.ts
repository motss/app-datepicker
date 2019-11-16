export function toYearList(min: Date, max: Date) {
  const fy = min.getUTCFullYear();
  return Array.from(Array(max.getUTCFullYear() - fy + 1), (_, i) => i + fy);
}
