export interface PropertyValueOptions {
  label: string;
  value: string;
}
export interface PropertyValue {
  name: string;
  value: unknown;
  options?: PropertyValueOptions[];
  type?: string;
}

import '@material/mwc-button/mwc-button.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import 'prismjs';

import { nothing } from 'lit-html/lib/part.js';
import { contentCopy } from './demo-icons.js';
import { prismVscode } from './prism-style.js';

const localName  = 'code-configurator';
const { highlight, languages } = window.Prism;

function notArray(a?: unknown[]) {
  return !Array.isArray(a) || !a.length;
}

function toFunctionType(type?: string) {
  switch (type) {
    case 'boolean': return Boolean;
    case 'number': return Number;
    case 'string':
    default: return String;
  }
}

function toInputType(type?: string) {
  switch (type) {
    case 'boolean': return 'checkbox';
    case 'number': return 'number';
    case 'string':
    default: return 'text';
  }
}

function toPropertiesAttr(properties: PropertyValue[]) {
  const mapped = properties.map((n) => {
    const { name, type, value } = n;

    const fnType = toFunctionType(type);
    const val = fnType(value);

    return `  ${name.toLowerCase()}="${val}"`;
  });

  return `\n${mapped.join('  \n')}\n`;
}

function toCSSProperties(cssProperties: PropertyValue[]) {
  return cssProperties.map(n => `  ${n.name}: ${n.value};\n`).join('');
}

function renderCode(code: string, grammar: string, language: string) {
  return unsafeHTML(highlight(code, languages[grammar], language));
}

@customElement(localName)
export class CodeConfigurator extends LitElement {
  public static styles = [
    css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    .all-properties-container {
      display: flex;
    }

    .configurator + .configurator {
      margin: 8px 0 0;
    }

    .code-container {
      position: relative;
    }

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;

      color: #fff;
      fill: #fff;
      z-index: 1;

      --mdc-theme-primary: #fff;
    }

    .copy-text {
      margin: 0 0 0 8px;
    }
    `,
    prismVscode,
  ];

  @property({ type: Array })
  public properties?: PropertyValue[];

  @property({ type: Array })
  public cssProperties?: PropertyValue[];

  @property({ type: String })
  public customElement?: string;

  private _slotted?: HTMLElement | null;
  private _slottedElements?: HTMLElement[];

  protected updated() {
    const properties = this.properties;
    const cssProperties = this.cssProperties;
    const slottedElements = this._slottedElements;

    console.log(slottedElements);

    if (notArray(slottedElements)) return;

    if (!notArray(properties)) {
      properties!.forEach((n) => {
        slottedElements!.forEach((o) => {
          (o as any)[n.name] = n.value;
        });
      });
    }

    if (!notArray(cssProperties)) {
      cssProperties!.forEach((n) => {
        slottedElements!.forEach((o) => {
          o.style.setProperty(n.name, n.value as string);
        });
      });
    }
  }

  protected render() {
    const properties = this.properties;
    const cssProperties = this.cssProperties;

    console.log(
      properties,
      cssProperties
    );

    return html`
    <div>
      <slot class="slot" @slotchange="${this._updateSlotted}"></slot>
    </div>

    <div>${this._renderProperties(properties, cssProperties)}</div>
    `;
  }

  private _updateSlotted(ev: Event) {
    const slotted = ev.currentTarget as HTMLSlotElement;
    const customElementName = this.customElement;

    if (typeof customElementName !== 'string' || !customElementName.length) {
      throw new Error(`Property 'customElement' is not defined`);
    }

    const assignedNodes = Array.from(slotted.assignedNodes()).filter(
      n => n.nodeType === Node.ELEMENT_NODE) as HTMLElement[];
    const matchedCustomElements = assignedNodes.reduce((p, n) => {
      if (n.localName === customElementName) {
        p.push(n);
      } else if (n && n.querySelectorAll) {
        const allCustomElements = Array.from<HTMLElement>(n.querySelectorAll(customElementName));
        p.push(...allCustomElements);
      }

      return p;
    }, [] as HTMLElement[]);

    console.log(
      assignedNodes,
      matchedCustomElements
    );

    const noNodes = notArray(matchedCustomElements);

    this._slotted = noNodes ? null : matchedCustomElements[0];
    this._slottedElements = noNodes ? [] : matchedCustomElements;
    this.requestUpdate();
  }

  private _renderProperties(properties?: PropertyValue[], cssProperties?: PropertyValue[]) {
    const slotted = this._slotted;
    const noProperties = notArray(properties);
    const noCssProperties = notArray(cssProperties);

    if (slotted == null) return;

    const elName = slotted.localName;

    // tslint:disable: max-line-length
    return html`
    <div class="all-properties-container">
    ${noProperties ? nothing : html`<div>
      <h2>Properties</h2>
      <div class="configurator-container">${this._renderPropertiesConfigurator(properties)}</div>
    </div>`}

