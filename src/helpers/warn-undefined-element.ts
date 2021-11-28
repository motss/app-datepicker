export function warnUndefinedElement(elementName: string): void {
  if (!globalThis.customElements.get(elementName)) {
    console.warn(`${elementName} is required`);
  }
}
