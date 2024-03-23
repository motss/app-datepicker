import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../components/date-picker-calendar/date-picker-calendar.js';
import '../components/docked-date-picker/docked-date-picker.js';
import '../components/modal-date-picker/modal-date-picker.js';

import { styles as MdTypeScaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import type { ModalDatePicker } from '../components/modal-date-picker/modal-date-picker.js';
import { labelChooseMonth, labelChooseYear, labelNextMonth, labelPreviousMonth, labelSelectDate, labelSelectedDate, labelShortWeek, labelToday, labelWeek, selectedYearTemplate, toyearTemplate, weekNumberTemplate } from '../constants.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { iconEdit } from '../icons.js';
import { RootElement } from '../root-element/root-element.js';

@customElement('demo-app')
export class DemoApp extends RootElement {
  public static override styles = [
    MdTypeScaleStyles,
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

    .io {
      display: grid;
      grid-auto-flow: row dense;
      align-items: baseline;
      grid-template-columns: repeat(auto-fit, minmax(1px, max-content));
      gap: 0 8px;
    }

    .io > * {
      width: fit-content;
    }

    @media (prefers-color-scheme: dark) {
      app-date-picker {
        border-color: #fff;
      }
    }
    `,
  ];

  #datePickerRef: Ref<ModalDatePicker> = createRef();

  #debugCustomEvent = (ev: CustomEvent<object>) => {
    console.debug('debug:custom-event', ev);
  };

  #selectedDate_modalDatePicker: string = '';

  @state() _datePickerCalendarFocusedDate: Date = toResolvedDate();
  @state() _datePickerCalendarValue: string = toDateString(toResolvedDate());

  @state() _editable = false;

  @state() _outlined = false;

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
    <div>
      <section>
        <div class=io>
          <label for=modalDatePicker>Selected date:</label>
          <input id=modalDatePicker type=text value=${this.#selectedDate_modalDatePicker} placeholder="Select a date" />
          <md-outlined-button @click=${async () => {
        await this.#datePickerRef.value?.reset();
        await this.#datePickerRef.value?.show();
      }}>Show ModalDatePicker</md-outlined-button>
        </div>

        <div class=comp>
          <modal-date-picker
            ${ref(this.#datePickerRef)}
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
            .value=${'2020-05-05'}
            .weekLabel=${labelWeek}
            .weekNumberTemplate=${weekNumberTemplate}
            .weekNumberType=${'first-4-day-week'}
            .onDateUpdate=${(d: Date) => {
        this.#selectedDate_modalDatePicker = toDateString(d);
        this.requestUpdate();
        console.debug('ondateupdate', d);
      }}
            @cancel=${this.#debugCustomEvent}
            @close=${this.#debugCustomEvent}
            @closed=${this.#debugCustomEvent}
            @open=${this.#debugCustomEvent}
            @opened=${this.#debugCustomEvent}
          >
            modal date picker
          </modal-date-picker>
        </div>
      </section>
    </div>

    <div>
      <section>
        <div class=io>
          <md-outlined-text-field
            label=${'Select date'}
            value=${'2020-05-05'}
          ></md-outlined-text-field>
          <docked-date-picker
            label=${'Select date'}
            value=${'2020-05-05'}
          ></docked-date-picker>
        </div>

        <div class=comp></div>
      </section>
    </div>

    <div>
      <section>
        <div class=io>
          <label for=modalDatePicker>Selected date:</label>
          <input id=modalDatePicker type=text readonly value=${this._datePickerCalendarValue} />
          <hr />
          <label for=modalDatePicker>Focused date:</label>
          <input id=modalDatePicker type=text readonly value=${toDateString(this._datePickerCalendarFocusedDate)} />
        </div>

        <div class=comp>
          <date-picker-calendar
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
            .value=${this._datePickerCalendarValue}
            .weekLabel=${labelWeek}
            .weekNumberTemplate=${weekNumberTemplate}
            .weekNumberType=${'first-4-day-week'}
            .onDateUpdate=${(d: Date) => {
        console.debug('datePickerCalendar:onDateUpdate', d);
        this._datePickerCalendarValue = toDateString(d);
      }}
            .onFocusedDateUpdate=${(d: Date) => {
        console.debug('datePickerCalendar:onFocusedDateUpdate', d);
        this._datePickerCalendarFocusedDate = d;
      }}
          >
            modal date picker
          </date-picker-calendar>
        </div>
      </section>
    </div>
${'' && `
<hr />

<modal-date-picker-header
  .headline=${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', weekday: 'short' }).format(new Date())}
  .iconButton=${iconEdit}
  .onHeadlineClick=${(ev: MouseEvent) => console.debug('headline:click', ev)}
  .onIconButtonClick=${(ev: MouseEvent) => console.debug('iconButton:click', ev)}
></modal-date-picker-header>
<modal-date-picker-body-menu
  .menuText=${longMonthYearFormat(date)}
  .onMenuButtonClick=${(ev: MouseEvent) => console.debug('menubutton:click', ev)}
  .onNextIconButtonClick=${(ev: MouseEvent) => console.debug('nexticonbutton:click', ev)}
  .onPrevIconButtonClick=${(ev: MouseEvent) => console.debug('previconbutton:click', ev)}
></modal-date-picker-body-menu>

<hr />

<div style="max-height:300px;overflow:auto;">
  <year-grid
    locale=${'en-US'}
    max=${''}
    min=${''}
    value=${new Date().toISOString()}
  ></year-grid>
</div>

<modal-date-picker-input>
  <p>loading...</p>
</modal-date-picker-input>
`}
    `;
  }
}
