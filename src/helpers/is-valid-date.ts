export function isValidDate(date: Date | null | number | string, dateDate: Date): boolean {
  return !(date == null || !(dateDate instanceof Date) || isNaN(+dateDate));
}
