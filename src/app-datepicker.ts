// @ts-check

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
        }
      </style>

      <h1>${AppDatepicker.is}</h1>

      <p>[[inputDate]]</p>
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
