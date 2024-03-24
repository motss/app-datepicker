import { calendar } from '@ipohjs/calendar';
import type {
  CalendarGrid,
  CalendarWeekday,
} from '@ipohjs/calendar/dist/typings.js';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { html, nothing, type PropertyValueMap, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

import {
  emptyReadonlyArray,
  navigationKeySetGrid,
  renderNoop,
} from '../../../constants.js';
import { splitString } from '../../../helpers/split-string.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { DatePickerMixin } from '../../../mixins/date-picker-mixin.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { RootElement } from '../../../root-element/root-element.js';
import {
  baseStyling,
  resetShadowRoot,
  resetTableStyle,
  visuallyHiddenStyle,
} from '../../../styles.js';
import type { InferredFromSet } from '../../../types.js';
import { calendarStyles } from './styles.js';
import type { CalendarDayElement, CalendarProperties } from './types.js';

const defaultDateTimeFormat = new Intl.DateTimeFormat('en');

export class Calendar
  extends MinMaxMixin(DatePickerMixin(RootElement))
  implements CalendarProperties
{
  public static override shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static override styles = [
    resetShadowRoot,
    resetTableStyle,
    baseStyling,
    visuallyHiddenStyle,
    calendarStyles,
  ];

  #dayFormat: Intl.DateTimeFormat = defaultDateTimeFormat;

  #findSelectableCalendarDayNode = (ev: UIEvent) => {
    const path = ev.composedPath() as HTMLElement[];
    const node = path.find((n) => {
      return (
        n.nodeType === Node.ELEMENT_NODE &&
        n.classList.contains('calendarDayButton') &&
        n.getAttribute('aria-disabled') !== 'true'
      );
    }) as CalendarDayElement | null;

    return node;
  };

  #focusDateWhenNeeded = async (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('value') && this.#shouldFocusDate) {
      const { value } = this;
      const dayText = toResolvedDate(value).getUTCDate();

      /**
       * note: `lit` requires more time to re-render the `.calendarDayButton`
       * when `value` changes. Overriding `getUpdateComplete()` does not have
       * any effect as of writing. This will be revisited later.
       */
      await this.updateComplete;

      this.query(`.calendarDayButton[data-day="${dayText}"]`)?.focus();
      this.#shouldFocusDate = false;
      this.onUpdated?.();
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

  #onClickOrKeyUp =
    <T extends 'click' | 'key'>(calendarGrid: CalendarGrid) =>
    (ev: T extends 'click' ? MouseEvent : KeyboardEvent) => {
      const node = this.#findSelectableCalendarDayNode(ev);

      if (node) {
        const typedEvent = ev as
          | (KeyboardEvent & { type: `key${string}` })
          | (MouseEvent & { type: 'click' });

        if (typedEvent.type === 'click') {
          this.onDateUpdateByClick?.(typedEvent, node, calendarGrid);
        }

        if (typedEvent.type === 'keyup') {
          this.onDateUpdateByKey?.(typedEvent, node, calendarGrid);
        }
      }
    };

  #onKeyDown = (ev: KeyboardEvent) => {
    const { key } = ev;

    const isNavigationKey = navigationKeySetGrid.has(
      key as InferredFromSet<typeof navigationKeySetGrid>
    );

    if (isNavigationKey) {
      /**
       * note: this prevents keyboard event propagates upwards and
       * causes a scrollable page to be scrolled downwards via the Space key.
       */
      ev.preventDefault();

      const node = this.#findSelectableCalendarDayNode(ev);

      if (node) {
        this.#shouldFocusDate = true;
      }
    }
  };

  #onMouseDown = (ev: MouseEvent) => {
    const node = this.#findSelectableCalendarDayNode(ev);

    if (node) {
      this.#shouldFocusDate = true;
    }
  };

  #renderCalendar = (): TemplateResult => {
    const {
      _maxDate,
      _minDate,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
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
      weekNumberType
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
      max: _maxDate,
      min: _minDate,
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
        ? (emptyReadonlyArray as CalendarWeekday[])
        : ([{ label: '', value: '' }] as [CalendarWeekday])),
      ...maybeWeekdaysWithWeekLabel,
    ];

    const caption = this.#fullDateFormat.format(date);

    return html`
    <table
      class=calendar
      part=calendar
      @click=${this.#onClickOrKeyUp<'click'>(calendarGrid)}
      @keydown=${this.#onKeyDown}
      @keyup=${this.#onClickOrKeyUp<'key'>(calendarGrid)}
      @mousedown=${this.#onMouseDown}
      tabindex=-1
      role=grid
    >
      <!-- february 2020 -->
      <caption class="sr-only">${caption}</caption>

      <colgroup>${weekNumber?.value ? html`<col />` : nothing}
        ${weekdays.map(() => html`<col />`)}
      </colgroup>

      <!-- Wk | S M T W T F S -->
      <thead>
        <tr>
          ${
            weekNumber?.value
              ? (renderWeekLabel ?? renderNoop)({
                  label: weekLabel,
                  value: shortWeekLabel,
                })
              : nothing
          }
          ${weekdays.map((weekday, ri) => {
            return (renderWeekDay ?? renderNoop)({ ri, weekday });
          })}
        </tr>
      </thead>

      <!-- 1 | x x x 1 2  3  4 -->
      <!-- 2 | 5 6 7 8 9 10 11 -->
      <tbody>
        ${datesGrid.map((row, ri) => {
          return html`
            <tr>
              ${row.columns.map((data, ci) => {
                const isWeekNumber = ci === 0 && showWeekNumber;

                return (
                  (isWeekNumber ? renderWeekNumber : renderCalendarDay) ??
                  renderNoop
                )({ ci, data, ri });
              })}
            </tr>
            `;
        })}
      </tbody>

      <tfoot>${(renderFooter ?? renderNoop)()}</tfoot>
    </table>
    `;
  };

  #shouldFocusDate = false;
  @state() onDateUpdateByClick: CalendarProperties['onDateUpdateByClick'];
  @state() onDateUpdateByKey: CalendarProperties['onDateUpdateByKey'];
  onUpdated?: CalendarProperties['onUpdated'];
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

  protected override async updated(
    changedProperties: PropertyValueMap<this>
  ): Promise<void> {
    await this.#focusDateWhenNeeded(changedProperties);
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#installFormatters(changedProperties);
  }
}
