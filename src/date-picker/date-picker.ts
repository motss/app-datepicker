import '@material/mwc-icon-button';
import '../month-calendar/app-month-calendar.js';
import '../year-grid/app-year-grid.js';

import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html,LitElement } from 'lit';
import { queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { calendarViews, DateTimeFormat, MAX_DATE } from '../constants.js';
import { clampValue } from '../helpers/clamp-value.js';
import { dateValidator } from '../helpers/date-validator.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { focusElement } from '../helpers/focus-element.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { splitString } from '../helpers/split-string.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import type { MaybeDate } from '../helpers/typings.js';
import { iconArrowDropdown, iconChevronLeft, iconChevronRight } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { resetShadowRoot, webkitScrollbarStyling } from '../stylings.js';
import type { CalendarView, DatePickerProperties, Formatters, ValueUpdatedEvent, YearUpdatedEvent } from '../typings.js';
import type { YearGridData } from '../year-grid/typings.js';
import { datePickerStyling } from './stylings.js';
import type { DatePickerChangedProperties } from './typings.js';

export class DatePicker extends DatePickerMixin(DatePickerMinMaxMixin(LitElement)) implements DatePickerProperties {
  //#region public properties
  public valueAsDate: Date;
  public valueAsNumber: number;
  //#endregion public properties

  //#region private states
  @state()
  private _currentDate: Date;

  // @state()
  // private _hasMax!: boolean;

  // @state()
  // private _hasMin!: boolean;

  @state()
  private _max: Date;

  @state()
  private _min: Date;

  @state()
  private _selectedDate: Date;

  //#region private properties
  #formatters: Formatters;
  #shouldUpdateFocusInNavigationButtons = false;

  @queryAsync('.year-dropdown')
  private readonly _monthDropdown!: Promise<HTMLButtonElement | null>;

  @queryAsync('[data-navigation="previous"]')
  private readonly _navigationPrevious!: Promise<HTMLButtonElement | null>;

  @queryAsync('[data-navigation="next"]')
  private readonly _navigationNext!: Promise<HTMLButtonElement | null>;

  private readonly _TODAY_DATE: Date;
  //#endregion private properties

  public static override styles = [
    resetShadowRoot,
    datePickerStyling,
    webkitScrollbarStyling,
  ];

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this._min = new Date(todayDate);
    this._max = new Date(MAX_DATE);
    this._TODAY_DATE = todayDate;
    this._selectedDate = new Date(todayDate);
    this._currentDate = new Date(todayDate);
    this.#formatters = toFormatters(this.locale);
    this.valueAsDate = new Date(todayDate);
    this.valueAsNumber = +todayDate;
  }

  public override willUpdate(changedProperties: DatePickerChangedProperties): void {
    if (changedProperties.has('locale')) {
      const newLocale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;

      this.#formatters = toFormatters(newLocale);
      this.locale = newLocale;
    }

    if (
      (
        ['max', 'min', 'value'] as (keyof Pick<DatePickerProperties, 'max' | 'min' | 'value'>)[]
      ).some(n => changedProperties.has(n))
    ) {
      const todayDate = this._TODAY_DATE;
      const oldMin =
        toResolvedDate((changedProperties.get('min') || this.min || todayDate) as MaybeDate);
      const oldMax =
        toResolvedDate((changedProperties.get('max') || this.max || MAX_DATE) as MaybeDate);
      const oldValue =
        toResolvedDate((changedProperties.get('value') || this.value || todayDate) as MaybeDate);

      // FIXME: Can look into use MAX_DATE as fallback
      const newMin = dateValidator(this.min as MaybeDate, oldMin);
      const newMax = dateValidator(this.max as MaybeDate, oldMax);
      const newValue = dateValidator(this.value as MaybeDate, oldValue);

      /**
       * NOTE: Ensure new `value` is clamped between new `min` and `max` as `newValue` will only
       * contain valid date but its value might be a out-of-range date.
       */
      const valueDate = toResolvedDate(
        clampValue(+newMin.date, +newMax.date, +newValue.date)
      );

      this._min = newMin.date;
      this._max = newMax.date;

      // this._hasMin = newMin.isValid;
      // this._hasMax = newMax.isValid;

      this._currentDate = new Date(valueDate);
      this._selectedDate = new Date(valueDate);
      this.valueAsDate = new Date(valueDate);
      this.valueAsNumber = +valueDate;
      this.value = toDateString(valueDate);
    }

    if (changedProperties.has('startView')) {
      const oldStartView =
        (changedProperties.get('startView') || this.startView) as CalendarView;

      /**
       * NOTE: Reset to old `startView` to ensure a valid value.
       */
      if (!calendarViews.includes(this.startView)) {
        this.startView = oldStartView;
      }

      if (this.startView === 'calendar') {
        const newSelectedYear = new Date(
          clampValue(
            +this._min,
            +this._max,
            +this._selectedDate
          )
        );

        this._selectedDate = newSelectedYear;
        this._currentDate = new Date(newSelectedYear);
      }
    }

  }

  protected override firstUpdated(): void {
    const focusableElements: HTMLElement[] = [];

    // TODO: focus element
    if (this.startView === 'calendar') {
      // TODO: query select elements in calendar
    } else {
      // TODO: query select elements in year list
    }

    // dispatch updated event
    dispatchCustomEvent(this, 'first-updated', {
      focusableElements,
      value: this.value,
    });
  }

  protected override async updated(
    changedProperties: DatePickerChangedProperties
  ): Promise<void> {
    if (this.startView === 'calendar') {
      if (changedProperties.has('startView')) {
        await focusElement(this._monthDropdown);
      }

      if (changedProperties.has('_currentDate') && this.#shouldUpdateFocusInNavigationButtons) {
        const currentDate = this._currentDate;

        isInCurrentMonth(this._min, currentDate) && focusElement(this._navigationNext);
        isInCurrentMonth(this._max, currentDate) && focusElement(this._navigationPrevious);

        this.#shouldUpdateFocusInNavigationButtons = false;
      }
    }
  }

  //  FIXME: To not render min and max buttons
  protected override render(): TemplateResult {
    const formatters = this.#formatters;
    const currentDate = this._currentDate;
    const selectedDate = this._selectedDate;
    const max = this._max;
    const min = this._min;
    const showWeekNumber = this.showWeekNumber;
    const startView = this.startView;

    const {
      longMonthFormat,
      yearFormat,
    } = formatters;
    const selectedMonth = longMonthFormat(currentDate);
    const selectedYear = yearFormat(currentDate);
    const isStartViewYearGrid = startView === 'yearGrid';

    return html`
    <div class=header>
      <div class=month-and-year-selector>
        <div class=selected-month>${selectedMonth}</div>
        <div class=selected-year>${selectedYear}</div>

        <mwc-icon-button
          class=year-dropdown
          ariaLabel=${this.yearDropdownLabel}
          @click=${this.#updateStartView}
        >${iconArrowDropdown}</mwc-icon-button>
      </div>

      ${
        isStartViewYearGrid ?
          nothing :
          html`
          <div class=month-pagination>
            ${this.#renderNavigationButton('previous', isInCurrentMonth(min, currentDate))}
            ${this.#renderNavigationButton('next', isInCurrentMonth(max, currentDate))}
          </div>
          `
      }
    </div>

    <div class=${classMap({
      body: true,
      [`start-view--${isStartViewYearGrid ? 'year-grid' : 'calendar'}`]: true,
      'show-week-number': showWeekNumber,
    })}>${
      isStartViewYearGrid ?
      html`
      <app-year-grid
        class=year-grid
        .data=${{
          date: selectedDate,
          max,
          min,
          formatters,
        } as YearGridData}
        @year-updated=${this.#updateYear}
      ></app-year-grid>
      ` :
      this.#renderCalendar()
    }</div>
    `;
  }

  #renderCalendar = (): TemplateResult => {
    const currentDate = this._currentDate;
    const firstDayOfWeek = this.firstDayOfWeek;
    const formatters = this.#formatters;
    const max = this._max;
    const min = this._min;
    const selectedDate = this._selectedDate;
    const showWeekNumber = this.showWeekNumber;
    const {
      dayFormat,
      fullDateFormat,
      longWeekdayFormat,
      narrowWeekdayFormat,
    } = this.#formatters;

    const weekdays = getWeekdays({
      longWeekdayFormat,
      narrowWeekdayFormat,
      firstDayOfWeek: this.firstDayOfWeek,
      showWeekNumber,
      weekLabel: this.weekLabel,
    });
    const {
      calendar: calendarMonth,
      disabledDatesSet,
      disabledDaysSet,
    } = calendar({
      date: currentDate,
      dayFormat,
      disabledDates: splitString(this.disabledDates, toResolvedDate),
      disabledDays: splitString(this.disabledDays, Number),
      firstDayOfWeek,
      fullDateFormat,
      locale: this.locale,
      max,
      min,
      showWeekNumber,
      weekNumberType: this.weekNumberType,
    });

    return html`
    <app-month-calendar
      class=calendar
      .data=${{
        calendar: calendarMonth,
        currentDate,
        date: selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        formatters,
        max,
        min,
        showWeekNumber,
        todayDate: this._TODAY_DATE,
        weekdays,
      }}
      @date-updated=${this.#updateSelectedDate}
    ></app-month-calendar>
    `;
  };

  #renderNavigationButton  = (
    navigationType: 'previous' | 'next',
    shouldSkipRender = true
  ): TemplateResult => {
    const isPreviousNavigationType = navigationType === 'previous';

    return shouldSkipRender ?
      html`<div data-navigation=${navigationType}></div>` :
      html`
      <mwc-icon-button
        data-navigation=${navigationType}
        ariaLabel=${isPreviousNavigationType ? this.previousMonthLabel : this.nextMonthLabel}
        @click=${this.#navigateMonth}
      >${isPreviousNavigationType ? iconChevronLeft : iconChevronRight}</mwc-icon-button>
      `;
  };

  #navigateMonth = (ev: MouseEvent): void => {
    const currentDate = this._currentDate;
    const isPreviousNavigation = (
      ev.currentTarget as HTMLButtonElement
    ).getAttribute('data-navigation') === 'previous';

    const newCurrentDate = toUTCDate(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + (isPreviousNavigation ? -1 : 1),
      1
    );

    this._currentDate = newCurrentDate;
    this.#shouldUpdateFocusInNavigationButtons = true;
  };

  #updateSelectedAndCurrentDate = (maybeDate: Date | number | string): void => {
    const newSelectedDate = new Date(maybeDate);

    this._selectedDate = newSelectedDate;
    this._currentDate = new Date(newSelectedDate);
  };

  #updateSelectedDate = ({
    detail: { value },
  }: CustomEvent<ValueUpdatedEvent>): void => {
    this.#updateSelectedAndCurrentDate(value);

    // TODO: To fire value update event
  };

  #updateStartView = (): void => {
    const isYearGrid = this.startView === 'yearGrid';

    this.startView = isYearGrid ? 'calendar' : 'yearGrid';
  };

  #updateYear = ({
    detail: { year },
  }: CustomEvent<YearUpdatedEvent>): void => {
    this.#updateSelectedAndCurrentDate(this._selectedDate.setUTCFullYear(year));
    this.startView = 'calendar';
  };
}
