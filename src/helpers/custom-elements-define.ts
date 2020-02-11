export function customElementsDefine<T>(tagName: string, baseClass: T) {
  if (window.customElements && !window.customElements.get(tagName)) {
    window.customElements.define(tagName, baseClass as unknown as any);
  }
}
