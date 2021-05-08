export function adjustOutOfRangeValue(min: Date, max: Date, currentDate: Date): Date {
  const minTime = min.getTime();
  const maxTime = max.getTime();
  const currentTime = currentDate.getTime();

  let newValue = currentTime;

  if (currentTime < minTime) newValue = minTime;
  if (currentTime > maxTime) newValue = maxTime;

  return new Date(newValue);
}
