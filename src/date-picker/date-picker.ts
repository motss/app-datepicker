import { calendar } from '@ipohjs/calendar';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { html } from 'lit';

import { splitString } from '../helpers/split-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { iconEdit } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import type { DatePickerProperties } from '../typings.js';

export class DatePicker extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerProperties {
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

    // fixme: consume these
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
    const { dayFormat, fullDateFormat, longWeekdayFormat, narrowWeekdayFormat } = formatters;
    const {
      datesGrid,
      disabledDatesSet,
      disabledDaysSet,
      key,
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
    <date-picker-header
      .headline=${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', weekday: 'short' }).format(new Date())}
      .iconButton=${iconEdit}
      .onHeadlineClick=${(ev: MouseEvent) => console.debug('headline:click', ev)}
      .onIconButtonClick=${(ev: MouseEvent) => console.debug('iconButton:click', ev)}
    ></date-picker-header>
    <date-picker-body
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
      chooseMonthLabel=${chooseMonthLabel}
      chooseMonthLabel=${chooseMonthLabel}
    ></date-picker-body>
    <date-picker-footer
      .confirmText=${'OK'}
      .denyText=${'Cancel'}
      .onConfirmClick=${(ev: MouseEvent) => console.debug('confirm:click', ev)}
      .onDenyClick=${(ev: MouseEvent) => console.debug('deny:click', ev)}
    ></date-picker-footer>
    `;
  }
}
