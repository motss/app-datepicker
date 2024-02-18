import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import type { AppCalendar } from '../calendar/app-calendar.js';
import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { confirmKeySet, navigationKeySetGrid, renderNoop } from '../constants.js';
import { isSameMonth } from '../helpers/is-same-month.js';
import { splitString } from '../helpers/split-string.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { ModalDatePickerYearGrid } from '../modal-date-picker-year-grid/modal-date-picker-year-grid.js';
import type { ModalDatePickerYearGridProperties } from '../modal-date-picker-year-grid/types.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import type { InferredFromSet, SupportedKey } from '../typings.js';
import { datePickerCalendarName } from './constants.js';
import { datePickerCalendarStyle } from './styles.js';
import type { DatePickerCalendarProperties } from './types.js';

const defaultDate = toResolvedDate();

@customElement(datePickerCalendarName)
export class DatePickerCalendar extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerCalendarProperties {
  static override styles = [
    resetShadowRoot,
    datePickerCalendarStyle,
  ];

  #focusSelectedYear = async (changedProperties: PropertyValueMap<this>): Promise<void> => {
    if (changedProperties.has('startView')) {
      const yearGridElement = this.#yearGridRef.value;

      if (yearGridElement) {
        await yearGridElement.updateComplete;
        yearGridElement.focusYearWhenNeeded();
      }
    }
  };

  #maxDate: Date = defaultDate;

  #minDate: Date = defaultDate;

  #onCalendarUpdated: AppCalendar['onUpdated'] = async () => {
    this.onDateUpdate?.(this._selectedDate);
  };

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> = (_ev, node) => {
    this._focusedDate = this._selectedDate = toResolvedDate(node.dataset.fulldate);
  };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (ev, _node, { disabledDatesSet, disabledDaysSet }) => {
    if (navigationKeySetGrid.has(ev.key as InferredFromSet<typeof navigationKeySetGrid>)) {
      const nextDate = toNextSelectedDate({
        currentDate: this._focusedDate,
        date: this._selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: toResolvedDate(this.max).getTime(),
        minTime: toResolvedDate(this.min).getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== this._focusedDate.getTime() ||
        nextDateTime !== this._selectedDate.getTime()
      ) {
        this._focusedDate = this._selectedDate = nextDate;
      }
    } else if (confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)) {
      this.#onCalendarUpdated?.();
    }
  };

  #onYearUpdate: NonNullable<ModalDatePickerYearGridProperties['onYearUpdate']> = (year) => {
    const focusedDate = toResolvedDate(this._focusedDate);

    this._focusedDate = fromPartsToUtcDate(year, focusedDate.getUTCMonth(), focusedDate.getUTCDate());
    this.onYearUpdate?.();
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({
    ci,
    data,
    ri,
  }) => {
    return renderCalendarDay({
      data,
      selectedDate: this._selectedDate,
      tabbableDate: this._tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ ri, weekday }) => {
    return renderWeekDay(weekday);
  };

  readonly #todayDate: Date = toResolvedDate();

  #updateDatesByValue = (changedProperties: PropertyValueMap<this>) => {
    const { value } = this;

    if (changedProperties.has('value') && value !== changedProperties.get('value')) {
      this._focusedDate = this._selectedDate = this._tabbableDate = toResolvedDate(value);
    }
  };

  #updateMinMax = (changedProperties: PropertyValueMap<this>) => {
    const { max, min } = this;

    if (changedProperties.has('max') && max !== changedProperties.get('max')) {
      this.#maxDate = toResolvedDate(max);
    }

    if (changedProperties.has('min') && min !== changedProperties.get('min')) {
      this.#minDate = toResolvedDate(min);
    }
  };

  #updateTabbableDate = () => {
    const isWithinSameMonth = isSameMonth(this._selectedDate, this._focusedDate);

    if (isWithinSameMonth) {
      this._tabbableDate = this._selectedDate;
    } else {
      const { disabledDates, disabledDays } = this;

      /**
       * NOTE: This reset tabindex of a tab-able calendar day to
       * the first day of month when navigating away from the current month
       * where the focused/ selected date is no longer in the new current month.
       */
      const disabledDateList = splitString(disabledDates, toResolvedDate);
      const disabledDayList = splitString(disabledDays, Number);

      this._tabbableDate = toNextSelectedDate({
        currentDate: this._focusedDate,
        date: this._selectedDate,
        disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
        disabledDaysSet: new Set(disabledDayList),
        hasAltKey: false,
        key: keyHome,
        maxTime: this.#maxDate.getTime(),
        minTime: this.#minDate.getTime(),
      });
    }
  };

  #yearGridRef: Ref<ModalDatePickerYearGrid> = createRef();

  @state() _focusedDate: Date = defaultDate;

  @state() _selectedDate: Date = defaultDate;

  @state() private _tabbableDate: Date = defaultDate;

  onDateChange?: DatePickerCalendarProperties['onDateChange'];

  onDateUpdate?: DatePickerCalendarProperties['onDateUpdate'];

  onYearUpdate?: DatePickerCalendarProperties['onYearUpdate'];

  #notifyDateUpdate(changedProperties: PropertyValueMap<this>): void {
    if (changedProperties.has('_focusedDate')) {
      this.onDateChange?.(this._focusedDate);
    }
  }

  protected override render(): TemplateResult {
    const {
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      toyearTemplate,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const isCalendarView = startView === 'calendar';
    const value = toResolvedDate(this._focusedDate).toJSON();

    return isCalendarView ? html`
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
      value=${value}
      weekLabel=${weekLabel}
      weekNumberTemplate=${weekNumberTemplate}
      weekNumberType=${weekNumberType}
      .onUpdated=${this.#onCalendarUpdated}
    ></app-calendar>
    ` : html`
    <modal-date-picker-year-grid
      ${ref(this.#yearGridRef)}
      locale=${locale}
      max=${ifDefined(max)}
      min=${ifDefined(min)}
      selectedYearTemplate=${selectedYearTemplate}
      toyearTemplate=${toyearTemplate}
      value=${value}
      .onYearUpdate=${this.#onYearUpdate}
    ></modal-date-picker-year-grid>
    `;
  }

  async reset() {
    this._focusedDate = this._selectedDate = toResolvedDate(this.value);

    return this.updateComplete;
  }

  protected override updated(changedProperties: PropertyValueMap<this>): void {
    this.#focusSelectedYear(changedProperties);
  }

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#updateDatesByValue(changedProperties);
    this.#updateMinMax(changedProperties);
    this.#updateTabbableDate();
    this.#notifyDateUpdate(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerCalendarName]: DatePickerCalendar;
  }
}
