/** Import project dependencies */
import {
  html,
  LitElement
} from '../node_modules/@polymer/lit-element/lit-element.js';
import { Debouncer } from '../node_modules/@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '../node_modules/@polymer/polymer/lib/utils/async.js';

/** Import other modules */
import './app-datepicker-dialog.js';

class AppDatepickerInput extends LitElement {
  static get is() {
    return 'app-datepicker-input';
  }

  static get properties() {
    return {
      min: Date,
      max: Date,
      value: String,
      valueAsDate: Date,
      valueAsNumber: Number,

      firstDayOfWeek: Number,
      disabledDays: String,
      locale: String,
      startView: String,
      weekdayFormat: String,
      showWeekNumber: Boolean,

      label: String,
      dialogType: String,

      // _hasInputTypeDateSupported: Boolean,
      _pattern: String,
    };
  }

  _shouldPropertiesChange(props, changedProps) {
    if (changedProps == null) {
      return true;
    }

    const {
      dialogType,
      value,
    } = changedProps;

    if ('min' in changedProps || 'max' in changedProps) {
      this.updateDatepicker();
    }

    if ('dialogType' in changedProps) {
      if (typeof dialogType === 'string' && /^($|backdrop|modal|plain)/i.test(dialogType)) {
        Promise.resolve(this.renderComplete)
          .then(() => {
            this.dialogType = (dialogType || 'plain').toLowerCase();
          });
      }

      if (!/($|backdrop|modal|plain)/i.test(dialogType)) {
        Promise.resolve(this.renderComplete)
          .then(() => {
            this.dialogType = 'plain';
          });
      }
    }

    /** NOTE: This is critical as undefined valueAsDate, valueAsNumber will cause override */
    if ('value' in changedProps) {
      const resetValue = () => {
        console.warn(
          `The specified value "${value}" does not conform to the required format, "${this._pattern}"`
        );

        return Promise.resolve(this.renderComplete)
          .then(() => {
            this.value = '';
            this.valueAsDate = null;
            this.valueAsNumber = NaN;
          });
      };
      const toValueDate = new Date(value);

      if (
        (typeof value === 'string' && value.length > 0)
          && !/^invalid date/i.test(toValueDate)
          && /^\d{4}\-\d{2}\-\d{2}/i.test(value)
      ) {
        Promise.resolve(this.renderComplete)
          .then(() => {
            this.value = value;
            this.valueAsDate = toValueDate;
            this.valueAsNumber = +toValueDate;
          });
      } else {
        resetValue();
      }
    }

    // TODO: To support valueAsDate, valueAsNumber
    // if ('valueAsDate' in changedProps) {}
    // if ('valueAsNumber' in changedProps) {}

    return true;
  }

  constructor() {
    super();

    this.initProps();
  }

  render({
    min,
    max,
    value,
    valueAsDate,
    valueAsNumber,

    firstDayOfWeek,
    disabledDays,
    locale,
    startView,
    weekdayFormat,
    showWeekNumber,

    label,
    // dialogType,

  }) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        * {
          box-sizing: border-box;
        }

        .ipt__label {
          display: var(--app-datepicker-input-label-display, inline);
          width: var(--app-datepicker-input-label-width, auto);
          height: var(--app-datepicker-input-label-height, auto);
          margin: var(--app-datepicker-input-label-margin, 0);
          padding: var(--app-datepicker-input-label-margin, 0);
          color: var(--app-datepicker-input-label-color, inherit);
          font-size: var(--app-datepicker-input-label-font-size, inherit);
        }
      </style>

      <label for="datepicker__ipt">
        <span class="ipt__label">${label}</span>
        ${
          this._hasInputTypeDateSupported
            ? html`<input id="datepicker__ipt" type="date"
              min="${min}"
              max="${max}"
              value="${value}"
              valueAsDate="${valueAsDate}"
              valueAsNumber="${valueAsNumber}"></input>`
            : html`<input id="datepicker__ipt" type="text"
              min="${min}"
              max="${max}"
              value="${value}"
              on-click="${() => this.openDatepicker()}"
              on-keyup2="${ev => this.stepDatepickerValue(ev)}"
              on-input="${ev => this.updateDatepickerValue(ev)}"></input>`
        }

