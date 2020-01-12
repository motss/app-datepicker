export function toSelector(selector: string) {
  return [
    `.calendar-container:nth-of-type(2)`,
    selector,
  ].join(' ');
}
