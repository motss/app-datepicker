import type { SupportedCustomEvent } from '../typings.js';

export function dispatchCustomEvent<T extends keyof SupportedCustomEvent>(
  target: HTMLElement,
  eventName: T,
  detail?: SupportedCustomEvent[T]
): boolean {
  return target.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail,
  }));
}
