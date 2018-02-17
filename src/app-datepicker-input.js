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

      label: String,
      firstDayOfWeek: Number,
      disabledDays: String,
      locale: String,
      startView: String,
      weekdayFormat: String,
      showWeekNumber: Boolean,

      // _hasInputTypeDateSupported: Boolean,
      _inputType: String,
    };
  }

  _shouldPropertiesChange(props, changedProps) {
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

        .datepicker__footer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          background-color: #fff;
          width: 100%;
          height: var(--app-datepicker-footer-height);
          padding: 0 8px 0 0;
        }
        .datepicker__footer > paper-button {
          color: var(--app-datepicker-primary-color);
          font-size: 14px;

          --paper-button-ink-color: #848484;
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
      <!-- <app-datepicker></app-datepicker>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm
          on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
      </div> -->
    `;
  }

  initProps() {
    const hasInputTypeDateSupported = AppDatepickerInput.isInputTypeDateSupported();

    this.label = this.label == null
      ? ''
      : this.label;

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

    if (!this._dlg) {
      const dlg = document.createElement('app-datepicker-dialog');

      dlg.setAttribute('min', this.min);
      dlg.setAttribute('max', this.max);
      dlg.setAttribute('value', this.value);
      dlg.setAttribute('valueAsDate', this.valueAsDate);
      dlg.setAttribute('valueAsNumber', this.valueAsNumber);

      this._dlg = dlg;

      document.body.appendChild(dlg);
    }

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const dlg = this._dlg;

        dlg.setAttribute('min', this.min);
        dlg.setAttribute('max', this.max);
        dlg.setAttribute('value', this.value);
        dlg.setAttribute('valueAsDate', this.valueAsDate);
        dlg.setAttribute('valueAsNumber', this.valueAsNumber);

        return this.renderComplete;
      })
      .then(() => {
        this._dlg.opened = true;
      });
  }

  static isInputTypeDateSupported() {
    const ipt = document.createElement('input');

    ipt.setAttribute('type', 'date');

    return ipt.type === 'date';
  }
}

window.customElements.define(AppDatepickerInput.is, AppDatepickerInput);
