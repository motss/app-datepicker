export function isSameMonth(targetDate: Date, sourceDate: Date): boolean {
  const targetDateFy = targetDate.getUTCFullYear();
  const targetDateM = targetDate.getUTCMonth();
  const sourceDateFy = sourceDate.getUTCFullYear();
  const sourceDateM = sourceDate.getUTCMonth();

  return targetDateFy === sourceDateFy && targetDateM === sourceDateM;
}
