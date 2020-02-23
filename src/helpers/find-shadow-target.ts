type AnyEventType = CustomEvent | KeyboardEvent | MouseEvent | PointerEvent;

export function findShadowTarget<T extends HTMLElement = HTMLElement>(
  ev: AnyEventType,
  callback: (n: HTMLElement) => boolean
): T {
  return (ev.composedPath() as HTMLElement[]).find((n) => {
    if (n instanceof HTMLElement) return callback(n);
    return false;
  }) as T;
}
