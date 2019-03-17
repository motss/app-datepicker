import {
  customElement,
  html,
  LitElement,
} from 'lit-element';

function extractCSSVariables(name: string) {
  const ce = window.customElements.get(name);
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

@customElement(CSSVariablesExtractor.is)
export class CSSVariablesExtractor extends LitElement {
  static get is() { return 'css-variables-extractor'; }

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
    const cssVariables: Record<string, string[]> = {};

    for (const ae of assignedElements) {
      // ae.style.display = 'none';

      // console.log(ae);
      const name = ae.localName;
      console.time('css-var');
      const cvs = extractCSSVariables(name);
      console.timeEnd('css-var');
      cssVariables[name] = cvs;
    }

    console.log(cssVariables);
  }

  get _slot() {
    return this.shadowRoot!.querySelector('slot')!;
  }
}
