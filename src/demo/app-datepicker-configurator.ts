interface Property {
  key: string;
  value: unknown;
  type?: string;
}

interface Locale {
  code: string;
  name: string;
}

import '@material/mwc-button/mwc-button.js';

import {
  css,
  customElement,
  html,
  LitElement,
  query,
} from 'lit-element';
import { nothing } from 'lit-html';
import { until } from 'lit-html/directives/until';

import { AppDatepicker, START_VIEW } from '../app-datepicker';
import { AppDatepickerDialog } from '../app-datepicker-dialog';
import { WEEK_NUMBER_TYPE } from '../calendar';
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

const notArray = (a: unknown[]) => !Array.isArray(a) || !a.length;

@customElement(AppDatepickerConfigurator.is)
export class AppDatepickerConfigurator extends LitElement {
  static get is() { return 'app-datepicker-configurator'; }

  public static styles = [
    datepickerVariables,
    markdownStyling,
    highlightJsAppTheme,
    css`
    :host {
      --app-primary-color: #1a73e8;
      --app-primary-background-color: rgba(207, 216, 220, .45);
    }

    section + section {
      margin: 16px 0 0;
    }

    .container__element {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 16px;
    }

    .container__props {
      display: flex;
      justify-content: space-between;
    }

    .container__css-custom-props,
    .container__public-props {
      flex: 1 0 auto;

      max-width: 50%;
      width: 100%;
    }
    .container__public-props {
      margin: 0 0 0 16px;
    }

    .container__prop + .container__prop {
      margin: 8px 0 0;
    }

    label {
      display: flex;
      align-items: flex-start;
    }
    label > span {
      width: 80%;
    }
    label > input,
    label > select {
      width: calc(20% - 16px);
      margin: 0 0 0 16px;
    }
    .container__public-props label > span {
      width: 50%;
    }
    .container__public-props label > input,
    .container__public-props label > select {
      width: 50%;
    }

    clipboard-copy {
      display: flex;

      position: relative;
    }
    clipboard-copy > mwc-button {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
    }
    clipboard-copy > pre {
      flex: 1 0 auto;

      margin: 0;
    }

    app-datepicker {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
    }

    mwc-button {
      margin: 8px 0 0;
      --mdc-theme-primary: var(--button-primary);
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
    {
      key: '--app-datepicker-primary-color',
      value: '#1a73e8',
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

  private _CSSCustomPropsForDialog: Property[] = [
    {
      key: '--app-datepicker-dialog-z-index',
      value: 24,
      type: 'number',
    },
    {
      key: '--app-datepicker-border-radius',
      value: '8px',
      type: 'string',
    },
  ];

  private _publicPropsForDialog: Property[] = [
    {
      key: 'dismissLabel',
      value: 'cancel',
      type: 'string',
    },
    {
      key: 'confirmLabel',
      value: 'ok',
      type: 'string',
    },
    {
      key: 'noFocusTrap',
      value: false,
      type: 'boolean',
    },
  ];

  protected updated() {
    console.log(
      'updated',
      this._CSSCustomProps,
      this._publicProps
    );

    const datepicker = this._datepicker;
    const dialog = this._dialog;
    const cssCustomProps = this._CSSCustomProps;
    const publicProps = this._publicProps;
    const cssCustomPropsForDialog = this._CSSCustomPropsForDialog;
    const publicPropsForDialog = this._publicPropsForDialog;

    if (!notArray(cssCustomProps)) {
      cssCustomProps.forEach(({ key, value }) => {
        const valueInString = `${value}`;
        datepicker.style.setProperty(key, valueInString);
        dialog.style.setProperty(key, valueInString);

        if (key === '--app-datepicker-primary-color') {
          this.style.setProperty('--button-primary', valueInString);
        }
      });
    }

    if (!notArray(publicProps)) {
      publicProps.forEach(({ key, value }) => {
        (datepicker as any)[key] = value;
        (dialog as any)[key] = value;
      });
    }

    if (!notArray(cssCustomPropsForDialog)) {
      cssCustomPropsForDialog.forEach(({ key, value }) => {
        dialog.style.setProperty(key, `${value}`);
      });
    }

    if (!notArray(publicPropsForDialog)) {
      publicPropsForDialog.forEach(({ key, value }) => {
        (dialog as any)[key] = value;
      });
    }
  }

  protected render() {
    const cssCustomProps = this._CSSCustomProps;
    const publicProps = this._publicProps;
    const cssCustomPropsForDialog = this._CSSCustomPropsForDialog;
    const publicPropsForDialog = this._publicPropsForDialog;

    // tslint:disable: max-line-length
    return html`
    <div>
      <h3>Preview</h3>

      <section class="container__element">
        <app-datepicker></app-datepicker>

        <mwc-button @click="${this._openDialog}">Open datepicker dialog</mwc-button>
        <app-datepicker-dialog class="dialog"></app-datepicker-dialog>
      </section>

      <h3>&lt;app-datepicker&gt; configuration</h3>
      <section class="container__props">
        <div class="container__ccs-custom-props">${this._renderCSSCustomProps(cssCustomProps, '_CSSCustomProps')}</div>
        <div class="container__public-props">${this._renderPublicProps(publicProps, '_publicProps')}</div>
      </section>

      <h3>&lt;app-datepicker-dialog&gt; configuration</h3>
      <section class="container__props">
        <div class="container__ccs-custom-props">${this._renderCSSCustomProps(cssCustomPropsForDialog, '_CSSCustomPropsForDialog')}</div>
        <div class="container__public-props">${this._renderPublicProps(publicPropsForDialog, '_publicPropsForDialog')}</div>
      </section>

      <h3>CSS Custom Properties</h3>
      <section class="container__code-snippet">
        <h4>&lt;app-datepicker&gt;</h4>
        ${this._renderCSSCustomPropsCode(cssCustomProps, AppDatepicker.is)}

        <h4>&lt;app-datepicker-dialog&gt;</h4>
        ${this._renderCSSCustomPropsCode(
          cssCustomProps.filter(n => n.key === '--app-datepicker-primary-color').concat(cssCustomPropsForDialog),
          AppDatepickerDialog.is)}
      </section>

      <h3>Public Properties</h3>
      <section class="container__code-snippet">
        <h4>&lt;app-datepicker&gt;</h4>
        ${this._renderPublicPropsCode(publicProps, AppDatepicker.is)}

        <h4>&lt;app-datepicker-dialog&gt;</h4>
        ${this._renderPublicPropsCode(publicProps.concat(publicPropsForDialog), AppDatepickerDialog.is)}
      </section>
    </div>
    `;
    // tslint:enable: max-line-length
  }

  private _renderCSSCustomProps(cssCustomProps: Property[], propName: string) {
    return cssCustomProps.map(({ key, value }) => {
      return html`<div class="container__prop">
        <label>
          <span>${key}</span>
          <input
            type="text"
            .value="${value}"
            min="1"
            max="8"
            @change="${(ev: Event) =>
              this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
        </label>
      </div>`;
    });
  }

  private _renderPublicProps(publicProps: Property[], propName: string) {
    return publicProps.map(({ key, value, type }) => {
      const inputType = type === 'boolean' ? 'checkbox' : 'text';

      if (key === 'dragRatio') {
        return html`<div class="container__prop">
          <label>
            <span>${key}</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
          </label>
        </div>`;
      }

      if (key === 'firstDayOfWeek') {
        return html`<div class="container__prop">
          <label>
            <span>${key}</span>
            <input
              type="number"
              min="0"
              max="6"
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
          </label>
        </div>`;
      }

      if (key === 'startView') {
        return html`<div class="container__prop">
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
              <option value="${START_VIEW.CALENDAR}">${START_VIEW.CALENDAR}</option>
              <option value="${START_VIEW.YEAR_LIST}">${START_VIEW.YEAR_LIST}</option>
            </select>
          </label>
        </div>`;
      }

      if (key === 'weekNumberType') {
        // tslint:disable: max-line-length
        return html`<div class="container__prop">
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
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
        return html`<div class="container__prop">
          <label>
            <span>${key}</span>
            <select
              value="${value}"
              @change="${(ev: Event) =>
                this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">${until(fetchLocales(), nothing)}</select>
          </label>
        </div>`;
        // tslint:enable: max-line-length
      }

