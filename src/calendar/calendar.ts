import { calendar } from '@ipohjs/calendar';
import type { CalendarWeekday } from '@ipohjs/calendar/dist/typings.js';
import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { html, nothing, type PropertyValueMap, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

import { confirmKeySet, navigationKeySetGrid, renderNoop } from '../constants.js';
import { splitString } from '../helpers/split-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot, resetTableStyle, visuallyHiddenStyle } from '../stylings.js';
import type { InferredFromSet } from '../typings.js';
import { calendar_calendarDayStyle, calendar_tableStyle } from './styles.js';
import type { CalendarProperties } from './types.js';

const defaultDateTimeFormat = new Intl.DateTimeFormat('en');

export class Calendar extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements CalendarProperties {
  public static override shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static override styles = [
    resetShadowRoot,
    resetTableStyle,
    baseStyling,
    visuallyHiddenStyle,
    calendar_tableStyle,
    calendar_calendarDayStyle,
  ];

  #dayFormat: Intl.DateTimeFormat = defaultDateTimeFormat;

  #focusSelectedDate = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('value') && this.#shouldFocusDate) {
      this.root
        .querySelector<HTMLTableCellElement>('[tabindex="0"]')
        ?.focus();
      this.#shouldFocusDate = false;
    }
  };

  #fullDateFormat: Intl.DateTimeFormat = defaultDateTimeFormat;

  #installFormatters = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('locale')) {
      const { locale } = this;

      if (changedProperties.get('locale') !== locale) {
        this.#dayFormat = new Intl.DateTimeFormat(locale, { day: 'numeric' });
        this.#fullDateFormat = new Intl.DateTimeFormat(locale, {
          day: 'numeric',
          month: 'short',
          weekday: 'short',
          year: 'numeric',
        });
        this.#longWeekdayFormat = new Intl.DateTimeFormat(locale, {
          weekday: 'long',
        });
        this.#narrowWeekdayFormat = new Intl.DateTimeFormat(locale, {
          weekday: 'narrow',
        });
      }
    }
  };

  #longWeekdayFormat: Intl.DateTimeFormat = defaultDateTimeFormat;

  #narrowWeekdayFormat: Intl.DateTimeFormat = defaultDateTimeFormat;

  #onKeyDown = (ev: KeyboardEvent) => {
    const { key } = ev;

    const isNavigationKey = navigationKeySetGrid.has(key as InferredFromSet<typeof navigationKeySetGrid>);
    const isConfirmKey = confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>);

    if (isNavigationKey || isConfirmKey) {
      /**
       * note: this prevents keyboard event propagates upwards and
       * causes a scrollable page to be scrolled downwards via the Space key.
       */
      ev.preventDefault();
      this.#shouldFocusDate = true;
    }
  };

  #renderCalendar = (): TemplateResult => {
    /**
     * NOTE(motss): Tabbable date is the date to be tabbed when switching between months.
     * When there is a selected date in the current month, tab to focus on selected date.
     * Otherwise, set the first day of month tabbable so that tapping on Tab focuses that.
     */
    // const tabbableDate = isInCurrentMonth(date, currentDate) ?
    //   date :
    //   toNextSelectedDate({
    //     currentDate,
    //     date,
    //     disabledDatesSet,
    //     disabledDaysSet,
    //     hasAltKey: false,
    //     key: keyHome,
    //     maxTime: +max,
    //     minTime: +min,
    //   });

    // const calendarContent = html`
    // <table
    //   @click=${this.onClick}
    //   @keydown=${this.onKeydown}
    //   @keyup=${this.onKeyup}
    //   class=calendar-table
    //   part=table
    //   role=grid
    //   tabindex=-1
    // >
    //   <caption class=sr-only>${captionText}</caption>

    //   <thead>
    //     <tr class=weekdays part=weekdays role=row>${
    //       // fixme: renderWeekLabel()
    //       weekdays.map(
    //         ({ label, value }, weekdayIdx) => {
    //           // fixme: renderWeekday()
    //         }
    //         // html`
    //         // <th
    //         //   aria-label=${label}
    //         //   class=${`weekday ${showWeekNumber && weekdayIdx < 1 ? ' week-number' : ''}`}
    //         //   part=weekday
    //         //   role=columnheader
    //         //   title=${label}
    //         // >
    //         //   <p>${value}</p>
    //         // </th>
    //         // `
    //       )
    //     }</tr>
    //   </thead>

    //   <tbody>${
    //     calendar.map((calendarRow) => {
    //       return html`
    //       <tr role=row>
    //         ${calendarRow.map((calendarCol, i) => {
    //           const { disabled, fullDate, label, value } = calendarCol;

    //           /** Week label, if any */
    //           if (!fullDate && value && showWeekNumber && i < 1) {
    //             return html`<th
    //               abbr=${label}
    //               aria-label=${label}
    //               aria-disabled=true
    //               class="calendarDay weekNumber"
    //               part=week-number
    //               role=rowheader
    //               scope=row
    //               title=${label}
    //             >${value}</th>`;
    //           }

    //           /** Empty day */
    //           if (!value || !fullDate) {
    //             return html`<td class="calendar-day day--empty" aria-hidden="true" part=calendar-day></td>`;
    //           }

    //           // const curTime = +new Date(fullDate);
    //           // const shouldTab = tabbableDate.getUTCDate() === Number(value);
    //           // const isSelected = +date === curTime;
    //           // const isToday = +todayDate === curTime;
    //           // const title = isSelected ?
    //           //   selectedDateLabel :
    //           //   isToday ?
    //           //     todayLabel :
    //           //     label;

    //           return html`
    //           <td
    //             .fullDate=${fullDate}
    //             aria-disabled=${String(disabled) as 'false' | 'true'}
    //             aria-label=${label as string}
    //             aria-selected=${String(isSelected) as 'false' | 'true'}
    //             class="calendarDay ${isToday ? 'day--today' : ''}"
    //             data-day=${value}
    //             part=${`calendar-day${isToday ? ' today' : ''}`}
    //             role=gridcell
    //             tabindex=${shouldTab ? 0 : -1}
    //             aria-current=${isToday}
    //             title=${title}
    //           >
    //             <p>${value}</p>
    //           </td>
    //           `;
    //         })
    //       }</tr>`;
    //     })
    //   }</tbody>
    // </table>
    // `;

    const {
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      onDateUpdateByClick,
      onDateUpdateByKey,
      renderCalendarDay,
      renderFooter,
      renderWeekDay,
      renderWeekLabel,
      renderWeekNumber,
      shortWeekLabel,
      showWeekNumber,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const date = toResolvedDate(value);

    const calendarGrid = calendar({
      date,
      dayFormat: this.#dayFormat,
      disabledDates: splitString(disabledDates, toResolvedDate),
      disabledDays: splitString(disabledDays, Number),
      firstDayOfWeek,
      fullDateFormat: this.#fullDateFormat,
      locale,
      max: max ? toResolvedDate(max) : fromPartsToUtcDate(2100, 11, 31),
      min: min ? toResolvedDate(min) : fromPartsToUtcDate(1900, 0, 1),
      showWeekNumber,
      weekNumberTemplate,
      weekNumberType,
    });
    const { datesGrid } = calendarGrid;
    const maybeWeekdaysWithWeekLabel = getWeekdays({
      firstDayOfWeek,
      longWeekdayFormat: this.#longWeekdayFormat,
      narrowWeekdayFormat: this.#narrowWeekdayFormat,
      shortWeekLabel,
      showWeekNumber,
      weekLabel,
    });
    const [weekNumber, ...weekdays] = [
      ...(showWeekNumber
        ? []
        : ([{ label: '', value: '' }] as [CalendarWeekday])),
      ...maybeWeekdaysWithWeekLabel,
    ];

    const caption = this.#fullDateFormat.format(date);
    const onClick = (ev: MouseEvent) => onDateUpdateByClick?.(ev, calendarGrid);
    const onKeyUp = (ev: KeyboardEvent) => onDateUpdateByKey?.(ev, calendarGrid);

    return html`
    <table
      class=calendar
      part=calendar
      @click=${onClick}
      @keydown=${this.#onKeyDown}
      @keyup=${onKeyUp}
      tabindex=-1
      role=grid
    >
      <!-- february 2020 -->
      <caption class="sr-only">${caption}</caption>

      <colgroup>${weekNumber.value ? html`<col />` : nothing}
        ${weekdays.map(() => html`<col />`)}
      </colgroup>

      <!-- Wk | S M T W T F S -->
      <thead>
        <tr>
          ${weekNumber.value ? (renderWeekLabel ?? renderNoop)({ label: weekLabel, value: shortWeekLabel }) : nothing}
          ${
            weekdays.map((weekday, ri) => {
              return (renderWeekDay ?? renderNoop)({ ri, weekday });
            })
          }
        </tr>
      </thead>

      <!-- 1 | x x x 1 2  3  4 -->
      <!-- 2 | 5 6 7 8 9 10 11 -->
      <tbody>
        ${
          datesGrid.map((row, ri) => {
            return html`
            <tr>
              ${
                row.columns.map((data, ci) => {
                  const isWeekNumber = ci === 0 && showWeekNumber;

                  return (
                    (
                      isWeekNumber ? renderWeekNumber : renderCalendarDay
                    ) ?? renderNoop
                  )({ ci, data, ri });
                })
              }
            </tr>
            `;
          })
        }
      </tbody>

      <tfoot>${(renderFooter ?? renderNoop)()}</tfoot>
    </table>
    `;
  };

  #shouldFocusDate: boolean = false;
  @state() onDateUpdateByClick: CalendarProperties['onDateUpdateByClick'];
  @state() onDateUpdateByKey: CalendarProperties['onDateUpdateByKey'];
  @state() renderCalendarDay: CalendarProperties['renderCalendarDay'];
  @state() renderFooter: CalendarProperties['renderFooter'];
  @state() renderWeekDay: CalendarProperties['renderWeekDay'];

  // #updateSelectedDate = (event: KeyboardEvent): void => {
  //   const key = event.key as SupportedKey;
  //   const type = event.type as 'click' | 'keydown' | 'keyup';

  //   if (type === 'keydown') {
  //     /**
  //      * NOTE: `@material/base/dialog captures Enter keyboard event then closes the dialog.
  //      * This is not what `month-calendar` expects so here stops all event propagation immediately for
  //      * all key events.
  //      */
  //     event.stopImmediatePropagation();

  //     const isConfirmKey = confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>);

  //     if (
  //       !navigationKeySetGrid.has(key as InferredFromSet<typeof navigationKeySetGrid>) &&
  //       !isConfirmKey
  //     ) return;

  //     // Prevent scrolling with arrow keys or Space key
  //     event.preventDefault();

  //     // Bail out for Enter/ Space key as they should go to keyup handler.
  //     if (isConfirmKey) return;

  //     const {
  //       currentDate,
  //       date,
  //       disabledDatesSet,
  //       disabledDaysSet,
  //       max,
  //       min,
  //     } = this.data as CalendarData;

  //     this.#selectedDate = toNextSelectedDate({
  //       currentDate,
  //       date,
  //       disabledDatesSet,
  //       disabledDaysSet,
  //       hasAltKey: event.altKey,
  //       key,
  //       maxTime: +max,
  //       minTime: +min,
  //     });
  //     this.#shouldFocusSelectedDate = true;
  //   } else if (
  //     type === 'click' ||
  //     (
  //       type === 'keyup' &&
  //       confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>)
  //     )
  //   ) {
  //     const selectedCalendarDay =
  //       toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');

  //     /** NOTE: Required condition check else these will trigger unwanted re-rendering */
  //     if (
  //       selectedCalendarDay == null ||
  //       [
  //         'aria-disabled',
  //         'aria-hidden',
  //       ].some(
  //         attrName =>
  //           selectedCalendarDay.getAttribute(attrName) === 'true'
  //       )
  //     ) {
  //       return;
  //     }

  //     this.#selectedDate = selectedCalendarDay.fullDate;
  //   }

  //   const selectedDate = this.#selectedDate;

  //   if (selectedDate == null) return;

  //   const isKeypress = Boolean(key);
  //   const newSelectedDate = new Date(selectedDate);

  //   this.onDateUpdate({
  //     isKeypress,
  //     value: toDateString(newSelectedDate),
  //     valueAsDate: newSelectedDate,
  //     valueAsNumber: +newSelectedDate,
  //     ...(isKeypress && { key }),
  //   });

  //   /**
  //    * Reset `#selectedDate` after click or keyup event
  //    */
  //   this.#selectedDate = undefined;
  // };

  // @queryAsync('.calendar-day[aria-selected="true"]') public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  @state() renderWeekLabel: CalendarProperties['renderWeekLabel'];

  @state() renderWeekNumber: CalendarProperties['renderWeekNumber'];

  protected override render(): TemplateResult | typeof nothing {
    return this.#renderCalendar();
  }

  protected override async updated(changedProperties: PropertyValueMap<this>): Promise<void> {
    this.#focusSelectedDate(changedProperties);
  }

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#installFormatters(changedProperties);
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
    fullDate: Date | undefined;
  }
  // #endregion HTML element type extensions
}