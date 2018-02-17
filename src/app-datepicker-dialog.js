/** Import project dependencies */
import {
  html,
  LitElement
} from '../node_modules/@polymer/lit-element/lit-element.js';

/** Import other modules */
import './app-datepicker.js';

class AppDatepickerDialog extends LitElement {
  static get is() {
    return 'app-datepicker-dialog';
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

      opened: Boolean,
    };
  }

  _shouldPropertiesChange(props, changedProps) {
    switch (true) {
      case ('opened' in props): {
        if (props.opened) {
          this.classList.add('opened');

          break;
        }

        this.classList.remove('opened');

        // TODO: Focus trap handler.

        break;
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

  connectedCallback() {
    super.connectedCallback();

    const findElemOnTap = (tgt) => {
      return tgt == null || /^app\-datepicker\-dialog/i.test(tgt.tagName)
        ? tgt
        : findElemOnTap(tgt.parentElement);
    };

    /** NOTE: Tap on outside of the dialog will close the dialog */
    document.body.addEventListener('click', (ev) => {
      if (/^app\-datepicker\-input/i.test(ev.target.tagName)) {
        return;
      }

      if (findElemOnTap(ev.target) == null) {
        return Promise.resolve(this.renderComplete)
          .then(() => {
            this.opened = false;
          });
      }
    });

  }

  render({
    min,
    max,
    value,
    valueAsDate,
    valueAsNumber,

    // modal,

  }) {
    return html`
      <style>
        :host {
          display: none;
          box-sizing: border-box;

          width: var(--app-datepicker-dialog-width);

          --app-datepicker-dialog-footer-height: 59px;
          --app-datepicker-dialog-width: 300px;

          box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                      0 9px 46px 8px rgba(0, 0, 0, 0.12),
                      0 11px 15px -7px rgba(0, 0, 0, 0.4);
        }
        :host(.opened) {
          display: block;
        }

        * {
          box-sizing: border-box;
        }

        app-datepicker {
          --app-datepicker-width: var(--app-datepicker-dialog-width);
          --app-datepicker-footer-height: var(--app-datepicker-dialog-footer-height);
        }

        .datepicker__footer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          background-color: #fff;
          width: 100%;
          height: var(--app-datepicker-dialog-footer-height);
          padding: 0 8px 0 0;
        }
        .datepicker__footer > paper-button {
          color: var(--app-datepicker-primary-color);
          font-size: 14px;

          --paper-button-ink-color: #848484;
        }
      </style>

      <app-datepicker></app-datepicker>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm
          on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
      </div>
    `;
  }

  initProps() {
  }
}

window.customElements.define(AppDatepickerDialog.is, AppDatepickerDialog);
