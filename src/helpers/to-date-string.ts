export function toDateString(date: Date): string {
  return date.toISOString().replace(/^(.+)T.+/i, '$1');
}
