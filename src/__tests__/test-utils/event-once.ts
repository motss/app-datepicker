import { promiseTimeout } from '../constants';

export function eventOnce<
  T extends HTMLElement,
  EventName,
  ResolvedCustomEvent extends CustomEvent
>(
  node: T,
  eventName: EventName,
  timeout?: number
): Promise<ResolvedCustomEvent | undefined> {
  return new Promise<ResolvedCustomEvent | undefined>((resolve) => {
    node.addEventListener(eventName as unknown as keyof HTMLElementEventMap, (
      ev
    ) => {
      /**
       * NOTE: Rewire these properties/ functions because the actual value will be lost due to
       * wrapping inside a Promise:
       *
       * 1. `.composedPath()`
       * 1. `.currentTarget`
       * 1. `.target`
       *
       * Using `Object.assign` or `{...}` does not work either.
       */
      const resolvedEvent = new CustomEvent(eventName as unknown as string, ev);
      const composedPath = ev.composedPath();

      ['composedPath'].forEach((n) => {
        Object.defineProperty(resolvedEvent, n, {
          value: () => composedPath,
        });
      });
      ['currentTarget', 'target'].forEach((n) => {
        Object.defineProperty(resolvedEvent, n, {
          value: ev?.[n as keyof typeof ev],
        });
      });

      resolve(resolvedEvent as ResolvedCustomEvent);
    });

    // Race with event listener
    globalThis.setTimeout(
      () => resolve(undefined),
      timeout ?? promiseTimeout
    );
  });
}
