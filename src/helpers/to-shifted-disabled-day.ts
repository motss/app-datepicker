export function toShiftedDisabledDay(firstDayOfWeek: number, disabledDay: number) {
  const day = disabledDay - firstDayOfWeek;
  return day < 0 ? 7 + day : day;
}
