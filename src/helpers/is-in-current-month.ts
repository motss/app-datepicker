export function isInCurrentMonth(targetDate: Date, sourceDate: Date): boolean {
  const targetDateFy = targetDate.getUTCFullYear();
  const targetDateM = targetDate.getUTCMonth();
  const sourceDateFY = sourceDate.getUTCFullYear();
  const sourceDateM = sourceDate.getUTCMonth();

  return targetDateFy === sourceDateFY && targetDateM === sourceDateM;
}
