export function adjustOutOfRangeValue(min: Date, max: Date, date: Date): Date {
  const minTime = min.getTime();
  const maxTime = max.getTime();
  const currentTime = date.getTime();

  let newValue = currentTime;

  if (currentTime < minTime) newValue = minTime;
  if (currentTime > maxTime) newValue = maxTime;

  return new Date(newValue);
}
