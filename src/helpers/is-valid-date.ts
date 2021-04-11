export function isValidDate(date: string | undefined, dateDate: Date) {
  return !(date == null || !(dateDate instanceof Date) || isNaN(+dateDate));
}
