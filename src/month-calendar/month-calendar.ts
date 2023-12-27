import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { confirmKeySet, labelSelectedDate, labelToday, navigationKeySetGrid } from '../constants.js';
import { focusElement } from '../helpers/focus-element.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { CustomEventDetail, Formatters, InferredFromSet, SupportedKey } from '../typings.js';
import { monthCalendarStyling } from './stylings.js';
import type { MonthCalendarData, MonthCalendarProperties, MonthCalendarRenderCalendarDayInit } from './typings.js';

export class MonthCalendar extends RootElement implements MonthCalendarProperties {
  public static override shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };
  public static override styles = [
    baseStyling,
    resetShadowRoot,
    monthCalendarStyling,
  ];

  #selectedDate: Date | undefined = undefined;
  /**
   * NOTE(motss): This is required to avoid selected date being focused on each update.
   * Selected date should ONLY be focused during navigation with keyboard, e.g.
   * initial render, switching between views, etc.
   */
  #shouldFocusSelectedDate = false;

  #updateSelectedDate = (event: KeyboardEvent): void => {
    const key = event.key as SupportedKey;
    const type = event.type as 'click' | 'keydown' | 'keyup';

    if (type === 'keydown') {
      /**
       * NOTE: `@material/mwc-dialog` captures Enter keyboard event then closes the dialog.
       * This is not what `month-calendar` expects so here stops all event propagation immediately for
       * all key events.
       */
      event.stopImmediatePropagation();

      const isConfirmKey = confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>);

      if (
        !navigationKeySetGrid.has(key as InferredFromSet<typeof navigationKeySetGrid>) &&
        !isConfirmKey
      ) return;

      // Prevent scrolling with arrow keys or Space key
      event.preventDefault();

      // Bail out for Enter/ Space key as they should go to keyup handler.
      if (isConfirmKey) return;

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
        ].some(
          attrName =>
            selectedCalendarDay.getAttribute(attrName) === 'true'
        )
      ) {
        return;
      }

      this.#selectedDate = selectedCalendarDay.fullDate;
    }

    const selectedDate = this.#selectedDate;

    if (selectedDate == null) return;

    const isKeypress = Boolean(key);
    const newSelectedDate = new Date(selectedDate);

    this.fire<CustomEventDetail['date-updated']>({
      detail: {
        isKeypress,
        value: toDateString(newSelectedDate),
        valueAsDate: newSelectedDate,
        valueAsNumber: +newSelectedDate,
        ...(isKeypress && { key }),
      },
      type: 'date-updated',
    });

    /**
     * Reset `#selectedDate` after click or keyup event
     */
    this.#selectedDate = undefined;
  };

  @property({ attribute: false }) public data?: MonthCalendarData;

  @queryAsync('.calendar-day[aria-selected="true"]') public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  public constructor() {
    super();

    const todayDate = toResolvedDate();

    this.data = {
      calendar: [],
      currentDate: todayDate,
      date: todayDate,
      disabledDatesSet: new Set(),
      disabledDaysSet: new Set(),
      formatters: undefined,
      max: todayDate,
      min: todayDate,
      selectedDateLabel: labelSelectedDate,
      showCaption: false,
      showWeekNumber: false,
      todayDate,
      todayLabel: labelToday,
      weekdays: [],
    };
  }

  protected $renderCalendarDay({
    ariaDisabled,
    ariaLabel,
    ariaSelected,
    className,
    day,
    fullDate,
    part,
    tabIndex,
    title,
  }: MonthCalendarRenderCalendarDayInit): TemplateResult {
    return html`
    <td
      .fullDate=${fullDate}
      aria-disabled=${ariaDisabled as 'false' | 'true'}
      aria-label=${ariaLabel as string}
      aria-selected=${ariaSelected as 'false' | 'true'}
      class="calendar-day ${className}"
      data-day=${day}
      part=${part}
      role=gridcell
      tabindex=${tabIndex}
      title=${ifDefined(title)}
    >
    </td>
    `;
  }

  protected override render(): TemplateResult | typeof nothing {
    const {
      calendar,
      currentDate,
      date,
      disabledDatesSet,
      disabledDaysSet,
      formatters,
      max,
      min,
      selectedDateLabel,
      showCaption = false,
      showWeekNumber = false,
      todayDate,
      todayLabel,
      weekdays,
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
        tabindex=-1
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
              ({ label, value }, idx) =>
                html`
                <th
                  aria-label=${label}
                  class=${`weekday${showWeekNumber && idx < 1 ? ' week-number' : ''}`}
                  part=weekday
                  role=columnheader
                  title=${label}
                >
                  <div class=weekday-value part=weekday-value>${value}</div>
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
                    abbr=${label}
                    aria-label=${label}
                    class="calendar-day week-number"
                    part=week-number
                    role=rowheader
                    scope=row
                    title=${label}
                  >${value}</th>`;
                }

                /** Empty day */
                if (!value || !fullDate) {
                  return html`<td class="calendar-day day--empty" aria-hidden="true" part=calendar-day></td>`;
                }
                const curTime = +new Date(fullDate);
                const shouldTab = tabbableDate.getUTCDate() === Number(value);
                const isSelected = +date === curTime;
                const isToday = +todayDate === curTime;
                const title = isSelected ?
                  selectedDateLabel :
                  isToday ?
                    todayLabel :
                    undefined;

                return this.$renderCalendarDay({
                  ariaDisabled: String(disabled),
                  ariaLabel: label,
                  ariaSelected: String(isSelected),
                  className: isToday ? 'day--today' : '',
                  day: value,
                  fullDate,
                  part: `calendar-day${isToday ? ' today' : ''}`,
                  tabIndex: shouldTab ? 0 : -1,
                  title,
                } as MonthCalendarRenderCalendarDayInit);
              })
            }</tr>`;
          })
        }</tbody>
      </table>
      `;
    }

    return html`<div class=month-calendar part=calendar>${calendarContent}</div>`;
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
