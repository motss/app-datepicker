import type { TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';

import { confirmKeySet, navigationKeySetGrid } from '../constants.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { focusElement } from '../helpers/focus-element.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { Formatters, InferredFromSet, SupportedKey } from '../typings.js';
import { monthCalendarStyling } from './stylings.js';
import type { MonthCalendarData, MonthCalendarProperties, MonthCalendarRenderCalendarDayInit } from './typings.js';

export class MonthCalendar extends LitElement implements MonthCalendarProperties {
  @property({ attribute: false }) public data?: MonthCalendarData;
  @queryAsync('.calendar-day[aria-selected="true"]') public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  #selectedDate: Date | undefined = undefined;
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
        @click=${this.#updateSelectedDate}
        @keydown=${this.#updateSelectedDate}
        @keyup=${this.#updateSelectedDate}
        aria-labelledby=${calendarCaptionId}
        class=calendar-table
        part=table
        role=grid
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
                const shouldTab = tabbableDate.getUTCDate() === Number(value);

                return this.$renderCalendarDay({
                  ariaDisabled: String(disabled),
                  ariaLabel: label,
                  ariaSelected: String(+date === curTime),
                  className: +todayDate === curTime ? 'day--today' : '',
                  day: value,
                  fullDate,
                  tabIndex: shouldTab ? 0 : -1,
                } as MonthCalendarRenderCalendarDayInit);
              })
            }</tr>`;
          })
        }</tbody>
      </table>
      `;
    }

    return html`<div class="month-calendar" part="calendar">${calendarContent}</div>`;
  }

  protected $renderCalendarDay({
    ariaDisabled,
    ariaLabel,
    ariaSelected,
    className,
    day,
    fullDate,
    tabIndex,
  }: MonthCalendarRenderCalendarDayInit): TemplateResult {
    return html`
    <td
      .fullDate=${fullDate}
      aria-disabled=${ariaDisabled as 'true' | 'false'}
      aria-label=${ariaLabel}
      aria-selected=${ariaSelected as 'true' | 'false'}
      class="calendar-day ${className}"
      data-day=${day}
      part=calendar-day
      role=gridcell
      tabindex=${tabIndex}
    >
    </td>
    `;
  }

  #updateSelectedDate = (event: KeyboardEvent): void => {
    const key = event.key as SupportedKey;
    const type = event.type as 'click' | 'keydown' | 'keyup';

    if (type === 'keydown') {
      if (
        !navigationKeySetGrid.has(key as InferredFromSet<typeof navigationKeySetGrid>) &&
        !confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>)
      ) return;

      // Stop scrolling with arrow keys or Space key
      event.preventDefault();

      const {
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        max,
        min,
      } = this.data as MonthCalendarData;

      this.#selectedDate = toNextSelectedDate({
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: event.altKey,
        key,
        maxTime: +max,
        minTime: +min,
      });
      this.#shouldFocusSelectedDate = true;
    } else if (
      type === 'click' ||
      (
        type === 'keyup' &&
        confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>)
      )
    ) {
      const selectedCalendarDay =
        toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');

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

      this.#selectedDate = selectedCalendarDay.fullDate;
    }

    const newSelectedDate = this.#selectedDate;

    if (newSelectedDate == null) return;

    dispatchCustomEvent(this, 'date-updated', {
      isKeypress: Boolean(key),
      key,
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
