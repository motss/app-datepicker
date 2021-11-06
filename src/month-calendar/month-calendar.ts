import type { TemplateResult } from 'lit';
import { html, LitElement , nothing} from 'lit';
import { property, queryAsync } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { navigationKeySetGrid } from '../constants.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { focusElement } from '../helpers/focus-element.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { Formatters, InferredFromSet } from '../typings.js';
import { monthCalendarStyling } from './stylings.js';
import type { MonthCalendarData, MonthCalendarProperties } from './typings.js';

export class MonthCalendar extends LitElement implements MonthCalendarProperties {
  @property({ attribute: false })
  public data?: MonthCalendarData;

  @queryAsync('.calendar-day[aria-selected="true"]')
  public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  /**
   * NOTE(motss): This is required to avoid selected date being focused on each update.
   * Selected date should ONLY be focused during navigation with keyboard, e.g.
   * initial render, switching between views, etc.
   */
  #shouldFocusSelectedDate = false;

  public static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static override styles = [
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

  protected override shouldUpdate(): boolean {
    return this.data != null && this.data.formatters != null;
  }

  protected override async updated(): Promise<void> {
    if (this.#shouldFocusSelectedDate) {
      await focusElement(this.selectedCalendarDay);
      this.#shouldFocusSelectedDate = false;
    }
  }

  protected override render(): TemplateResult | typeof nothing {
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
    } = this.data as MonthCalendarData;

    let calendarContent: TemplateResult | typeof nothing = nothing;

    if (calendar.length) {
      const id = this.id;

      const { longMonthYearFormat } = formatters as Formatters;
      const calendarCaptionId = `calendar-caption-${id}`;
      const [, [, secondMonthSecondCalendarDay]] = calendar;
      const secondMonthSecondCalendarDayFullDate = secondMonthSecondCalendarDay.fullDate;
      /**
       * NOTE(motss): Tabbable date is the date to be tabbed when switching between months.
       * When there is a selected date in the current month, tab to focus on selected date.
       * Otherwise, set the first day of month tabbable so that tapping on Tab focuses that.
       */
      const tabbableDate = isInCurrentMonth(date, currentDate) ?
        date :
        toNextSelectedDate({
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
          showCaption && secondMonthSecondCalendarDayFullDate ? html`
          <caption id=${calendarCaptionId}>
            <div class=calendar-caption part=caption>${
              longMonthYearFormat(secondMonthSecondCalendarDayFullDate)
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
                    class="calendar-day week-number"
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

                return html`
                <td
                  tabindex=${shouldTab ? '0' : '-1'}
                  class="calendar-day ${classMap({ 'day--today': +todayDate === curTime })}"
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

    if (ev.type === 'keydown') {
      const key = (ev as KeyboardEvent).key as InferredFromSet<typeof navigationKeySetGrid>;

      if (!navigationKeySetGrid.has(key)) return;

      // Stop scrolling with arrow keys
      ev.preventDefault();

      const {
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        max,
        min,
      } = this.data as MonthCalendarData;

      newSelectedDate = toNextSelectedDate({
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key,
        maxTime: +max,
        minTime: +min,
      });

      this.#shouldFocusSelectedDate = true;
    } else if (ev.type === 'click') {
      const selectedCalendarDay =
        toClosestTarget<HTMLTableCellElement>(ev, '.calendar-day');

      /** NOTE: Required condition check else these will trigger unwanted re-rendering */
      if (
        selectedCalendarDay == null ||
        [
          'aria-disabled',
          'aria-hidden',
          'aria-selected',
        ].some(
          attrName =>
            selectedCalendarDay.getAttribute(attrName) === 'true'
        )
      ) {
        return;
      }

      newSelectedDate = selectedCalendarDay.fullDate;
    }

    if (newSelectedDate == null) return;

    dispatchCustomEvent(this, 'date-updated', {
      isKeypress: ev.type === 'keydown',
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
