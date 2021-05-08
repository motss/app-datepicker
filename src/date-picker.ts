import type { TemplateResult } from 'lit';
import type { CalendarView, ChangeProperties, DatePickerElementInterface, DatePickerInterface, Formatters } from './typings.js';

import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';

import { MAX_DATE, calendarViews } from './constants.js';
import { DatePickerMixin } from './date-picker-mixin.js';
import { dateValidator } from './helpers/date-validator.js';
import { toFormatters } from './helpers/to-formatters.js';
import { toResolvedDate } from './helpers/to-resolved-date.js';
import { toYearList } from './helpers/to-year-list.js';
import type { MaybeDate } from './helpers/typings.js';
import { resetShadowRoot } from './ stylings.js';
import { dispatchCustomEvent } from './helpers/dispatch-custom-event.js';
import { adjustOutOfRangeValue } from './helpers/adjust-out-of-range-value.js';
import { toDateString } from './helpers/to-date-string.js';
import { iconArrowDropdown, iconChevronLeft, iconChevronRight } from './icons.js';

export class DatePicker extends DatePickerMixin(LitElement) implements DatePickerInterface {
  //#region public properties
  //#endregion public properties

  //#region private states
  @state()
  private _currentDate!: Date;

  @state()
  private _hasMax!: boolean;

  @state()
  private _hasMin!: boolean;

  @state()
  private _max!: Date;

  @state()
  private _maxDate!: Date;

  @state()
  private _min!: Date;

  @state()
  private _selectedDate!: Date;

  @state()
  private _lastSelectedDate!: Date;

  @state()
  private _startView: CalendarView = 'calendar';
  //#endregion private states

  //#region private properties
  #formatters: Formatters;
  #yearList: number[];
  private _TODAY_DATE: Date;
  //#endregion private properties

  public static styles = [
    resetShadowRoot,
    css`
    `,
  ];

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this._min = new Date(todayDate);
    this._max = new Date(MAX_DATE);
    this._TODAY_DATE = todayDate;
    this.#yearList = toYearList(todayDate, MAX_DATE);
    this._selectedDate = new Date(todayDate);
    this._currentDate = new Date(todayDate);
    this.#formatters = toFormatters(this.locale);
  }

  protected update(changedProperties: ChangeProperties<DatePickerElementInterface>): void {
    super.update(changedProperties);

    if (changedProperties.has('locale')) {
      this.#formatters = toFormatters(this.locale);
    }

    if (changedProperties.has('startView')) {
      const oldStartView = changedProperties.get('startView') as CalendarView;

      if (!calendarViews.includes(this.startView)) {
        this._startView = this.startView = oldStartView;
      }
    }

    if (changedProperties.has('value')) {
      const oldValue = toResolvedDate(
        changedProperties.get('value') as string
      ) || this._TODAY_DATE;
      const { date } = dateValidator(this.value, oldValue);

      this._currentDate = new Date(date);
      this._selectedDate = this._lastSelectedDate = new Date(date);
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

      this.#yearList = toYearList(min, max);
      this._currentDate = adjustedCurrentDate;
      this._selectedDate = this._lastSelectedDate = new Date(adjustedCurrentDate);
      this.value = toDateString(adjustedCurrentDate);
    }
  }

  protected firstUpdated(changedProperties: ChangeProperties<DatePickerElementInterface>): void {
    super.firstUpdated(changedProperties);

    const focusableElements: HTMLElement[] = [];

    // TODO: focus element
    if (this._startView === 'calendar') {
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

  protected updated(changedProperties: ChangeProperties<DatePickerElementInterface>): void {
    super.updated(changedProperties);

    if (this._startView === 'calendar') {
      // TODO: Do stuff for calendar
    } else if (this._startView === 'yearList') {
      // TODO: Do stuff for year list
    }
  }

  protected render(): TemplateResult {
    const {
      longMonthFormat,
      yearFormat,
    } = this.#formatters;
    const currentDate = this._currentDate;
    const selectedMonth = longMonthFormat(currentDate);
    const selectedYear = yearFormat(currentDate);

    return html`
    <div>
      ${JSON.stringify({
        max: this.max,
        min: this.min,
        disabledDates: this.disabledDates,
        disabledDays: this.disabledDays,
        dragRatio: this.dragRatio,
        firstDayOfWeek: this.firstDayOfWeek,
        inline: this.inline,
        landscape: this.landscape,
        locale: this.locale,
        showWeekNumber: this.showWeekNumber,
        startView: this.startView,
        value: this.value,
        weekLabel: this.weekLabel,
        weekNumberType: this.weekNumberType,
      } as DatePickerElementInterface, null, 2)}
    </div>

    <div class="header">
      <div class="month-and-year-selector">
        <div class="selected-month">${selectedMonth}</div>
        <div class="selected-year">${selectedYear}</div>
      </div>

      <div class="month-dropdown">
        <mwc-icon-button label=${this.yearDropdownLabel}>${iconArrowDropdown}</mwc-icon-button>
      </div>

      <div class="month-pagination">
        <mwc-icon-button label=${this.previousMonthLabel}>${iconChevronLeft}</mwc-icon-button>
        <mwc-icon-button label=${this.nextMonthLabel}>${iconChevronRight}</mwc-icon-button>
      </div>
    </div>

    <div class="body"></div>
    `;
  }
}
