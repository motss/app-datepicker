import '../date-picker-dialog/app-date-picker-dialog.js';
import '../date-picker-input/app-date-picker-input.js';
import '../date-picker/app-date-picker.js';

import { css, html } from 'lit';
import { customElement, queryAsync } from 'lit/decorators.js';

import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import type { AppDatePickerDialog } from '../date-picker-dialog/app-date-picker-dialog.js';
import { appDatePickerDialogName } from '../date-picker-dialog/constants.js';
import type { AppDatePickerInput } from '../date-picker-input/app-date-picker-input.js';
import { appDatePickerInputName } from '../date-picker-input/constants.js';
import { RootElement } from '../root-element/root-element.js';
import type { CustomEventDetail } from '../typings.js';

@customElement('demo-app')
export class DemoApp extends RootElement {
  @queryAsync(appDatePickerDialogName) dialog!: Promise<AppDatePickerDialog>;
  @queryAsync(appDatePickerInputName) input!: Promise<AppDatePickerInput>;

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
      id="datePicker1"
      min="1970-01-01"
      .max=${'2020-02-02'}
      .value=${'2020-02-02' as never}
      @date-updated=${this.#dateUpdated}
    ></app-date-picker>

    <app-date-picker
      id="datePicker2"
      .min=${'1970-01-01'}
      @date-updated=${this.#dateUpdated}
    ></app-date-picker>

    <app-date-picker-input
      ?outlined=${true}
      .label=${'DOB'}
      .placeholder=${'Select your date of birth'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .value=${'2020-02-02'}
    ></app-date-picker-input>

    <button @click=${this.#showDialog}>Open</button>
    <app-date-picker-dialog></app-date-picker-dialog>

    <!-- <app-date-picker-input></app-date-picker-input> -->
    <!-- <app-datepicker-dialog class="datepicker-dialog"></app-datepicker-dialog> -->
    <!-- <button class="open-btn" type="button">Open datepicker</button> -->
    `;
  }

  async #showDialog() {
    const dialog = await this.dialog;

    dialog?.show();
  }

  #dateUpdated({
    detail,
    currentTarget,
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>): void {
    const { id } = currentTarget as AppDatePicker;

    console.debug({
      id,
      detail,
    });
  }
}
