// import '../date-picker/app-date-picker.js';
// import '../date-picker-input-2/app-date-picker-input.js';
// import '../date-picker-input/date-picker-input.js';
// import '../date-picker-dialog/app-date-picker-dialog.js';
import '../date-picker-input-surface/app-date-picker-input-surface.js';
import '@material/web/dialog/dialog.js';
import '../modal-date-picker-header/modal-date-picker-header.js';
import '../date-picker-body/date-picker-body.js';
import '../modal-date-picker-body-menu/modal-date-picker-body-menu.js';
import '../modal-date-picker-footer/modal-date-picker-footer.js';
import '../calendar/app-calendar.js';
import '../year-grid/year-grid.js';

import { css, html } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';

import { labelChooseMonth, labelChooseYear, labelNextMonth, labelPreviousMonth, labelSelectDate, labelSelectedDate, labelShortWeek, labelToday, labelWeek, selectedYearTemplate, toyearTemplate, weekNumberTemplate } from '../constants.js';
import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import type { AppDatePickerDialog } from '../date-picker-dialog/app-date-picker-dialog.js';
import type { AppDatePickerDialogBase } from '../date-picker-dialog/app-date-picker-dialog-base.js';
import { appDatePickerDialogBaseName, appDatePickerDialogName } from '../date-picker-dialog/constants.js';
import type { AppDatePickerInput } from '../date-picker-input-2/app-date-picker-input.js';
import { appDatePickerInputName } from '../date-picker-input-2/constants.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { iconEdit } from '../icons.js';
import { RootElement } from '../root-element/root-element.js';
import type { CustomEventDetail } from '../typings.js';

@customElement('demo-app')
export class DemoApp extends RootElement {
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

