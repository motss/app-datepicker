import { property } from '@lit/reactive-element/decorators/property.js';
import { queryAsync } from '@lit/reactive-element/decorators/query-async.js';
import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { navigationKeySetGrid } from '../constants.js';
import { computeNextSelectedDate } from '../helpers/compute-next-selected-date.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { isInTargetMonth } from '../helpers/is-in-current-month.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { InferredFromSet } from '../typings.js';
import { monthCalendarStyling } from './stylings.js';
import type { MonthCalendarData, MonthCalendarProperties } from './typings.js';

export class MonthCalendar extends LitElement implements MonthCalendarProperties {
  @property({ attribute: false })
  public data: MonthCalendarData;

  @queryAsync('.calendar-day[aria-selected="true"]')
  public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  /**
   * NOTE(motss): This is required to avoid selected date being focused on each update.
   * Selected date should ONLY be focused during navigation with keyboard.
   */
  #shouldFocusSelectedDate = false;

  public static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static styles = [
    baseStyling,
    resetShadowRoot,
    monthCalendarStyling,
  ];

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

  protected shouldUpdate(): boolean {
    return this.data.formatters != null;
  }

  protected async updated(): Promise<void> {
    if (this.#shouldFocusSelectedDate) {
      const selectedCalendarDay = await this.selectedCalendarDay;

      if (selectedCalendarDay) {
        selectedCalendarDay.focus();
      }

      this.#shouldFocusSelectedDate = false;
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const {
      calendar,
      date,
      disabledDatesSet,
      disabledDaysSet,
      currentDate,
      max,
      min,
      showCaption = false,
      showWeekNumber = false,
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
      /**
       * NOTE(motss): Tabbable date is the date to be tabbed when switching between months.
       * When there is a selected date in the current month, tab to focus on selected date.
       * Otherwise, set the first day of month tabbable so that tapping on Tab focuses that.
       */
      const tabbableDate = isInTargetMonth(date, currentDate) ?
        date :
        computeNextSelectedDate({
          currentDate,
          date,
          disabledDatesSet,
          disabledDaysSet,
          hasAltKey: false,
          key: keyHome,
          maxTime: +max,
          minTime: +min,
        });

      calendarContent = html`
      <table
        class=calendar-table
        part=table
        role=grid
        aria-labelledby=${calendarCaptionId}
        @click=${this.#updateSelectedDate}
        @keydown=${this.#updateSelectedDate}
        @keyup=${this.#updateSelectedDate}
      >
        ${
          showCaption ? html`
          <caption id=${calendarCaptionId}>
            <div class=calendar-caption part=caption>${
              secondMonthSecondCalendarDayFullDate ?
                longMonthYearFormat(secondMonthSecondCalendarDayFullDate) :
                ''
            }</div>
          </caption>
          ` : nothing
        }

        <thead>
          <tr class=weekdays part=weekdays role=row>${
            weekdays.map(
              weekday => html`
              <th
                class=weekday
                part=weekday
                role=columnheader
                aria-label=${weekday.label}
              >
                <div class=weekday-value part=weekday-value>${weekday.value}</div>
              </th>`
            )
          }</tr>
        </thead>

        <tbody>${
          calendar.map((calendarRow) => {
            return html`
            <tr role=row>${
              calendarRow.map((calendarCol, i) => {
                const { disabled, fullDate, label, value } = calendarCol;

                /** Week label, if any */
                if (!fullDate && value && showWeekNumber && i < 1) {
                  return html`<th
                    class="calendar-day weekday-label"
                    part=calendar-day
                    scope=row
                    role=rowheader
                    abbr=${label}
                    aria-label=${label}
                  >${value}</th>`;
                }
                /** Empty day */
                if (!value || !fullDate) {
                  return html`<td class="calendar-day day--empty" aria-hidden="true" part=calendar-day></td>`;
                }
                const curTime = +new Date(fullDate);
                const isSelectedDate = +date === curTime;
                const shouldTab = tabbableDate.getUTCDate() === Number(value);
                /** NOTE: lit-plugin does not like this */
                const calendarDayClasses = classMap({
                  'calendar-day': true,
                  'day--today': +todayDate === curTime,
                }) as unknown as string;

                return html`
                <td
                  tabindex=${shouldTab ? '0' : '-1'}
                  class=${calendarDayClasses}
                  part=calendar-day
                  role=gridcell
                  aria-disabled=${disabled ? 'true' : 'false'}
                  aria-label=${label}
                  aria-selected=${isSelectedDate ? 'true' : 'false'}
                  data-day=${value}
                  .fullDate=${fullDate}
                >
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

  #updateSelectedDate = (ev: MouseEvent | KeyboardEvent): void => {
    let newSelectedDate: Date | undefined = undefined;

    if (['keydown', 'keyup'].includes(ev.type)) {
      const key = (ev as KeyboardEvent).key as InferredFromSet<typeof navigationKeySetGrid>;

      if (
        !(ev.type === 'keydown' && navigationKeySetGrid.has(key))
      ) return;

      // Stop scrolling with arrow keys
      ev.preventDefault();

      const {
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        max,
        min,
      } = this.data;

      newSelectedDate = isInTargetMonth(date, currentDate) ?
        computeNextSelectedDate({
          currentDate,
          date,
          disabledDatesSet,
          disabledDaysSet,
          hasAltKey: ev.altKey,
          key,
          maxTime: +max,
          minTime: +min,
        }) :
        currentDate;
        this.#shouldFocusSelectedDate = true;
    } else {
      const selectedCalendarDay = toClosestTarget<HTMLTableCellElement>(ev, '.calendar-day');

      /** NOTE: Required condition check else these will trigger unwanted re-rendering */
      if (
        selectedCalendarDay == null ||
        [
          'day--empty',
          'day--disabled',
          'day--focused',
          'weekday-label',
        ].some(className => selectedCalendarDay.classList.contains(className))
      ) {
        return;
      }

      newSelectedDate = selectedCalendarDay.fullDate;
    }

    if (newSelectedDate == null) return;

    dispatchCustomEvent(this, 'date-updated', {
      isKeypress: false,
      value: new Date(newSelectedDate),
    });
  };
}

declare global {
  // #region HTML element type extensions
  // interface HTMLButtonElement {
  //   year: number;
  // }

  // interface HTMLElement {
  //   part: HTMLElementPart;
  // }

  interface HTMLTableCellElement {
    day: string;
    fullDate: Date;
  }
  // #endregion HTML element type extensions

}
