// @ts-check

export function toUTCDate(date?: string|number|Date) {
  const toDate = new Date(date == null ? new Date() : date);
  const fy = toDate.getUTCFullYear();
  const m = toDate.getUTCMonth();
  const d = toDate.getUTCDate();

  return new Date(Date.UTC(fy, m, d));
}
