/** Import project dependencies */
import {
  html,
  LitElement
} from '../node_modules/@polymer/lit-element/lit-element.js';

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
      _inputType: String,
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
    // valueAsDate,
    // valueAsNumber,

    label,
    // dialogType,

    _inputType,
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
        <input id="datepicker__ipt" type="${_inputType}"
          min="${min}"
          max="${max}"
          value="${value}"
          on-click="${ev => this.openDatepicker(ev)}"></input>
      </label>
    `;
  }

  initProps() {
    const hasInputTypeDateSupported = AppDatepickerInput.isInputTypeDateSupported();

    this.label = this.label == null
      ? ''
      : this.label;
    this.dialogType = this.dialogType == null
      ? 'plain'
      : this.dialogType;

    this._hasInputTypeDateSupported = hasInputTypeDateSupported;
    this._inputType = hasInputTypeDateSupported
      ? 'date'
      : 'text';
    this._pattern = 'yyyy-MM-dd';
  }

  openDatepicker(ev) {
    if (this._hasInputTypeDateSupported) {
      return;
    }

    const updateAttribute = AppDatepickerInput.updateAttribute;

    if (!this._dlg) {
      const dlg = document.createElement('app-datepicker-dialog');

      updateAttribute(dlg, 'min', this.min);
      updateAttribute(dlg, 'max', this.max);
      updateAttribute(dlg, 'value', this.value);
      updateAttribute(dlg, 'dialogType', this.dialogType);
      // updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
      // updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);

      // dlg.min = this.min;
      // dlg.max = this.max;
      // dlg.value = this.value;
      dlg.valueAsDate = this.valueAsDate;
      dlg.valueAsNumber = this.valueAsNumber;
      // dlg.dialogType = this.dialogType;

      dlg.addEventListener('value-updated', (ev) => {
        const updatedVal = ev.detail;
        const evDetail = {
          detail: Object.assign({}, updatedVal),
        };

        // console.log('# value-updated', updatedVal);

        /** NOTE: Update all values */
        // return Promise.resolve(this.renderComplete)
        //   .then(() => {
        //     this.value = updatedVal.value;
        //     this.valueAsDate = updatedVal.valueAsDate;
        //     this.valueAsNumber = updatedVal.valueAsNumber;

        //     return this.renderComplete;
        //   })
        //   .then(() => {
        //     /** NOTE: Fire events to notify updated values */
        //     this.dispatchEvent(new CustomEvent('value-changed', Object.assign({}, evDetail)));
        //     this.dispatchEvent(new CustomEvent('change', Object.assign({}, evDetail)));
        //     this.dispatchEvent(new CustomEvent('input', Object.assign({}, evDetail)));
        //   });
      });

      this._dlg = dlg;

      document.body.appendChild(dlg);
    }

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const dlg = this._dlg;

        updateAttribute(dlg, 'min', this.min);
        updateAttribute(dlg, 'max', this.max);
        updateAttribute(dlg, 'value', this.value);
        updateAttribute(dlg, 'dialogType', this.dialogType);
        // updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
        // updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);

        // dlg.min = this.min;
        // dlg.max = this.max;
        // dlg.value = this.value;
        dlg.valueAsDate = this.valueAsDate;
        dlg.valueAsNumber = this.valueAsNumber;
        // dlg.dialogType = this.dialogType;

        return this.renderComplete;
      })
      .then(() => {
        this._dlg.opened = true;
      });
  }

  static updateAttribute(node, attrName, attrVal) {
    if (/^(false|null|undefined)/i.test(attrVal)) {
      return node.removeAttribute(attrName);
    }

    return node.setAttribute(
      attrName,
      typeof attrVal === 'object'
        ? JSON.stringify(attrVal)
        : attrVal
    );
  }

  static isInputTypeDateSupported() {
    const ipt = document.createElement('input');

    ipt.setAttribute('type', 'date');

    return ipt.type === 'date';
  }
}

window.customElements.define(AppDatepickerInput.is, AppDatepickerInput);
