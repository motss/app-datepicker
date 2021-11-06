import type { SupportedCustomEventDetail } from '../typings.js';

export function dispatchCustomEvent<T extends keyof SupportedCustomEventDetail>(
  target: HTMLElement,
  eventName: T,
  detail?: SupportedCustomEventDetail[T]
): boolean {
  return target.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail,
  }));
}
