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
    };
  }

  _shouldPropertiesChange(props, changedProps) {
    switch (true) {
      case ('dialogType' in props): {
        const propVal = props.dialogType;

        if (/^plain/i.test(propVal)) {
          return 'plain';
        }

        /** NOTE: Fallback to 'plain' dialog if invalid dialog type is detected */
        return /^(backdrop|modal)/i.test(propVal)
          ? propVal.toLowerCase()
          : 'plain';
      }
      default: {
        return Promise.resolve(this.renderComplete);
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
    valueAsDate,
    valueAsNumber,

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
          valueAsDate="${valueAsDate}"
          valueAsNumber="${valueAsNumber}"
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
  }

  openDatepicker(ev) {
    if (this._hasInputTypeDateSupported) {
      return;
    }

    console.log(
      '# openDatepicker',
      ev.target,
      ev.currentTarget,
    );

    const updateAttribute = AppDatepickerInput.updateAttribute;

    if (!this._dlg) {
      const dlg = document.createElement('app-datepicker-dialog');

      updateAttribute(dlg, 'min', this.min);
      updateAttribute(dlg, 'max', this.max);
      updateAttribute(dlg, 'value', this.value);
      updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
      updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);
      updateAttribute(dlg, 'dialogType', this.dialogType);

      this._dlg = dlg;

      document.body.appendChild(dlg);
    }

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const dlg = this._dlg;

        updateAttribute(dlg, 'min', this.min);
        updateAttribute(dlg, 'max', this.max);
        updateAttribute(dlg, 'value', this.value);
        updateAttribute(dlg, 'valueAsDate', this.valueAsDate);
        updateAttribute(dlg, 'valueAsNumber', this.valueAsNumber);
        updateAttribute(dlg, 'dialogType', this.dialogType);

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
