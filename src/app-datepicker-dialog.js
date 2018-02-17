/** Import project dependencies */
import {
  html,
  LitElement
} from '@polymer/lit-element/lit-element.js';

/** Import other modules */
import './app-datepicker.js';

class AppDatepickerDialog extends LitElement {
  static get is() {
    return 'app-datepicker-dialog';
  }

  static get properties() {
    return {};
  }

  _shouldPropertiesChange(props, changedProps) {

  }

  constructor() {
    super();
  }

  render({}) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        * {
          box-sizing: border-box;
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

      <app-datepicker></app-datepicker>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm
          on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
      </div>
    `;
  }
}

window.customElements.define(AppDatepickerDialog.is, AppDatepickerDialog);
