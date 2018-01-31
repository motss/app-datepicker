// @ts-check

export function customElement(tagName: string) {
  return (elementClass: any) => {
    window.customElements.define(tagName!, elementClass);
  };
}
