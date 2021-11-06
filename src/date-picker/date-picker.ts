import '@material/mwc-icon-button';
import '../month-calendar/app-month-calendar.js';
import '../year-grid/app-year-grid.js';

import type { TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
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
import type { AppMonthCalendar } from '../month-calendar/app-month-calendar.js';
import { resetShadowRoot, webkitScrollbarStyling } from '../stylings.js';
import type { CalendarView, DatePickerProperties, Formatters, ValueUpdatedEvent, YearUpdatedEvent } from '../typings.js';
import type { AppYearGrid } from '../year-grid/app-year-grid.js';
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

  @state()
  private _max: Date;

  @state()
  private _min: Date;

  @state()
  private _selectedDate: Date;
  //#endregion private states

  //#region private properties
  #formatters: Formatters;
  #shouldUpdateFocusInNavigationButtons = false;
  #today: Date;

  @queryAsync('app-month-calendar')
  private readonly _monthCalendar!: Promise<AppMonthCalendar | null>;

  @queryAsync('[data-navigation="previous"]')
  private readonly _navigationPrevious!: Promise<HTMLButtonElement | null>;

  @queryAsync('[data-navigation="next"]')
  private readonly _navigationNext!: Promise<HTMLButtonElement | null>;

  @queryAsync('app-year-grid')
  private readonly _yearGrid!: Promise<AppYearGrid | null>;
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
    this.#today = todayDate;
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

    const dateRangeProps = [
      'max',
      'min',
      'value',
    ] as (keyof Pick<DatePickerProperties, 'max' | 'min' | 'value'>)[];
    if (
      dateRangeProps.some(n => changedProperties.has(n))
    ) {
      const todayDate = this.#today;

      const [
        newMax,
        newMin,
        newValue,
      ] = (
        [
          ['max', MAX_DATE],
          ['min', todayDate],
          ['value', todayDate],
        ] as [keyof Pick<DatePickerProperties, 'max' | 'min' | 'value'>, Date][]
      ).map(
        ([propKey, resetValue]) => {
          const currentValue = this[propKey];
          const defaultValue = toResolvedDate(
            /**
             * The value from `changedProperties` can only be undefined when first init.
             * This also means that subsequent changes will not affect the outcome because any
             * invalid value will be dropped in favor of previous valid value.
             */
            changedProperties.get(propKey) as MaybeDate ?? resetValue
          );
          const valueWithReset = currentValue === undefined ? resetValue : currentValue;

          return dateValidator(valueWithReset, defaultValue);
        }
      );

      /**
       * NOTE: Ensure new `value` is clamped between new `min` and `max` as `newValue` will only
       * contain valid date but its value might be a out-of-range date.
       */
      const valueDate = toResolvedDate(
        clampValue(+newMin.date, +newMax.date, +newValue.date)
      );

      this._min = newMin.date;
      this._max = newMax.date;
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

  protected override async firstUpdated(): Promise<void> {
    dispatchCustomEvent(this, 'first-updated', {
      focusableElements: await this.#queryAllFocusable(),
      value: this.value,
    });
  }

  protected override async updated(
    changedProperties: DatePickerChangedProperties
  ): Promise<void> {
    if (this.startView === 'calendar') {
      if (changedProperties.has('_currentDate') && this.#shouldUpdateFocusInNavigationButtons) {
        const currentDate = this._currentDate;

        isInCurrentMonth(this._min, currentDate) && focusElement(this._navigationNext);
        isInCurrentMonth(this._max, currentDate) && focusElement(this._navigationPrevious);

        this.#shouldUpdateFocusInNavigationButtons = false;
      }
    }
  }

  protected override render(): TemplateResult {
    const formatters = this.#formatters;
    const currentDate = this._currentDate;
    const max = this._max;
    const min = this._min;
    const showWeekNumber = this.showWeekNumber;
    const startView = this.startView;

    const { longMonthYearFormat } = formatters;
    const selectedYearMonth = longMonthYearFormat(currentDate);
    const isStartViewYearGrid = startView === 'yearGrid';

    return html`
    <div class=header>
      <div class=month-and-year-selector>
        <p class=selected-year-month>${selectedYearMonth}</p>

        <mwc-icon-button
          class=year-dropdown
          .ariaLabel=${this.yearDropdownLabel}
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

    <div class="body ${classMap({
      [`start-view--${isStartViewYearGrid ? 'year-grid' : 'calendar'}`]: true,
      'show-week-number': showWeekNumber,
    })}">${
      (isStartViewYearGrid ? this.#renderYearGrid : this.#renderCalendar)()
    }</div>
    `;
  }

  #navigateMonth(ev: MouseEvent): void {
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
  }

  #queryAllFocusable = async () : Promise<HTMLElement[]> => {
    const isStartViewCalendar = this.startView === 'calendar';
    const focusable = [
      ...Array.from(
        this.shadowRoot?.querySelectorAll('mwc-icon-button') ?? []
      ),
      (await (isStartViewCalendar ? this._monthCalendar : this._yearGrid))
        ?.shadowRoot
        ?.querySelector<HTMLElement>(`.${
          isStartViewCalendar ? 'calendar-day' : 'year-grid-button'
        }[aria-selected="true"]`),
    ].filter(Boolean) as HTMLElement[];

    return focusable;
  };

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
        todayDate: this.#today,
        weekdays,
      }}
      @date-updated=${this.#updateSelectedDate}
      class=calendar
    ></app-month-calendar>
    `;
  };

  #renderNavigationButton (
    navigationType: 'previous' | 'next',
    shouldSkipRender = true
  ): TemplateResult {
    const isPreviousNavigationType = navigationType === 'previous';

    return shouldSkipRender ?
      html`<div data-navigation=${navigationType}></div>` :
      html`
      <mwc-icon-button
        data-navigation=${navigationType}
        .ariaLabel=${isPreviousNavigationType ? this.previousMonthLabel : this.nextMonthLabel}
        @click=${this.#navigateMonth}
      >${isPreviousNavigationType ? iconChevronLeft : iconChevronRight}</mwc-icon-button>
      `;
  }

  #renderYearGrid = (): TemplateResult => {
    return html`
    <app-year-grid
      class=year-grid
      .data=${{
        date: this._selectedDate,
        formatters: this.#formatters,
        max: this._max,
        min: this._min,
      } as YearGridData}
      @year-updated=${this.#updateYear}
    ></app-year-grid>
    `;
  };

  #updateSelectedAndCurrentDate(maybeDate: Date | number | string): void {
    const newSelectedDate = new Date(maybeDate);

    this._selectedDate = newSelectedDate;
    this._currentDate = new Date(newSelectedDate);
  }

  #updateSelectedDate({
    detail: { value },
  }: CustomEvent<ValueUpdatedEvent>): void {
    this.#updateSelectedAndCurrentDate(value);

    // TODO: To fire value update event
  }

  #updateStartView(): void {
    const isYearGrid = this.startView === 'yearGrid';

    this.startView = isYearGrid ? 'calendar' : 'yearGrid';
  }

  #updateYear({
    detail: { year },
  }: CustomEvent<YearUpdatedEvent>): void {
    this.#updateSelectedAndCurrentDate(this._selectedDate.setUTCFullYear(year));
    this.startView = 'calendar';
  }
}
