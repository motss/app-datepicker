import '@material/mwc-icon-button';
import '../month-calendar/app-month-calendar.js';
import '../year-grid/app-year-grid.js';

import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html,LitElement } from 'lit';
import { queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { calendarViews,MAX_DATE } from '../constants.js';
import { adjustOutOfRangeValue } from '../helpers/adjust-out-of-range-value.js';
import { dateValidator } from '../helpers/date-validator.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { splitString } from '../helpers/split-string.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import { toMultiCalendars } from '../helpers/to-multi-calendars.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import type { MaybeDate } from '../helpers/typings.js';
import { iconArrowDropdown, iconChevronLeft, iconChevronRight } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { MonthCalendarData } from '../month-calendar/typings.js';
import { resetShadowRoot, webkitScrollbarStyling } from '../stylings.js';
import type { CalendarView, DatePickerProperties, Formatters, ValueUpdatedEvent, YearUpdatedEvent } from '../typings.js';
import type { YearGridData } from '../year-grid/typings.js';
import { datePickerStyling } from './stylings.js';
import type { DatePickerChangedProperties } from './typings.js';

export class DatePicker extends DatePickerMixin(DatePickerMinMaxMixin(LitElement)) implements DatePickerProperties {
  //#region public properties
  @queryAsync('.month-dropdown')
  public monthDropdown!: Promise<HTMLButtonElement | null>;
  //#endregion public properties

  //#region private states
  @state()
  private _currentDate: Date;

  @state()
  private _hasMax!: boolean;

  @state()
  private _hasMin!: boolean;

  @state()
  private _max: Date;

  @state()
  private _maxDate!: Date;

  @state()
  private _min: Date;

  @state()
  private _selectedDate: Date;

  //#region private properties
  #formatters: Formatters;
  private _TODAY_DATE: Date;
  //#endregion private properties

  public static styles = [
    resetShadowRoot,
    datePickerStyling,
    webkitScrollbarStyling,
  ];

  constructor() {
    super();

    const todayDate = toResolvedDate();

    // this._min = new Date(todayDate);
    this._min = new Date('1900-01-01');
    this._max = new Date(MAX_DATE);
    this._TODAY_DATE = todayDate;
    this._selectedDate = new Date(todayDate);
    this._currentDate = new Date(todayDate);
    this.#formatters = toFormatters(this.locale);
  }

  public willUpdate(changedProperties: DatePickerChangedProperties): void {
    if (changedProperties.has('locale')) {
      this.#formatters = toFormatters(this.locale);
    }

    if (changedProperties.has('startView')) {
      const oldStartView = changedProperties.get('startView') as CalendarView;
      const newStartView = this.startView;

      if (!calendarViews.includes(newStartView)) {
        this.startView = this.startView = oldStartView;
      }
    }

    if (changedProperties.has('value')) {
      const oldValue = toResolvedDate(
        changedProperties.get('value') as string
      ) || this._TODAY_DATE;
      const { date } = dateValidator(this.value, oldValue);

      this._currentDate = new Date(date);
      this._selectedDate = new Date(date);
      // this.valueAsDate = newDate;
      // this.valueAsNumber = +newDate;
    }

    const hasMax = changedProperties.has('max');
    const hasMin = changedProperties.has('min');

    if (hasMax || hasMin) {
      const update = (isMax = false) => {
        const oldValue = toResolvedDate(
          changedProperties.get(isMax ? 'max' : 'min') as string
        ) || (isMax ? MAX_DATE: this._TODAY_DATE);
        const value = this[isMax ? 'max' : 'min'] as MaybeDate;
        const { date, isValid } = dateValidator(value, oldValue);

        this[isMax ? '_max' : '_min'] = date;
        this[isMax ? '_hasMax' : '_hasMin'] = isValid;
      };

      if (hasMax) update(true);
      if (hasMin) update();

      const min = this._min;
      const max = this._max;
      const adjustedCurrentDate = adjustOutOfRangeValue(min, max, this._currentDate);

      this._currentDate = adjustedCurrentDate;
      this._selectedDate = new Date(adjustedCurrentDate);
      this.value = toDateString(adjustedCurrentDate);
    }

    if (changedProperties.has('startView') && this.startView === 'calendar') {
      const newSelectedYear = adjustOutOfRangeValue(
        this._min,
        this._max,
        this._selectedDate
      );

      this._selectedDate = newSelectedYear;
      this._currentDate = new Date(newSelectedYear);
    }
  }

  protected firstUpdated(): void {
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

  protected async updated(
    changedProperties: DatePickerChangedProperties
  ): Promise<void> {
    if (changedProperties.has('startView') && this.startView === 'calendar') {
      const monthDropdown = await this.monthDropdown;

      if (monthDropdown) {
        monthDropdown.focus();
      }
    }
  }

  protected render(): TemplateResult {
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
          class=month-dropdown
          label=${this.yearDropdownLabel}
          @click=${this.#updateStartView}
        >${iconArrowDropdown}</mwc-icon-button>
      </div>

      ${
        isStartViewYearGrid ?
          nothing :
          html`
          <div class=month-pagination>
            <mwc-icon-button
              data-navigation=previous
              label=${this.previousMonthLabel}
              @click=${this.#navigateMonth}
            >${iconChevronLeft}</mwc-icon-button>
            <mwc-icon-button
              data-navigation=next
              label=${this.nextMonthLabel}
              @click=${this.#navigateMonth}
            >${iconChevronRight}</mwc-icon-button>
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

  // FIXME: Optimize this code
  #renderCalendar = (): TemplateResult => {
    const currentDate = this._currentDate;
    const max = this._max;
    const min = this._min;
    const showWeekNumber = this.showWeekNumber;
    const formatters = this.#formatters;
    const {
      dayFormat,
      fullDateFormat,
      longWeekdayFormat,
      narrowWeekdayFormat,
    } = formatters;

    const {
      calendars,
      disabledDatesSet,
      disabledDaysSet,
      weekdays,
    } = toMultiCalendars({
      dayFormat,
      disabledDates: splitString(this.disabledDates, toResolvedDate),
      disabledDays: splitString(this.disabledDays, Number),
      firstDayOfWeek: this.firstDayOfWeek,
      fullDateFormat,
      locale: this.locale,
      longWeekdayFormat,
      max,
      min,
      narrowWeekdayFormat,
      currentDate,
      showWeekNumber: Boolean(this.showWeekNumber),
      weekLabel: this.weekLabel,
      weekNumberType: this.weekNumberType,
    });
    const [{ calendar }] = calendars;
    const data: MonthCalendarData = {
      calendar,
      date: this._selectedDate,
      disabledDatesSet,
      disabledDaysSet,
      currentDate,
      max,
      min,
      showWeekNumber,
      todayDate: this._TODAY_DATE,
      weekdays,
      formatters,
    };

    return html`
    <app-month-calendar
      class=calendar
      .data=${data}
      @date-updated=${this.#updateSelectedDate}
    ></app-month-calendar>
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

  #updateSelectedAndCurrentDate = (maybeDate: Date | number | string): void => {
    const newSelectedDate = new Date(maybeDate);

    this._selectedDate = newSelectedDate;
    this._currentDate = new Date(newSelectedDate);
  };
}
