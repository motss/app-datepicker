import '../date-picker/app-date-picker.js';

import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('demo-app')
export class DemoApp extends LitElement {
  public static override styles = [
    css`
    * {
      display: block;
      box-sizing: border-box;
    }

    app-date-picker {
      background-color: #f5f5f5;
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

    <!-- <app-date-picker-input></app-date-picker-input> -->
    <!-- <app-datepicker-dialog class="datepicker-dialog"></app-datepicker-dialog> -->
    <!-- <button class="open-btn" type="button">Open datepicker</button> -->
    `;
  }
}
