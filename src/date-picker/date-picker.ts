import '@material/mwc-icon-button';
import '../month-calendar/app-month-calendar.js';
import '../year-grid/app-year-grid.js';

import type { IconButton } from '@material/mwc-icon-button';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { DateTimeFormat, MAX_DATE, startViews } from '../constants.js';
import { clampValue } from '../helpers/clamp-value.js';
import { dateValidator } from '../helpers/date-validator.js';
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
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot, webkitScrollbarStyling } from '../stylings.js';
import type { CustomEventDetail, DatePickerProperties, Formatters, StartView, ValueUpdatedEvent } from '../typings.js';
import type { AppYearGrid } from '../year-grid/app-year-grid.js';
import type { YearGridData } from '../year-grid/typings.js';
import { datePickerStyling } from './stylings.js';
import type { DatePickerChangedProperties } from './typings.js';

export class DatePicker extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerProperties {
  public get valueAsDate(): Date {
    return this.#valueAsDate;
  }

  public get valueAsNumber(): number {
    return +this.#valueAsDate;
  }

  @queryAsync('app-month-calendar') private readonly _monthCalendar!: Promise<AppMonthCalendar | null>;

  @queryAsync('[data-navigation="previous"]') private readonly _navigationPrevious!: Promise<HTMLButtonElement | null>;

  @queryAsync('[data-navigation="next"]') private readonly _navigationNext!: Promise<HTMLButtonElement | null>;

  @queryAsync('.year-dropdown') private readonly _yearDropdown!: Promise<IconButton | null>;

  @queryAsync('app-year-grid') private readonly _yearGrid!: Promise<AppYearGrid | null>;

  @state() private _currentDate: Date;

  @state() private _max: Date;

  @state() private _min: Date;

  @state() private _selectedDate: Date;

  #formatters: Formatters;
  #focusNavButtonWithKey = false;
  #today: Date;
  #valueAsDate: Date;

  public static override styles = [
    baseStyling,
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
    this.#valueAsDate = new Date(todayDate);
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
      this.#valueAsDate = new Date(valueDate);

      /**
       * Always override `min` and `max` when they are set with falsy values.
       */
      if (!this.max) this.max = toDateString(newMax.date);
      if (!this.min) this.min = toDateString(newMin.date);

      /**
       * Always override `value` when its value is not a string and dispatch `date-updated` event.
       */
      if (!this.value) {
        const valueStr = toDateString(valueDate);

        this.value = valueStr;

        this.fire<CustomEventDetail['date-updated']>({
          detail: {
            isKeypress: false,
            value: valueStr,
            valueAsDate: new Date(valueDate),
            valueAsNumber: +valueDate,
          },
          type: 'date-updated',
        });
      }
    }

    if (changedProperties.has('startView')) {
      const oldStartView =
        (changedProperties.get('startView') || this.startView) as StartView;

      /**
       * NOTE: Reset to old `startView` to ensure a valid value.
       */
      if (!startViews.includes(this.startView)) {
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
    const valueAsDate = this.#valueAsDate;

    this.fire<CustomEventDetail['first-updated']>({
      detail: {
        focusableElements: await this.#queryAllFocusable(),
        value: toDateString(valueAsDate),
        valueAsDate: new Date(valueAsDate),
        valueAsNumber: +valueAsDate,
      },
      type: 'first-updated',
    });
  }

  protected override async updated(
    changedProperties: DatePickerChangedProperties
  ): Promise<void> {
    /**
     * NOTE: Focus `.year-dropdown` when switching from year grid to calendar view.
     */
    if (
      changedProperties.get('startView') === 'yearGrid' as StartView &&
      this.startView === 'calendar'
    ) {
      (await this._yearDropdown)?.focus();
    }

    /**
     * NOTE: Focus new navigation button when navigating months with keyboard, e.g.
     * next button will not show in Dec 2020 when `max=2020-12-31` so previous button should be
     * focused instead.
     */
    if (this.startView === 'calendar') {
      if (changedProperties.has('_currentDate') && this.#focusNavButtonWithKey) {
        const currentDate = this._currentDate;

        isInCurrentMonth(this._min, currentDate) && focusElement(this._navigationNext);
        isInCurrentMonth(this._max, currentDate) && focusElement(this._navigationPrevious);

        this.#focusNavButtonWithKey = false;
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
    <div class=header part=header>
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
    })}" part=body>${
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

    /**
     * `.detail=1` means mouse click in `@click` for all browsers except IE11.
     */
    this.#focusNavButtonWithKey = ev.detail === 0;
  }

  #queryAllFocusable = async () : Promise<HTMLElement[]> => {
    const isStartViewCalendar = this.startView === 'calendar';
    const focusable = [
      ...this.queryAll('mwc-icon-button'),
      (await (isStartViewCalendar ? this._monthCalendar : this._yearGrid))
        ?.query(`.${
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

    /**
     * Always update `value` just like other native element such as `input`.
     */
    this.value = toDateString(newSelectedDate);
  }

  #updateSelectedDate({
    detail: { value },
  }: CustomEvent<ValueUpdatedEvent>): void {
    this.#updateSelectedAndCurrentDate(value);
  }

  #updateStartView(): void {
    this.startView = this.startView === 'yearGrid' ? 'calendar' : 'yearGrid';
  }

  #updateYear({
    detail: { year },
  }: CustomEvent<CustomEventDetail['year-updated']['detail']>): void {
    this.#updateSelectedAndCurrentDate(this._selectedDate.setUTCFullYear(year));
    this.startView = 'calendar';
  }
}
