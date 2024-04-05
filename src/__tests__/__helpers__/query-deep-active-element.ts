export function queryDeepActiveElement(): HTMLElement | null {
  let element = document.activeElement as HTMLElement | null;

  while (element?.shadowRoot) {
    const shadowElement = element.shadowRoot
      .activeElement as HTMLElement | null;

    if (shadowElement) {
      element = shadowElement;
    }
  }

  return element;
}
