interface Property {
  key: string;
  value: unknown;
  type?: string;
}

interface Locale {
  code: string;
  name: string;
}

import {
  css,
  customElement,
  html,
  LitElement,
  query,
} from 'lit-element';
import { nothing } from 'lit-html';
import { until } from 'lit-html/directives/until';

import { AppDatepicker } from '../app-datepicker';
import { datepickerVariables } from '../common-styles';
import {
  getResolvedDate,
  getResolvedLocale,
  toFormattedDateString,
} from '../datepicker-helpers';
import './clipboard-copy.js';
import {
  highlightJsAppTheme,
  markdownStyling,
} from './demo-styles';

import { START_VIEW } from '../app-datepicker';
import { WEEK_NUMBER_TYPE } from '../calendar';

const notArray = (a: unknown[]) => !Array.isArray(a) || !a.length;

@customElement(AppDatepickerConfigurator.is)
export class AppDatepickerConfigurator extends LitElement {
  static get is() { return 'app-datepicker-configurator'; }

  public static styles = [
    datepickerVariables,
    markdownStyling,
    highlightJsAppTheme,
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

  @query('app-datepicker')
  private _datepicker!: AppDatepicker;

  private _CSSCustomProps: Property[] = [
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

  private _publicProps: Property[] = [
    {
      key: 'firstDayOfWeek',
      value: 0,
      type: 'number',
    },
    {
      key: 'showWeekNumber',
      value: false,
      type: 'boolean',
    },
    {
      key: 'weekNumberType',
      value: WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
      type: 'string',
    },
    {
      key: 'landscape',
      value: false,
      type: 'boolean',
    },
    {
      key: 'startView',
      value: START_VIEW.CALENDAR,
      type: 'string',
    },
    {
      key: 'min',
      value: '',
      type: 'string',
    },
    {
      key: 'max',
      value: '',
      type: 'string',
    },
    {
      key: 'value',
      value: toFormattedDateString(getResolvedDate()),
      type: 'string',
    },
    {
      key: 'locale',
      value: getResolvedLocale(),
      type: 'string',
    },
    {
      key: 'disabledDays',
      value: '',
      type: 'string',
    },
    {
      key: 'disabledDates',
      value: '',
      type: 'string',
    },
    {
      key: 'weekLabel',
      value: '',
      type: 'string',
    },
    {
      key: 'dragRatio',
      value: .15,
      type: 'number',
    },
  ];

  protected updated() {
    console.log(
      'updated',
      this._CSSCustomProps,
      this._publicProps
    );

    const cssCustomProps = this._CSSCustomProps!;
    if (!notArray(cssCustomProps)) {
      cssCustomProps.forEach(({ key, value }) => {
        this._datepicker.style.setProperty(key, `${value}`);
      });
    }

    const publicProps = this._publicProps!;
    if (!notArray(publicProps)) {
      publicProps.forEach(({ key, value }) => {
        (this._datepicker as any)[key] = value;
      });
    }
  }

  protected render() {
    const cssCustomProps = this._CSSCustomProps;
    const publicProps = this._publicProps;

    return html`
    <div>
      <h3>&lt;app-datepicker&gt;</h3>

      <section class="container__element">
        <app-datepicker></app-datepicker>
      </section>

      <section class="container__props">
        <div class="container__ccs-custom-props">${this._renderCSSCustomProps(cssCustomProps)}</div>
        <div class="container__public-props">${this._renderPublicProps(publicProps)}</div>
      </section>

      <section class="container__code-snippet">
        ${this._renderCSSCustomPropsCode(cssCustomProps)}
        ${this._renderPublicPropsCode(publicProps)}
      </section>
    </div>
    `;
  }

  private _renderCSSCustomProps(cssCustomProps: Property[]) {
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

  private _renderPublicProps(publicProps: Property[]) {
    return publicProps.map(({ key, value, type }) => {
      const inputType = type === 'boolean' ? 'checkbox' : 'text';

      if (key === 'dragRatio') {
        return html`<div>
          <label>
            <span>${key}</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">
          </label>
        </div>`;
      }

      if (key === 'firstDayOfWeek') {
        return html`<div>
          <label>
            <span>${key}</span>
            <input
              type="number"
              min="0"
              max="6"
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">
          </label>
        </div>`;
      }

      if (key === 'startView') {
        return html`<div>
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">
              <option value="${START_VIEW.CALENDAR}">${START_VIEW.CALENDAR}</option>
              <option value="${START_VIEW.YEAR_LIST}">${START_VIEW.YEAR_LIST}</option>
            </select>
          </label>
        </div>`;
      }

      if (key === 'weekNumberType') {
        // tslint:disable: max-line-length
        return html`<div>
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">
              <option value="${WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK}">${WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK}</option>
              <option value="${WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR}">${WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR}</option>
              <option value="${WEEK_NUMBER_TYPE.FIRST_FULL_WEEK}">${WEEK_NUMBER_TYPE.FIRST_FULL_WEEK}</option>
            </select>
          </label>
        </div>`;
        // tslint:enable: max-line-length
      }

      if (key === 'locale') {
        const fetchLocales = async () => {
          const r = await fetch('/src/demo/locales.json');
          const d: Locale[] = await r.json();
          return d.map(n => html`<option value="${n.code}">${n.name}</option>`);
        };

        // tslint:disable: max-line-length
        return html`<div>
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">${until(fetchLocales(), nothing)}</select>
          </label>
        </div>`;
        // tslint:enable: max-line-length
      }

      return html`<div>
        <label>
          <span>${key}</span>
          <input
            type="${inputType}"
            value="${value}"
            @change="${(ev: Event) =>
              this._updatePropValue('_publicProps', key, (ev.target as HTMLInputElement))}">
        </label>
      </div>`;
    });
  }

  private _updatePropValue(
    name: string,
    key: string,
    target: HTMLInputElement
  ) {
    const value = target.tagName === 'INPUT' && target.type === 'checkbox' ?
      target.checked : target.value;
    // console.log('updatepropvalue', name, key, value);

    (this as any)[name] = (this as any)[name]!.reduce((p: Property[], n: Property) => {
      const type = n.type;
      return p.concat(n.key === key ? {
        key,
        type,
        value: type === 'number' ? parseFloat(value as any) : value,
      } : n);
    }, [] as Property[]);
    this.requestUpdate(name);
  }

  private _renderCSSCustomPropsCode(cssCustomProps: Property[]) {
    return html`
    <clipboard-copy>
      <button for="codeCSSCustomProps">Copy</button>
      <pre id="codeCSSCustomProps" class="code-snippet__style">
app-datepicker {
${cssCustomProps.map(({ key, value }) => `  ${key}: ${value};`).join('\n')}
}</pre>
    </clipboard-copy>`;
  }

  private _renderPublicPropsCode(publicProps: Property[]) {
    return html`
    <clipboard-copy>
      <button for="codeHtmlTag">Copy</button>
      <pre id="codeHtmlTag" class="code-snippet__html-tag">
&lt;app-datepicker
${publicProps.map(({ key, value, type }) => {
  const lcKey = key.toLowerCase();
  if (type === 'boolean') return value ? `  ${lcKey}` : '';
  if (type === 'string') return value ? `  ${lcKey}="${value}"` : '';
  if (type === 'number') return isNaN(value as number) ? '' : `  ${lcKey}="${value}"`;
  return '';
}).filter(Boolean).join('\n')}
&gt;&lt;/app-datepicker&gt;</pre>
    </clipboard-copy>`;
  }

}
