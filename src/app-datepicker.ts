// @ts-check

/** Import project dependencies */
import {
  html,
  LitElement,
} from '../node_modules/@polymer/lit-element/lit-element.js';

class AppDatepicker extends LitElement {
  static get is() {
    return 'app-datepicker';
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  public ready() {
    super.ready();
  }

  public render({}) {
    return html`
      <style>
        :host {
          display: block;
        }

        * {
          box-sizing: border-box;
        }
      </style>

      <h1>${AppDatepicker.is}</h1>
      <slot></slot>
    `;
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
