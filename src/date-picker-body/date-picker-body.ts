import '../calendar/app-calendar.js';
import '../date-picker-body-menu/date-picker-body-menu.js';
import '../year-grid/year-grid.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import { html, type PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { navigationKeySetGrid, renderNoop } from '../constants.js';
import { isSameMonth } from '../helpers/is-same-month.js';
import { splitString } from '../helpers/split-string.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import type { DatePickerProperties, InferredFromSet, SupportedKey } from '../typings.js';
import type { YearGridProperties } from '../year-grid/types.js';
import { datePickerBodyName } from './constants.js';

@customElement(datePickerBodyName)
export class DatePickerBody extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerProperties {
  static override styles = [
    resetShadowRoot,
  ];

  #focusedDate: Date;

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> = (ev) => {
    const path = ev.composedPath() as HTMLElement[];
    const node = path.find(n => {
      return (
        n.nodeType === Node.ELEMENT_NODE &&
        n.localName === 'td' &&
        !n.classList.contains('calendarDay--none')
      );
    }) as HTMLTableCellElement;

    if (node) {
      this.#selectedDate = new Date(node.fullDate as Date);
      this.requestUpdate();
    }
  };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (ev, { disabledDatesSet, disabledDaysSet }) => {
    if (navigationKeySetGrid.has(ev.key as InferredFromSet<typeof navigationKeySetGrid>)) {
      const nextDate = toNextSelectedDate({
        currentDate: this.#focusedDate,
        date: this.#selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: toResolvedDate(this.max).getTime(),
        minTime: toResolvedDate(this.min).getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== this.#focusedDate.getTime() ||
        nextDateTime !== this.#selectedDate.getTime()
      ) {
        this.#focusedDate = this.#selectedDate = nextDate;
        this.requestUpdate();
      }
    }
  };

  #onMenuButtonClick = () => {
    this.startView = this.startView === 'calendar' ? 'yearGrid' : 'calendar';
  };

  #onNextIconButtonClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: 1 });
    this.requestUpdate();
  };

  #onPrevIconButtonClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: -1 });
    this.requestUpdate();
  };

  #onYearUpdate: NonNullable<YearGridProperties['onYearUpdate']> = (year) => {
    const focusedDate = toResolvedDate(this.#focusedDate);

    this.#focusedDate = fromPartsToUtcDate(year, focusedDate.getUTCMonth(), focusedDate.getUTCDate());
    this.startView = 'calendar';
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({
    ci,
    data,
    ri,
  }) => {
    return renderCalendarDay({
      data,
      selectedDate: this.#selectedDate,
      tabbableDate: this.#tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ ri, weekday }) => {
    return renderWeekDay(weekday);
  };

  #selectedDate: Date;
  #tabbableDate: Date;

  #todayDate: Date = toResolvedDate();

  #updateTabbableDate = () => {
    const {
      disabledDates,
      disabledDays,
      max,
      min,
    } = this;
    const isWithinSameMonth = isSameMonth(this.#selectedDate, this.#focusedDate);

    /**
     * NOTE: This reset tabindex of a tab-able calendar day to
     * the first day of month when navigating away from the current month
     * where the focused/ selected date is no longer in the new current month.
     */
    const disabledDateList = splitString(disabledDates, toResolvedDate);
    const disabledDayList = splitString(disabledDays, Number);
    const maxDateTime = toResolvedDate(max);
    const minDateTime = toResolvedDate(min);

    this.#tabbableDate = isWithinSameMonth
      ? this.#selectedDate
      : toNextSelectedDate({
          currentDate: this.#focusedDate,
          date: this.#selectedDate,
          disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
          disabledDaysSet: new Set(disabledDayList),
          hasAltKey: false,
          key: keyHome,
          maxTime: maxDateTime.getTime(),
          minTime: minDateTime.getTime(),
        });
  };

  constructor() {
    super();

    const { value } = this;

    this.#focusedDate = toResolvedDate(value);
    this.#selectedDate = toResolvedDate(value);
    this.#tabbableDate = toResolvedDate(value);
  }

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
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      toyearTemplate,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const date = toResolvedDate(value);
    const focusedDateValue = this.#focusedDate.toJSON();
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const menuLabel = startView === 'calendar' ? chooseMonthLabel : chooseYearLabel;

    return html`
    <div class=body>
      <date-picker-body-menu
        .menuLabel=${menuLabel}
        .menuText=${longMonthYearFormat(date)}
        .nextIconButtonLabel=${nextMonthLabel}
        .onMenuButtonClick=${this.#onMenuButtonClick}
        .onNextIconButtonClick=${this.#onNextIconButtonClick}
        .onPrevIconButtonClick=${this.#onPrevIconButtonClick}
        .prevIconButtonLabel=${previousMonthLabel}
      ></date-picker-body-menu>

      ${
        this.startView === 'calendar' ? html`
        <app-calendar
          disabledDates=${disabledDates}
          disabledDays=${disabledDays}
          firstDayOfWeek=${firstDayOfWeek}
          locale=${locale}
          max=${ifDefined(max)}
          min=${ifDefined(min)}
          .onDateUpdateByClick=${this.#onDateUpdateByClick}
          .onDateUpdateByKey=${this.#onDateUpdateByKey}
          .renderCalendarDay=${this.#renderCalendarDay}
          .renderFooter=${renderNoop}
          .renderWeekDay=${this.#renderWeekDay}
          .renderWeekLabel=${renderNoop}
          .renderWeekNumber=${renderNoop}
          shortWeekLabel=${shortWeekLabel}
          ?showWeekNumber=${showWeekNumber}
          value=${focusedDateValue}
          weekLabel=${weekLabel}
          weekNumberTemplate=${weekNumberTemplate}
          weekNumberType=${weekNumberType}
        ></app-calendar>
        ` : html`
        <year-grid
          locale=${locale}
          max=${ifDefined(max)}
          min=${ifDefined(min)}
          selectedYearTemplate=${selectedYearTemplate}
          toyearTemplate=${toyearTemplate}
          value=${focusedDateValue}
          .onYearUpdate=${this.#onYearUpdate}
        ></year-grid>
        `
      }
    </div>
    `;
  }

  protected override willUpdate(_changedProperties: Map<PropertyKey, unknown> | PropertyValueMap<this>): void {
    this.#updateTabbableDate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerBodyName]: DatePickerBody;
  }
}
