// @ts-check

import '../node_modules/@polymer/paper-button/paper-button.js';
import * as Polymer from '../node_modules/@polymer/polymer/polymer-element.js';

export class AppDatepicker extends Polymer.Element {
  static get is() {
    return 'app-datepicker';
  }

  static get template() {
    console.log('🚧 template', Polymer);

    return Polymer.html`
      <style>
        :host {
          display: block;

          width: var(--app-datepicker-width);
          height: calc(var(--app-datepicker-width) / .6);
          background-color: #fff;

          --app-datepicker-width: 300px;

          --app-datepicker-header-height: 80px;

          --app-datepicker-footer-height: 56px;
        }

        * {
          box-sizing: border-box;
        }

        .datepicker__header {
          width: 100%;
          height: var(--app-datepicker-header-height);
          background-color: #4285F4;
        }

        .datepicker__main {
          width: 100%;
          height: calc(
            100% - var(--app-datepicker-header-height) - var(--app-datepicker-footer-height)
          );
          background-color: #fff;
        }

        .datepicker__footer {
          background-color: #fff;
          width: 100%;
          height: var(--app-datepicker-footer-height);
        }
      </style>

      <div class="datepicker__header"></div>

      <div class="datepicker__main"></div>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm>ok</paper-button>
      </div>
    `;
  }

  constructor() {
    super();
  }

  static get properties() {
    return {
      inputDate: {
        type: String,
        value: () => new Date(),
      },
    };
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
