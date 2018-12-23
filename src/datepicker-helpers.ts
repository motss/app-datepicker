export function getResolvedTodayDate() {
  const dateDate = new Date();
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return new Date(Date.UTC(fy, m, d));
}

export function getResolvedLocale() {
  return (Intl
    && Intl.DateTimeFormat
    && Intl.DateTimeFormat().resolvedOptions
    && Intl.DateTimeFormat().resolvedOptions().locale)
    || 'en-US';
}

export function computeThreeCalendarsInARow(selectedDate: Date) {
  const dateDate = new Date(selectedDate);
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return [
    new Date(Date.UTC(fy, m - 1, d)),
    dateDate,
    new Date(Date.UTC(fy, m + 1, d)),
  ];
}
