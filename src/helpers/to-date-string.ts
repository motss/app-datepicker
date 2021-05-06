export function toDateString(date: Date): string {
  try {
    const dateString = date.toJSON();
    return dateString == null ? '' : dateString.replace(/^(.+)T.+/i, '$1');
  } catch {
    return '';
  }
}