      </label>
    `;
  }

  initProps() {
    const hasInputTypeDateSupported = AppDatepickerInput.isInputTypeDateSupported();

    this.locale = this.locale == null
      ? window.navigator.language
      : this.locale;

    this.label = this.label == null
      ? ''
      : this.label;
    this.dialogType = this.dialogType == null
      ? 'plain'
      : this.dialogType;

    this._hasInputTypeDateSupported = hasInputTypeDateSupported;
    this._pattern = 'yyyy-MM-dd';
  }

  updateDatepicker() {
    const updateAttribute = AppDatepickerInput.updateAttribute;

    if (!this._dlg) {
      const dlg = document.createElement('app-datepicker-dialog');

      // updateAttribute(dlg, 'min', this.min);
      // updateAttribute(dlg, 'max', this.max);
      // updateAttribute(dlg, 'value', this.value);
      // updateAttribute(dlg, 'dialogType', this.dialogType);
      // updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
      // updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);

      dlg.min = this.min;
      dlg.max = this.max;
      dlg.value = this.value;
      dlg.valueAsDate = this.valueAsDate;
      dlg.valueAsNumber = this.valueAsNumber;

      dlg.firstDayOfWeek = this.firstDayOfWeek;
      dlg.disabledDays = this.disabledDays;
      dlg.locale = this.locale;
      dlg.startView = this.startView;
      dlg.weekdayFormat = this.weekdayFormat;
      dlg.showWeekNumber = this.showWeekNumber;

      dlg.dialogType = this.dialogType;

      dlg.addEventListener('value-updated', (ev) => {
        const updatedVal = ev.detail;
        const evDetail = {
          detail: Object.assign({}, updatedVal),
        };

        /** NOTE: Update all values */
        return Promise.resolve(this.renderComplete)
          .then(() => {
            this.value = updatedVal.value;
            this.valueAsDate = updatedVal.valueAsDate;
            this.valueAsNumber = updatedVal.valueAsNumber;

            return this.renderComplete;
          })
          .then(() => {
            /** NOTE: Fire events to notify updated values */
            this.dispatchEvent(new CustomEvent('value-changed', Object.assign({}, evDetail)));
            this.dispatchEvent(new CustomEvent('change', Object.assign({}, evDetail)));
            this.dispatchEvent(new CustomEvent('input', Object.assign({}, evDetail)));
          });
      });

      this._dlg = dlg;

      document.body.appendChild(dlg);
    }

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const dlg = this._dlg;

        // updateAttribute(dlg, 'min', this.min);
        // updateAttribute(dlg, 'max', this.max);
        // updateAttribute(dlg, 'value', this.value);
        // updateAttribute(dlg, 'dialogType', this.dialogType);
        // updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
        // updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);

        dlg.min = this.min;
        dlg.max = this.max;
        dlg.value = this.value;
        dlg.valueAsDate = this.valueAsDate;
        dlg.valueAsNumber = this.valueAsNumber;

        dlg.firstDayOfWeek = this.firstDayOfWeek;
        dlg.disabledDays = this.disabledDays;
        dlg.locale = this.locale;
        dlg.startView = this.startView;
        dlg.weekdayFormat = this.weekdayFormat;
        dlg.showWeekNumber = this.showWeekNumber;

        dlg.dialogType = this.dialogType;

        return this.renderComplete;
      })
  }

  openDatepicker() {
    if (this._hasInputTypeDateSupported) {
      return;
    }

    return this.updateDatepicker()
      .then(() => {
        this._dlg.opened = true;
      });
  }

  updateDatepickerValue(ev) {
    const latestVal = ev.target.value;

    this._debounceUpdateDatepickerValue = Debouncer.debounce(
      this._debounceUpdateDatepickerValue,
      timeOut.after(750),
      () => {
        const { year, month, day } = AppDatepickerInput.formatToParts(latestVal, this.locale);
        const toValueDate = new Date(Date.UTC(year, month, day));

        if (/^invalid date/i.test(toValueDate)) {
          return;
        }

        return Promise.resolve(this.renderComplete)
          .then(() => {
            this.value = toValueDate.toJSON().replace(/^(.+)T.+/i, '$1');

            return this.renderComplete;
          })
          .then(() => {
            this.updateDatepicker();
          });
      }
    );
  }

  // stepDatepickerValue(ev) {
  //   const latestEv = ev;
  //   const latestVal = ev.target.value;

  //   this._debounceStepDatepickerValue = Debouncer.debounce(
  //     this._debounceStepDatepickerValue,
  //     timeOut.after(5e2),
  //     () => {
  //       console.log(
  //         '# stepDatepickerValue',
  //         latestEv,
  //         latestVal,
  //         this.shadowRoot.querySelector('#datepicker__ipt').selectionStart
  //       );

  //       return Promise.resolve(this.renderComplete)
  //         .then(() => {
  //           this.value = '2018-02-03';
  //         });
  //     }
  //   );
  // }

  // static updateAttribute(node, attrName, attrVal) {
  //   if (/^(false|null|undefined)/i.test(attrVal)) {
  //     return node.removeAttribute(attrName);
  //   }

  //   return node.setAttribute(
  //     attrName,
  //     typeof attrVal === 'object'
  //       ? JSON.stringify(attrVal)
  //       : attrVal
  //   );
  // }

  static formatToParts(dateString, locale) {
    if (typeof dateString !== 'string' || !dateString.length) {
      throw new TypeError(
        'Date string does not conform to the required format, "yyyy-MM-dd"'
      );
    }

    return dateString
      .split('-')
      .reduce((p, n, i) => {
        return Object.assign({}, p, {
          [['year', 'month', 'day'][i]]: i === 1 ? n - 1 : n,
        });
      }, {});
  }

  static isInputTypeDateSupported() {
    const ipt = document.createElement('input');

    ipt.setAttribute('type', 'date');

    return ipt.type === 'date';
  }
}

window.customElements.define(AppDatepickerInput.is, AppDatepickerInput);
