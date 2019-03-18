import {
  customElement,
  html,
  LitElement,
} from 'lit-element';

function findAllCSSVariables<T extends HTMLElement>(ce: T): string[] {
  const cleanCss = (ce as any)._styles
    .map((n: any) => n.cssText.replace(/\/\*{1,}.+\*\//gi, ''));
  const find = (s: string[], r: RegExp) => [...s.map((n: any) => n.matchAll(r))
    .reduce((p: Set<string>, n: string) => {
      for (const [, o] of n) {
        p.add(o);
      }

      return p;
    }, new Set())];
  const cvs1 = find(cleanCss, /var\((--.+?)(?:,\s.+?)?\)/gi);
  const cvs2 = find(cleanCss, /(--.+?)\:\s.+\;/gi);

  return [...new Set(cvs1.concat(cvs2))].filter(n => !/[;:{}()]/gi.test(n));
}

function findAllPublicProperties<T extends HTMLElement>(ce: T): string[] {
  const cleanProps = [...(ce as any)._classProperties.keys()].filter(n => !/^_+/.test(n));
  return cleanProps;
}

@customElement(CustomElementConfigurator.is)
export class CustomElementConfigurator extends LitElement {
  static get is() { return 'custom-element-configurator'; }

  private _elements?: HTMLElement[];

  protected render() {
    return html`
    <style>
      :host {
        display: block;
      }

    </style>

    <slot @slotchange="${this._slotChange}"></slot>
    `;
  }

  protected updated() {
    const assignedElements =
      this._slot.assignedNodes().filter(n => 1 === n.nodeType) as HTMLElement[];

    // assignedElements.forEach(n => (n.style.display = 'none'));
    this._elements = assignedElements;
  }

  private _slotChange() {
    const assignedElements = this._elements!;
    const configurables: Record<string, Record<string, string[]>> = {};

    for (const ae of assignedElements) {
      const elName = ae.localName;
      const el = window.customElements.get(elName) as HTMLElement;

      console.time('css-var');
      const cvs = findAllCSSVariables(el);
      console.timeEnd('css-var');

      console.time('public-prop');
      const pp = findAllPublicProperties(el);
      console.timeEnd('public-prop');

      configurables[elName] = {
        cssVariables: cvs,
        publicProperties: pp,
      };
    }

    console.log(configurables);
  }

  get _slot() {
    return this.shadowRoot!.querySelector('slot')!;
  }
}
