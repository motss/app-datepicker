type AnyEventType = CustomEvent | KeyboardEvent | MouseEvent | PointerEvent;
export function findShadowTarget(
  ev: AnyEventType,
  callback: (n: HTMLElement) => boolean
) {
  return ev.composedPath().find((n) => {
    if (n instanceof HTMLElement) return callback(n);
    return false;
  });
}