  #dateUpdated = ({
    currentTarget,
    detail,
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>): void => {
    const { id } = currentTarget as AppDatePicker;

    console.debug({
      detail,
      id,
    });
  };
  #showDialog = async (ev: MouseEvent) => {
    const { dataset } = ev.currentTarget as HTMLButtonElement;
    const dialog = this.query<AppDatePickerDialog>(`#${dataset.id}`);
    const task = globalThis.customElements.whenDefined(appDatePickerDialogName);

    await import('../date-picker-dialog/app-date-picker-dialog.js');
    await task;

    dialog?.show();

    console.debug(dialog);
    console.debug(`Dialog #${dataset.id}`, {
      value: dialog?.value,
      valueAsDate: dialog?.valueAsDate,
      valueAsNumber: new Date(dialog?.valueAsNumber as number),
    });
  };

  @state() _editable = false;
  @state() _outlined = false;
  @queryAsync(appDatePickerDialogName) dialog!: Promise<AppDatePickerDialog>;

  @queryAsync(appDatePickerDialogBaseName) dialogBase!: Promise<AppDatePickerDialogBase>;

  @queryAsync(appDatePickerInputName) input!: Promise<AppDatePickerInput>;

  locale: string = 'en-US';

  protected override firstUpdated(_changedProperties: Map<number | string | symbol, unknown>): void {
    Object.defineProperty(globalThis, '__demoApp', {
      value: {
        datePicker1: this.query('#datePicker1'),
        datePicker2: this.query('#datePicker2'),
        datePickerDialog1: this.query('#datePickerDialog1'),
        datePickerInput1: this.query('#datePickerInput1'),
      },
    });
  }

  protected override render() {
    const date = new Date();
    const formatters = toFormatters(this.locale);
    const { longMonthYearFormat } = formatters;
    // const showWeekNumber = false;
    // const dayFormat = new Intl.DateTimeFormat(this.locale, { day: 'numeric' });
    // const fullDateFormat = new Intl.DateTimeFormat(this.locale, {
    //   day: 'numeric',
    //   month: 'short',
    //   weekday: 'short',
    //   year: 'numeric',
    // });
    // const {
    //   datesGrid,
    // } = calendar({
    //   date,
    //   dayFormat,
    //   disabledDates: splitString('', toResolvedDate),
    //   disabledDays: splitString('', Number),
    //   firstDayOfWeek: 0,
    //   fullDateFormat,
    //   locale: this.locale,
    //   max: undefined,
    //   min: undefined,
    //   showWeekNumber,
    //   weekNumberTemplate: 'Week %s',
    //   weekNumberType: undefined,
    // });

    return html`
    <div style="width:calc(48px * 7 + 12px * 2);">
      <date-picker-header
        .headline=${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', weekday: 'short' }).format(new Date())}
        .iconButton=${iconEdit}
        .onHeadlineClick=${(ev: MouseEvent) => console.debug('headline:click', ev)}
        .onIconButtonClick=${(ev: MouseEvent) => console.debug('iconButton:click', ev)}
      ></date-picker-header>
      <date-picker-body-menu
        .menuText=${longMonthYearFormat(date)}
        .onMenuButtonClick=${(ev: MouseEvent) => console.debug('menubutton:click', ev)}
        .onNextIconButtonClick=${(ev: MouseEvent) => console.debug('nexticonbutton:click', ev)}
        .onPrevIconButtonClick=${(ev: MouseEvent) => console.debug('previconbutton:click', ev)}
      ></date-picker-body-menu>
      <date-picker-footer
        .confirmText=${'OK'}
        .denyText=${'Cancel'}
        .onConfirmClick=${(ev: MouseEvent) => console.debug('confirm:click', ev)}
        .onDenyClick=${(ev: MouseEvent) => console.debug('deny:click', ev)}
      ></date-picker-footer>

      <hr />

      <date-picker-body
        .chooseMonthLabel=${labelChooseMonth}
        .chooseYearLabel=${labelChooseYear}
        .disabledDates=${''}
        .disabledDays=${''}
        .firstDayOfWeek=${0}
        .locale=${'en-US'}
        .max=${''}
        .min=${''}
        .nextMonthLabel=${labelNextMonth}
        .previousMonthLabel=${labelPreviousMonth}
        .selectDateLabel=${labelSelectDate}
        .selectedDateLabel=${labelSelectedDate}
        .selectedYearTemplate=${selectedYearTemplate}
        .shortWeekLabel=${labelShortWeek}
        .showWeekNumber=${false}
        .startView=${'calendar'}
        .todayLabel=${labelToday}
        .toyearTemplate=${toyearTemplate}
        .value=${'2020-02-02'}
        .weekLabel=${labelWeek}
        .weekNumberTemplate=${weekNumberTemplate}
        .weekNumberType=${'first-4-day-week'}
      ></date-picker-body>

      <hr />

      <div style="max-height:300px;overflow:auto;">
        <year-grid
          locale=${'en-US'}
          max=${''}
          min=${''}
          value=${new Date().toISOString()}
        ></year-grid>
      </div>
    </div>

    <date-picker-input>
      <p>loading...</p>
    </date-picker-input>

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
      id="datePicker3"
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
      id="datePickerInputOutlined1"
      .outlined=${this._outlined}
      .label=${'DOB (yearGrid)'}
      .placeholder=${'Select your date of birth'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .value=${'2020-02-02'}
      .startView=${'yearGrid'}
    ></app-date-picker-input>
    <input id=outlined1 type=checkbox .checked=${this._outlined} @input=${async () => {
        this._outlined = !this._outlined;

        const el = this.query<AppDatePickerInput>('#datePickerInputOutlined1');

        if (el) {
          /**
           * NOTE(motss): Initial render with defined `outlined` and other properties will render
           * everything correctly. However, updating any property that causes re-render will
           * render the floating label incorrectly for unknown reasons. This is the workaround to
           * always call `.layout()` manually and it cannot be done by the `DatePickerInput`
           * internally.
           */
          await el.updateComplete;
          await el.layout();
        }
      }} />
    <label for=outlined1>
      <span>Outlined</span>
    </label>

    <app-date-picker-input
      id="datePickerInputDisabled1"
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
      .label=${'Readonly DOB'}
      .max=${'2100-12-31'}
      .min=${'1970-01-01'}
      .placeholder=${'Select your date of birth'}
      .readOnly=${true}
      .startView=${'yearGrid'}
      .value=${'2020-02-02'}
      id="datePickerInputReadonly1"
    ></app-date-picker-input>

    <input type=date />

    <button data-id="datePickerDialog1" @click=${this.#showDialog}>Open</button>
    <app-date-picker-dialog id="datePickerDialog1"></app-date-picker-dialog>

    <button data-id="datePickerDialog2" @click=${this.#showDialog}>Open with optional properties</button>
    <!-- <app-date-picker-dialog
      .max=${'2022-12-31'}
      .min=${'2020-01-01'}
      .value=${'2020-02-02'}
      id="datePickerDialog2"
    ></app-date-picker-dialog> -->
    <md-dialog id="datePickerDialog2" style="width:256px;margin:auto;">
      <!-- todo: add WebAnim to animate slotted content -->
      <form method=dialog slot=content id="formId2">
        <app-date-picker style="padding:0;background-color:rgba(0,0,0,0);border: none;"></app-date-picker>
      </form>
      <div slot=actions>
        <button form=formId2 value=cancel>cancel</button>
        <button form=formId2 value=set>set</button>
      </div>
    </md-dialog>
    `;
  }
}
