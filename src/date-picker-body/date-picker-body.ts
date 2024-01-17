import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';

import { splitString } from '../helpers/split-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import type { DatePickerProperties } from '../typings.js';
import { datePickerBodyName } from './constants.js';

@customElement(datePickerBodyName)
export class DatePickerBody extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerProperties {
  #onMenuButtonClick = () => {};

  #onNextIconButtonClick = () => {};

  #onPrevIconButtonClick = () => {};

  protected override render() {
    const {
      chooseMonthLabel,
      chooseYearLabel,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      nextMonthLabel,
      previousMonthLabel,
      selectDataLabel,
      selectedDateLabel,
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      todayLabel,
      toyearLabel,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    // fixme: consiume these
    ({
      chooseMonthLabel,
      chooseYearLabel,
      nextMonthLabel,
      previousMonthLabel,
      selectDataLabel,
      selectedYearLabel,
      toyearLabel,
    });

    const date = value ? new Date(value) : toResolvedDate();
    const formatters = toFormatters(locale);
    const { dayFormat, fullDateFormat, longMonthYearFormat, longWeekdayFormat, narrowWeekdayFormat } = formatters;
    const {
      calendar: calendarData,
    } = calendar({
      date,
      dayFormat,
      disabledDates: splitString(disabledDates, toResolvedDate),
      disabledDays: splitString(disabledDays, Number),
      firstDayOfWeek: 0,
      fullDateFormat,
      locale,
      max: max ? new Date(max) : undefined,
      min: min ? new Date(min) : undefined,
      showWeekNumber,
      weekNumberTemplate,
      weekNumberType,
    });

    return html`
    <div class=body>
      <date-picker-body-menu
        .menuText=${longMonthYearFormat(date)}
        .onMenuButtonClick=${this.#onMenuButtonClick}
        .onNextIconButtonClick=${this.#onNextIconButtonClick}
        .onPrevIconButtonClick=${this.#onPrevIconButtonClick}
      ></date-picker-body-menu>
      <app-calendar
        .data=${{
          calendar: calendarData,
          currentDate: toResolvedDate(),
          date: toResolvedDate(),
          disabledDatesSet: new Set(),
          disabledDaysSet: new Set(),
          formatters,
          max: toResolvedDate(),
          min: toResolvedDate(),
          selectedDateLabel,
          showWeekNumber,
          todayDate: toResolvedDate(),
          todayLabel,
          weekdays: getWeekdays({
            firstDayOfWeek,
            longWeekdayFormat,
            narrowWeekdayFormat,
            shortWeekLabel,
            showWeekNumber,
            weekLabel,
          }),
        }}
      ></app-calendar>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerBodyName]: DatePickerBody;
  }
}