      return html`<div class="container__prop">
        <label>
          <span>${key}</span>
          <input
            type="${inputType}"
            value="${value}"
            @change="${(ev: Event) =>
              this._updatePropValue(propName, key, (ev.target as HTMLInputElement))}">
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

  private _renderCSSCustomPropsCode(cssCustomProps: Property[], tagName: string) {
    return html`
    <clipboard-copy>
      <mwc-button for="codeCSSCustomProps">Copy</mwc-button>
      <pre id="codeCSSCustomProps" class="code-snippet__style">
${tagName} {
${cssCustomProps.map(({ key, value }) => `  ${key}: ${value};`).join('\n')}
}</pre>
    </clipboard-copy>`;
  }

  private _renderPublicPropsCode(publicProps: Property[], tagName: string) {
    return html`

    <clipboard-copy>
      <mwc-button for="codeHtmlTag">Copy</mwc-button>
      <pre id="codeHtmlTag" class="code-snippet__html-tag">
&lt;${tagName}
${publicProps.map(({ key, value, type }) => {
  const lcKey = key.toLowerCase();
  if (type === 'boolean') return value ? `  ${lcKey}` : '';
  if (type === 'string') return value ? `  ${lcKey}="${value}"` : '';
  if (type === 'number') return isNaN(value as number) ? '' : `  ${lcKey}="${value}"`;
  return '';
}).filter(Boolean).join('\n')}
&gt;&lt;/${tagName}&gt;</pre>
    </clipboard-copy>`;
  }

  private _openDialog() {
    const dialog = this._dialog;
    if (dialog) dialog.open();
  }

  get _dialog() {
    return this.shadowRoot!.querySelector('.dialog')! as AppDatepickerDialog;
  }

}
