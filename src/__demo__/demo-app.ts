import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../components/app-calendar/app-calendar.js';
import '../components/docked-date-picker/docked-date-picker.js';
import '../components/modal-date-picker/modal-date-picker.js';

import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { renderCalendarDay } from '../components/app-calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../components/app-calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../components/app-calendar/types.js';
import type { ModalDatePicker } from '../components/modal-date-picker/modal-date-picker.js';
import {
  labelChooseMonth,
  labelChooseYear,
  labelNextMonth,
  labelPreviousMonth,
  labelSelectDate,
  labelSelectedDate,
  labelSelectedYearTemplate,
  labelShortWeek,
  labelToday,
  labelToyearTemplate,
  labelWeek,
  labelWeekNumberTemplate,
} from '../constants.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { RootElement } from '../root-element/root-element.js';

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

  #$modalDatePicker = createRef<ModalDatePicker>();

  #debugCustomEvent = (ev: CustomEvent<object>) => {
    console.debug('debug:custom-event', ev);
  };

  #onClosed = (ev: CustomEvent<object>) => {
    this.#debugCustomEvent(ev);

    const value = this.#$modalDatePicker.value?.value;

    this._modalDatePickerValue = value ?? '';
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({ data }) => {
    return renderCalendarDay({
      data,
      selectedDate: new Date(),
      tabbableDate: new Date(),
      todayDate: new Date(),
    });
  };

  #renderWeekday: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  @state() _datePickerCalendarFocusedDate: Date = toResolvedDate();

  @state() _datePickerCalendarValue: string = toDateString(toResolvedDate());

  @state() _editable = false;

  @state() _modalDatePickerValue = '';

  @state() _outlined = false;

  locale = 'en-US';

  protected override firstUpdated(
    _changedProperties: Map<number | string | symbol, unknown>
  ): void {
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
    return html`
    <div>
      <section>
        <div class=io>
          <label for=modalDatePicker>Selected date:</label>
          <input
            id=modalDatePicker
            type=text
            value=${this._modalDatePickerValue}
            placeholder="Select a date"
          />
          <md-outlined-button @click=${async () => {
            await this.#$modalDatePicker.value?.reset();
            await this.#$modalDatePicker.value?.show();
          }}>Show ModalDatePicker</md-outlined-button>
        </div>

        <div class=comp>
          <modal-date-picker
            ${ref(this.#$modalDatePicker)}
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
            .selectedYearTemplate=${labelSelectedYearTemplate}
            .shortWeekLabel=${labelShortWeek}
            .showWeekNumber=${false}
            .startView=${'calendar'}
            .todayLabel=${labelToday}
            .toyearTemplate=${labelToyearTemplate}
            .value=${'2020-05-05'}
            .weekLabel=${labelWeek}
            .weekNumberTemplate=${labelWeekNumberTemplate}
            .weekNumberType=${'first-4-day-week'}
            @cancel=${this.#debugCustomEvent}
            @close=${this.#debugCustomEvent}
            @closed=${this.#onClosed}
            @open=${this.#debugCustomEvent}
            @opened=${this.#debugCustomEvent}
          ></modal-date-picker>
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
            @closing=${this.#debugCustomEvent}
            @closed=${this.#debugCustomEvent}
            @opening=${this.#debugCustomEvent}
            @opened=${this.#debugCustomEvent}
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
          <input id=modalDatePicker type=text readonly value=${
            this._datePickerCalendarValue
          } />
          <hr />
          <label for=modalDatePicker>Focused date:</label>
          <input id=modalDatePicker type=text readonly value=${toDateString(
            this._datePickerCalendarFocusedDate
          )} />
        </div>

        <div class=comp>
          <app-calendar
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
            .selectedYearTemplate=${labelSelectedYearTemplate}
            .shortWeekLabel=${labelShortWeek}
            .showWeekNumber=${false}
            .startView=${'calendar'}
            .todayLabel=${labelToday}
            .renderWeekDay=${this.#renderWeekday}
            .renderCalendarDay=${this.#renderCalendarDay}
            .toyearTemplate=${labelToyearTemplate}
            .value=${this._datePickerCalendarValue}
            .weekLabel=${labelWeek}
            .weekNumberTemplate=${labelWeekNumberTemplate}
            .weekNumberType=${'first-4-day-week'}
          ></app-calendar>
        </div>
      </section>
    </div>
    `;
  }
}
