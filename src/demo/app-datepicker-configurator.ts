interface Property {
  key: string;
  value: string;
}

import {
  css,
  customElement,
  html,
  LitElement,
} from 'lit-element';
import { nothing } from 'lit-html';

import { datepickerVariables } from '../common-styles';

const notArray = (a: unknown[]) => !Array.isArray(a) || !a.length;

@customElement(AppDatepickerConfigurator.is)
export class AppDatepickerConfigurator extends LitElement {
  static get is() { return 'app-datepicker-configurator'; }

  public static styles = [
    datepickerVariables,
    css`
    section + section {
      margin: 16px 0 0;
    }

    .container__element {
      display: flex;
      justify-content: center;
    }

    .container__props {
      display: flex;
    }

    .container__css-custom-props,
    .container__public-props {
      flex: 1 0 auto;

      max-width: 50%;
      width: 100%;
    }
    `,
  ];

  private _CSSCustomProps?: Property[] = [
    {
      key: '--app-datepicker-border-top-left-radius',
      value: '8px',
    },
    {
      key: '--app-datepicker-border-top-right-radius',
      value: '8px',
    },
    {
      key: '--app-datepicker-border-bottom-right-radius',
      value: '8px',
    },
    {
      key: '--app-datepicker-border-bottom-left-radius',
      value: '8px',
    },
  ];

  protected updated() {
    console.log(
      'updated',
      this._CSSCustomProps
    );

    const cssCustomProps = this._CSSCustomProps!;
    if (!notArray(cssCustomProps)) {
      cssCustomProps.forEach(({ key, value }) => {
        this._datepicker.style.setProperty(key, value);
      });
    }
  }

  protected render() {
    return html`
    <div>
      <h3>&lt;app-datepicker&gt;</h3>

      <section class="container__element">
        <app-datepicker></app-datepicker>
      </section>

      <section class="container__props">
        <div class="container__ccs-custom-props">${this._renderCSSCustomProps()}</div>
        <div class="container__public-props"></div>
      </section>

      <section class="container__code-snippet">
        <pre class="code-snippet__style"></pre>
        <pre class="code-snippet__html-tag"></pre>
      </section>
    </div>
    `;
  }

  private _renderCSSCustomProps() {
    const cssCustomProps = this._CSSCustomProps!;

    if (notArray(cssCustomProps)) return nothing;

    return cssCustomProps.map(({ key, value }) => {
      return html`<div>
        <label>
          <span>${key}</span>
          <input
            type="text"
            .value="${value}"
            min="1"
            max="8"
            @change="${(ev: Event) =>
              this._updatePropValue('_CSSCustomProps', key, (ev.target as HTMLInputElement))}">
        </label>
      </div>`;
    });
  }

  private _updatePropValue(
    name: string,
    key: string,
    target: HTMLInputElement
  ) {
    const value = target.value;
    console.log('updatepropvalue', name, key);

    (this as any)[name] = (this as any)[name]!.reduce((p: Property[], n: Property) => {
      return p.concat(n.key === key ? { key, value } : n);
    }, [] as Property[]);
    this.requestUpdate(name);
  }

  get _datepicker() {
    return this.shadowRoot!.querySelector('app-datepicker')!;
  }

}
