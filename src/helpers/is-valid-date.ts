export function isValidDate(date: string, dateDate: Date) {
  return !(date == null || !(dateDate instanceof Date) || isNaN(+dateDate));
}
