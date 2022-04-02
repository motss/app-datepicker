import '../date-picker/app-date-picker.js';
import '../date-picker-input/app-date-picker-input.js';

// import '../date-picker-dialog/app-date-picker-dialog.js';
// import '../date-picker-input-surface/app-date-picker-input-surface.js';
import { css, html } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';

import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import type { AppDatePickerDialog } from '../date-picker-dialog/app-date-picker-dialog.js';
import type { AppDatePickerDialogBase } from '../date-picker-dialog/app-date-picker-dialog-base.js';
import { appDatePickerDialogBaseName, appDatePickerDialogName } from '../date-picker-dialog/constants.js';
import type { AppDatePickerInput } from '../date-picker-input/app-date-picker-input.js';
import { appDatePickerInputName } from '../date-picker-input/constants.js';
import { RootElement } from '../root-element/root-element.js';
import type { CustomEventDetail } from '../typings.js';

@customElement('demo-app')
export class DemoApp extends RootElement {
  @state() _outlined = false;

  @queryAsync(appDatePickerDialogName) dialog!: Promise<AppDatePickerDialog>;
  @queryAsync(appDatePickerDialogBaseName) dialogBase!: Promise<AppDatePickerDialogBase>;
  @queryAsync(appDatePickerInputName) input!: Promise<AppDatePickerInput>;

  public static override styles = [
    css`
    :host {
      display: block;

      padding-bottom: 999px;
    }
    :host > * + * {
      margin: 16px 0 0;
    }

    * {
      box-sizing: border-box;
    }

    app-date-picker {
      border: 1px solid #000;
    }
    /* app-date-picker::part(today),
    app-date-picker::part(today)::before,
    app-date-picker::part(toyear)::before {
      color: red;
    } */

    @media (prefers-color-scheme: dark) {
      app-date-picker {
        border-color: #fff;
      }
    }
    `,
  ];

  protected override firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
      Object.defineProperty(globalThis, '__demoApp', {
        value: {
          datePicker1: this.query('#datePicker1'),
          datePicker2: this.query('#datePicker2'),
          datePickerInput1: this.query('#datePickerInput1'),
          datePickerDialog1: this.query('#datePickerDialog1'),
        },
      });
  }

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

    <app-date-picker
      id="datePicker2"
      .min=${'1970-01-01'}
      @date-updated=${this.#dateUpdated}
      showWeekNumber
    ></app-date-picker>

    <app-date-picker-input
      id="datePickerInput1"
      ?outlined=${true}
      .label=${'DOB'}
      .placeholder=${'Select your date of birth'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .value=${'2020-02-02'}
    ></app-date-picker-input>

    <app-date-picker-input
      id="datePickerInput1"
      ?outlined=${true}
      .label=${'DOB (yearGrid)'}
      .placeholder=${'Select your date of birth'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .value=${'2020-02-02'}
      .startView=${'yearGrid'}
    ></app-date-picker-input>

    <app-date-picker-input
      id="datePickerInput1"
      ?outlined=${true}
      .label=${'Disabled DOB'}
      .placeholder=${'Select your date of birth'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .value=${'2020-02-02'}
      .startView=${'yearGrid'}
      .disabled=${true}
    ></app-date-picker-input>

    <app-date-picker-input
      ?outlined=${this._outlined}
      .label=${'Readonly DOB'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .placeholder=${'Select your date of birth'}
      .readOnly=${true}
      .startView=${'yearGrid'}
      .value=${'2020-02-02'}
      id="datePickerInput1"
    ></app-date-picker-input>
    <input id=outlined1 type=checkbox .checked=${this._outlined} @input=${() => {
      this._outlined = !this._outlined;
    }} />
    <label for=outlined1>
      <span>Outlined</span>
    </label>

    <button data-id="datePickerDialog1" @click=${this.#showDialog}>Open</button>
    <app-date-picker-dialog id="datePickerDialog1"></app-date-picker-dialog>

    <button data-id="datePickerDialog2" @click=${this.#showDialog}>Open with optional properties</button>
    <app-date-picker-dialog
      .max=${'2022-12-31'}
      .min=${'2020-01-01'}
      .value=${'2020-02-02'}
      id="datePickerDialog2"
    ></app-date-picker-dialog>
    `;
  }

  #showDialog = async (ev: MouseEvent) => {
    const { dataset } = ev.currentTarget as HTMLButtonElement;
    const dialog = this.query<AppDatePickerDialog>(`#${dataset.id}`);
    const task = globalThis.customElements.whenDefined(appDatePickerDialogName);

    await import('../date-picker-dialog/app-date-picker-dialog.js');
    await task;

    dialog?.show();

    console.debug(`Dialog #${dataset.id}`, {
      value: dialog?.value,
      valueAsDate: dialog?.valueAsDate,
      valueAsNumber: new Date(dialog?.valueAsNumber as number),
    });
  };

  #dateUpdated = ({
    detail,
    currentTarget,
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>): void => {
    const { id } = currentTarget as AppDatePicker;

    console.debug({
      id,
      detail,
    });
  };
}
