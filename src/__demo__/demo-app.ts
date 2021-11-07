import '../date-picker-input/app-date-picker-input.js';
import '../date-picker/app-date-picker.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { RootElement } from '../root-element/root-element.js';

@customElement('demo-app')
export class DemoApp extends RootElement {
  public static override styles = [
    css`
    :host {
      display: block;
    }
    :host > * + * {
      margin: 16px 0 0;
    }

    * {
      box-sizing: border-box;
    }

    app-date-picker,
    app-date-picker-input {
      background-color: #fcfcfc;
    }

    app-date-picker-input {
      --mdc-text-field-fill-color: #fcfcfc;
    }
    `,
  ];

  protected override render() {
    return html`
    <app-date-picker
      min="1970-01-01"
      .max=${'2020-02-02'}
      .value=${'2020-02-02' as never}
    ></app-date-picker>

    <app-date-picker
      .min=${'1970-01-01'}
    ></app-date-picker>

    <app-date-picker-input
      .label=${'DOB'}
      ?outlined=${true}
      .placeholder=${'Select your date of birth'}
      .value=${'2020-02-02'}
    ></app-date-picker-input>

    <!-- <app-date-picker-input></app-date-picker-input> -->
    <!-- <app-datepicker-dialog class="datepicker-dialog"></app-datepicker-dialog> -->
    <!-- <button class="open-btn" type="button">Open datepicker</button> -->
    `;
  }
}
