export async function focusElement<T extends HTMLElement | null>(
  asyncSelector: Promise<T>,
  thenCallback?: (element: NonNullable<T>) => void | Promise<void>
): Promise<T> {
  const resolvedElement = await asyncSelector;

  if (resolvedElement) {
    resolvedElement.focus();
    thenCallback?.(resolvedElement as NonNullable<T>);
  }

  return resolvedElement;
}
