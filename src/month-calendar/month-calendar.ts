import { property } from '@lit/reactive-element/decorators/property.js';
import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { keyCodesRecord } from '../constants.js';
import { computeNextFocusedDate } from '../helpers/compute-next-focused-date.js';
import { isInTargetMonth } from '../helpers/is-in-current-month.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import type { MonthCalendarData, MonthCalendarProperties } from './typings.js';

export class MonthCalendar extends LitElement implements MonthCalendarProperties {
  @property({ attribute: false })
  public data: MonthCalendarData;

  public constructor() {
    super();

    const todayDate = toResolvedDate();

    this.data = {
      calendar: [],
      date: todayDate,
      disabledDatesSet: new Set(),
      disabledDaysSet: new Set(),
      currentDate: todayDate,
      formatters: undefined,
      max: todayDate,
      min: todayDate,
      showCaption: false,
      showWeekNumber: false,
      todayDate,
      weekdays: [],
    };
  }

  protected render(): TemplateResult | typeof nothing {
    const {
      calendar,
      date,
      disabledDatesSet,
      disabledDaysSet,
      currentDate: focusedDate,
      max,
      min,
      showCaption,
      showWeekNumber,
      todayDate,
      weekdays,
      formatters,
    } = this.data;

    if (formatters == null) return nothing;

    let calendarContent: TemplateResult | typeof nothing = nothing;

    if (calendar.length) {
      const id = this.id;

      const { longMonthYearFormat } = formatters;
      const calendarCaptionId = `calendar-caption-${id}`;
      const [, [, secondMonthSecondCalendarDay]] = calendar;
      const secondMonthSecondCalendarDayFullDate = secondMonthSecondCalendarDay.fullDate;
      const $newFocusedDate: Date =
      showCaption && !isInTargetMonth(focusedDate, date) ?
        computeNextFocusedDate({
          disabledDaysSet,
          disabledDatesSet,
          hasAltKey: false,
          keyCode: keyCodesRecord.HOME,
          focusedDate: focusedDate,
          selectedDate: date,
          minTime: +min,
          maxTime: +max,
        }) :
        focusedDate;

      calendarContent = html`
      <table class="calendar-table" part="table" role="grid" aria-labelledby="${calendarCaptionId}">
        <caption id="${calendarCaptionId}">
          <div class="calendar-caption" part="caption">${
            showCaption && secondMonthSecondCalendarDayFullDate ?
              longMonthYearFormat(secondMonthSecondCalendarDayFullDate) :
              ''
          }</div>
        </caption>

        <thead>
          <tr class="weekdays" part="weekdays" role="row">${
            weekdays.map(
              weekday => html`
              <th
                class="weekday"
                part="weekday"
                role="columnheader"
                aria-label="${weekday.label}"
              >
                <div class="weekday-value" part="weekday-value">${weekday.value}</div>
              </th>`
            )
          }</tr>
        </thead>

        <tbody>${
          calendar.map((calendarRow) => {
            return html`
            <tr role="row">${
              calendarRow.map((calendarCol, i) => {
                const { disabled, fullDate, label, value } = calendarCol;

                /** Week label, if any */
                if (!fullDate && value && showWeekNumber && i < 1) {
                  return html`<th
                    class="full-calendar__day weekday-label"
                    part="calendar-day"
                    scope="row"
                    role="rowheader"
                    abbr="${label}"
                    aria-label="${label}"
                  >${value}</th>`;
                }
                /** Empty day */
                if (!value || !fullDate) {
                  return html`<td class="full-calendar__day day--empty" part="calendar-day"></td>`;
                }
                const curTime = +new Date(fullDate);
                const isCurrentDate = +focusedDate === curTime;
                const shouldTab = showCaption && $newFocusedDate.getUTCDate() === Number(value);
                return html`
                <td
                  tabindex="${shouldTab ? '0' : '-1'}"
                  class="${classMap({
                    'full-calendar__day': true,
                    'day--disabled': disabled,
                    'day--today': +todayDate === curTime,
                    'day--focused': !disabled && isCurrentDate,
                  })}"
                  part="calendar-day"
                  role="gridcell"
                  aria-disabled="${disabled ? 'true' : 'false'}"
                  aria-label="${label}"
                  aria-selected="${isCurrentDate ? 'true' : 'false'}"
                  .fullDate="${fullDate}"
                  .day="${value}"
                >
                  <div class="calendar-day" part="day">${value}</div>
                </td>
                `;
              })
            }</tr>`;
          })
        }</tbody>
      </table>
      `;
    }

    return html`<div class="month-calendar" part="calendar">${calendarContent}</div>`;
  }
}
