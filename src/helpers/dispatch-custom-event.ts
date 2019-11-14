export function dispatchCustomEvent<T = CustomEvent['detail']>(
  target: HTMLElement,
  eventName: string,
  detail?: T
) {
  return target.dispatchEvent(new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
  }));
}
