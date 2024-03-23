import { promiseTimeout } from '../constants';

export function eventOnce<
  T extends HTMLElement,
  EventName,
  ResolvedCustomEvent extends CustomEvent,
>(
  node: T,
  eventName: EventName,
  timeout?: number
): Promise<ResolvedCustomEvent | undefined> {
  return new Promise<ResolvedCustomEvent | undefined>((resolve) => {
    const handler: (
      this: HTMLElement,
      ev: HTMLElementEventMap[keyof HTMLElementEventMap]
    ) => unknown = (ev) => {
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

      Object.defineProperty(resolvedEvent, 'composedPath', {
        value: () => composedPath,
      });

      for (const n of ['currentTarget', 'target']) {
        Object.defineProperty(resolvedEvent, n, {
          value: ev?.[n as keyof typeof ev],
        });
      }

      node.removeEventListener(
        eventName as unknown as keyof HTMLElementEventMap,
        handler
      );

      resolve(resolvedEvent as ResolvedCustomEvent);
    };

    node.addEventListener(
      eventName as unknown as keyof HTMLElementEventMap,
      handler
    );

    // Race with event listener
    window.setTimeout(() => {
      node.removeEventListener(
        eventName as unknown as keyof HTMLElementEventMap,
        handler
      );
      resolve(undefined);
    }, timeout ?? promiseTimeout);
  });
}