    <div style="flex: 1; min-width: 16px;"></div>

    ${noCssProperties ? nothing : html`<div>
      <h2>CSS Properties</h2>
      <div class="configurator-container">${
        this._renderPropertiesConfigurator(cssProperties, true)}</div>
    </div>`}
    </div>

    ${noProperties && noCssProperties ? nothing : html`<h2>Code snippet</h2>`}

    ${noProperties ? nothing : html`
    <h3>Properties</h3>
    <div class="code-container">
      <mwc-button
        class="copy-btn"
        for="propertiesFor"
        @click="${this._copyCode}">
        ${contentCopy}
        <span class="copy-text">Copy</span>
      </mwc-button>
      <pre class="language-html" id="propertiesFor">${
        renderCode(`<${elName}${
          toPropertiesAttr(properties!)}><${elName}>`, 'html', 'html')}</pre>
    </div>
    `}

    ${noCssProperties ? nothing : html`
    <h3>CSS Properties</h3>
    <div class="code-container">
      <mwc-button class="copy-btn" for="cssPropertiesFor" @click="${this._copyCode}">
        ${contentCopy}
        <span class="copy-text">Copy</span>
      </mwc-button>
      <pre class="language-css" id="cssPropertiesFor">${
        renderCode(`${elName} {\n${toCSSProperties(cssProperties!)}}`, 'css', 'css')}</pre>
    </div>
    `}
    `;
    // tslint:disable: max-line-length
  }

  private _renderPropertiesConfigurator(properties?: PropertyValue[], isCSS: boolean = false) {
    if (notArray(properties)) return '';

    const longestName = properties!.reduce((p, n) => n.name.length > p.length ? n.name : p, '');
    const longestNameLen = longestName.length;
    const content = properties!.map((n) => {
      const { name, options, type, value } = n;
      const element = options ?
        html`<select
          data-propertyname="${name}"
          selected="${value}"
          @change="${(ev: Event) => this._updateProps(ev, isCSS)}">${
          options.map(o => html`<option value="${o.value}">${o.label}</option>`)}</select>` :
        html`<input
          data-propertyname="${name}"
          type="${toInputType(type)}"
          value="${value}"
          @change="${(ev: Event) => this._updateProps(ev, isCSS)}"/>`;

      return html`<div class="configurator">
        <label>
          <div style="display: inline-block; width: calc(${
            longestNameLen}ch + 8px);">${name}</div>
          ${element}
        </label>
      </div>`;
    });

    return content;
  }

  private _updateProps(ev: Event, isCSS: boolean) {
    const currentTarget = ev.currentTarget as HTMLInputElement | HTMLSelectElement;
    const propertyName = currentTarget.getAttribute('data-propertyname');
    const properties = isCSS ? this.cssProperties : this.properties;
    const val = currentTarget.tagName === 'INPUT' && currentTarget.type === 'checkbox' ?
      (currentTarget as HTMLInputElement).checked :
      currentTarget.value;

    if (notArray(properties)) return;

    const updatedProperties = properties!.map((n) => {
      if (n.name === propertyName) {
        return { ...n, value: toFunctionType(n.type)(val) };
      }

      return n;
    });

    const propName = `${isCSS ? 'cssP' : 'p'}roperties` as 'properties' | 'cssProperties';

    this[propName] = updatedProperties;
    this.requestUpdate(propName);
  }

  private _copyCode(ev: Event) {
    const currentTarget = ev.currentTarget as HTMLElement;
    const copyNode =
      this.shadowRoot!.querySelector(`#${currentTarget.getAttribute('for')}`) as HTMLElement;

    const selection = getSelection()!;
    const range = document.createRange();

    selection.removeAllRanges();
    range.selectNodeContents(copyNode);
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    this.dispatchEvent(new CustomEvent('content-copied'));
  }

}

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }
}
