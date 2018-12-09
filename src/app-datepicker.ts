import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';

import '@polymer/paper-icon-button/paper-icon-button-light';

import './app-datepicker-icons.js';
import { calendar } from './calendar.js';
import { iconChevronLeft, iconChevronRight } from './app-datepicker-icons.js';
import { resetButton } from './common-styles.js';

function getResolvedLocale() {
  return (Intl
    && Intl.DateTimeFormat
    && Intl.DateTimeFormat().resolvedOptions
    && Intl.DateTimeFormat().resolvedOptions().locale)
    || 'en-US';
}

function renderHeaderSelectorButton({
  locale,
  selectedDate,
  selectedView,
  updateViewFn,
}) {
  const dateDate = new Date(selectedDate);
  const formattedDate = Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(dateDate);
  const isCalendarView = selectedView === 'calendar';

  return html`
  <button class="${classMap({
    'btn__selector-year': true,
    selected: !isCalendarView,
  })}"
    view="year"
    @click="${() => updateViewFn('year')}">${dateDate.getUTCFullYear()}</button>
  <div class="datepicker-toolbar">
    <button class="${classMap({
      'btn__selector-calendar': true,
      selected: isCalendarView,
    })}"
      view="calendar"
      @click="${() => updateViewFn('calendar')}">${formattedDate}</button>
  </div>
  `;
}

function computeCalendarContent({
  min,
  max,

  locale,
  firstDayOfWeek,
  showWeekNumber,
  weekNumberType,

  selectedDate,
  todayDate,
  disabledDays,
}) {
  let hasMinDate = false;
  let hasMaxDate = false;

  const fixedDisableDays = Array.isArray(disabledDays) && disabledDays.length > 0
    ? disabledDays.map(n => showWeekNumber ? n + 1 : n)
    : [];
  const {
    daysInMonth,
    weekdays,
  } = calendar({
    firstDayOfWeek,
    locale,
    selectedDate,
    showWeekNumber,
    weekNumberType,
  });

  const calendarContent = html`
  <table class="calendar-table"
    tabindex="0">
    <tr class="calendar-weekdays">
    ${cache(repeat(
      weekdays,
      n => `${n.label}::${n.value}`,
      n => html`<th aria-label="${n.label}">${n.value}</th>`))}
    </tr>

    ${cache(repeat(
      daysInMonth,
      n => n.toString(),
      (n) => {
        const minDate = new Date(min);
        const maxDate = new Date(max);
        const rendered = html`${cache(repeat(
          n,
          nn => nn.fullDate == null ? performance.now() : nn.fullDate,
          (nn, nni) => {
            /** NOTE: Disable month selector if needed */
            const oriTimestamp = +new Date(nn.fullDate!);
            const minTimestamp = +minDate;
            const maxTimestamp = +maxDate;
            hasMinDate = hasMinDate
              || (nn.fullDate == null ? false : oriTimestamp === minTimestamp);
            hasMaxDate = hasMaxDate
              || (nn.fullDate == null ? false : oriTimestamp === maxTimestamp);

            return nn.label == null
              ? html`<td class="full-calendar__day day--empty"></td>`
              : html`
              <td
                class="${classMap({
                  'full-calendar__day': true,
                  'day--disabled': fixedDisableDays.some(n => n === nni)
                    || (oriTimestamp < minTimestamp || oriTimestamp > maxTimestamp),
                  'day--today': +todayDate === oriTimestamp,
                  'day--selected': +selectedDate === oriTimestamp,
                  'day--weekday': showWeekNumber && nni < 1,
                })}"
                aria-label="${nn.label}"
                full-date="${nn.fullDate}"
                day="${nn.value}">
                <div class="calendar-day">${nn.value}</div>
              </td>`;
          }))}`;

        return html`<tr>${rendered}</tr>`;
      }
    ))}
  </table>`;

  return {
    hasMinDate,
    hasMaxDate,
    value: calendarContent,
  };
}

function renderDatepickerBody({
  calendarContent,
  locale,
  selectedDate,
  selectedView,
}) {
  if (selectedView === 'calendar') {
    const formattedDate = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
    }).format(new Date(selectedDate));

    return html`
    <div class="datepicker-body__calendar-view">
      <div class="calendar-view__month-selector">
        <div class="month-selector-container">
          <paper-icon-button-light>
            <button
              class="month-selector-button"
              aria-label="Previous month">${iconChevronLeft}</button>
          </paper-icon-button-light>
        </div>

        <div class="month-selector__selected-month">${formattedDate}</div>

        <div class="month-selector-container">
          <paper-icon-button-light>
            <button
              class="month-selector-button"
              aria-label="Next month">${iconChevronRight}</button>
          </paper-icon-button-light>
        </div>
      </div>

      <div class="calendar-view__full-calendar">${calendarContent.value}</div>
    </div>
    `;
  }

  return html`
  <div class="datepicker-body__year-view">
    <div class="year-view__full-list">
    ${cache(repeat(
      Array.from(Array(2100 - 1900 + 1), (_, i) => 1900 + i),
      n => n,
      (n) => html`<button class="year-view__list-item" .year="${n}">${n}</button>`))}
    </div>
  </div>
  `;
}

@customElement(AppDatepicker.is as any)
export class AppDatepicker extends LitElement {
  static get is() {
    return 'app-datepicker';
  }

  public constructor() {
    super();

    this._updateView = this._updateView.bind(this);
  }

  @property({ type: String })
  public min: string = '1970-01-01T00:00:00.000Z';

  @property({ type: String })
  public max: string = '2100-12-31T23:59:59.999Z';

  @property({ type: Date })
  public value: string = 'yyyy-MM-dd';

  @property({ type: Number })
  public firstDayOfWeek: number = 0;

  @property({ type: Boolean })
  public showWeekNumber: boolean = false;

  @property({ type: String })
  public weekNumberType: string = 'first-4-day-week';

  @property({ type: String })
  public disableDays: string = '0,6';

  @property({ type: String })
  public disableDates: string;

  @property({ type: String })
  public format: string = 'yyyy-MM-dd';

  @property({ type: String })
  public orientation: string = 'portrait';

  @property({ type: String })
  public theme: string = 'material';

  @property({ type: String })
  public locale: string = getResolvedLocale();

  @property({ type: String })
  public startView: string;

  @property({ type: String })
  private _selectedView: string = 'calendar';

  @property({ type: Date })
  private _selectedDate: Date = new Date();

  // valueAsDate: Date,
  // valueAsNumber: Number,
  // weekdayFormat: String,
  // showWeekNumber: Boolean,

  protected render() {
    const locale = this.locale;
    const disabledDays = this.disableDays;
    const firstDayOfWeek = this.firstDayOfWeek;
    const min = this.min;
    const max= this.max;
    const showWeekNumber = this.showWeekNumber;
    const weekNumberType = this.weekNumberType;

    const selectedDate = this._selectedDate;
    const selectedView = this._selectedView;

    const todayDate = new Date();
    const calendarContent = computeCalendarContent({
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      selectedDate,
      showWeekNumber,
      todayDate,
      weekNumberType,
    });

    return html`
    ${resetButton}
    <style>
      :host {
        display: block;
        width: var(--app-datepicker-width);
        /** NOTE: Magic number as 16:9 aspect ratio does not look good */
        /* height: calc((var(--app-datepicker-width) / .66) - var(--app-datepicker-footer-height, 56px)); */
        background-color: #fff;
        border-radius: var(--app-datepicker-border-radius);
        overflow: hidden;

        --app-datepicker-width: 300px;
        /* --app-datepicker-primary-color: #4285f4; */
        --app-datepicker-primary-color: #1a73e8;
        --app-datepicker-border-radius: 12px;
        --app-datepicker-header-height: 80px;
      }

      * {
        box-sizing: border-box;
      }

      .datepicker-header + .datepicker-body {
        border-top: 1px solid #ddd;
      }

      .datepicker-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        position: relative;
        padding: 16px 24px;
        /* height: var(--app-datepicker-header-height); */
      }

      .btn__selector-year,
      .btn__selector-calendar {
        color: rgba(0, 0, 0, .55);
      }
      .btn__selector-year.selected,
      .btn__selector-calendar.selected {
        color: currentColor;
      }

      .btn__selector-year {
        font-size: 16px;
        font-weight: 700;
      }
      .btn__selector-calendar {
        font-size: 36px;
        font-weight: 700;
        line-height: 1;
      }

      .datepicker-body {
        position: relative;
      }

      .calendar-view__month-selector {
        display: flex;
        flex-direction: row;
        align-items: center;

        padding: 0 8px;
      }

      .month-selector-container > paper-icon-button-light {
        max-width: 56px;
        max-height: 56px;
        height: 56px;
        width: 56px;
        color: rgba(0, 0, 0, .25);
      }

      .month-selector-button {
        padding: calc((56px - 24px) / 2);
      }

      .month-selector__selected-month {
        flex: 1 0 auto;

        max-width: calc(100% - 56px * 2);
        width: 100%;
        font-weight: 500;
        text-align: center;
      }

      .calendar-view__full-calendar {
        display: flex;
        flex-direction: row;
        justify-content: center;

        padding: 0 0 16px;
      }

      .year-view__full-list {
        max-height: calc(48px * 7);
        overflow-y: auto;
      }

      .calendar-weekdays > th {
        color: rgba(0, 0, 0, .7);
        font-weight: 500;
      }

      .calendar-table {
        max-width: calc(100% - 16px * 2);
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        outline: none;
      }

      tr > th,
      tr > td {
        position: relative;
        min-width: calc(100% / 7);
        min-height: 40px;
        width: calc(100% / 7);
        height: 40px;
        padding: 8px 0;
      }

      tr > td.full-calendar__day:not(.day--empty)::after {
        content: '';
        display: block;
        position: absolute;
        width: 40px;
        height: 40px;
        top: 50%;
        left: 50%;
        background-color: var(--app-datepicker-primary-color);
        border-radius: 50%;
        transform: translate3d(-50%, -50%, 0);
        will-change: transform;
        opacity: 0;
        pointer-events: none;
      }

      tr > td.full-calendar__day > .calendar-day {
        position: relative;
        color: #000;
        z-index: 1;
      }

      .year-view__list-item {
        width: 100%;
        padding: 12px 16px;
        text-align: center;
      }
      .year-view__list-item.selected {
        color: var(--app-datepicker-primary-color);
        font-size: 24px;
        font-weight: 500;
      }

      /* .header__selector {
        width: 100%;
        padding: 0 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .selector__year,
      .selector__calendar {
        color: #fff;
        opacity: .7;
        text-overflow: ellipsis;
        overflow: hidden;
        display: flex;
        flex-direction: row;
      }
      .selector__year.iron-selected,
      .selector__calendar.iron-selected {
        opacity: 1;
      }
      .selector__year:hover,
      .selector__calendar:hover {
        cursor: pointer;
      }
      .selector__year {
        font-size: 14px;
      }
      .selector__calendar {
        font-size: 28px;
      }

      .main__selector > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 250ms cubic-bezier(0, 0, .4, 1);
        pointer-events: none;
      }
      .main__selector > .iron-selected {
        opacity: 1;
        pointer-events: auto;
      }
      .main__selector > .selector__view-year > .view-year__year-list,
      .main__selector > .selector__view-calendar > * {
        display: none;
      }
      .main__selector > .selector__view-year.iron-selected > .view-year__year-list,
      .main__selector > .selector__view-calendar.iron-selected > * {
        display: flex;
      }
      .selector__view-year {
        overflow: auto;
      }
      .selector__view-year > .view-year__year-list {
        display: flex;
        flex-direction: column;
        overflow: auto;
      }
      .selector__view-year > .view-year__year-list > .year-list__year {
        color: #212121;
        font-size: 16px;
        padding: 16px;
      }
      .selector__view-year > .view-year__year-list > .year-list__year.iron-selected {
        color: var(--app-datepicker-primary-color);
        font-size: 24px;
        font-weight: 700;
        --paper-button-ink-color: #848484;
      }
      .selector__view-year > .view-year__year-list > .year-list__year:hover {
        cursor: pointer;
      }
      .selector__view-calendar {}
      .view-calendar__month-selector {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .view-calendar__month-selector > .month-selector__prev-month,
      .view-calendar__month-selector > .month-selector__next-month {
        position: absolute;
        top: -3px;
        width: 56px;
        height: 56px;
        padding: 16px;
      }
      .view-calendar__month-selector > .month-selector__prev-month {
        left: 8px;
      }
      .view-calendar__month-selector > .month-selector__next-month {
        right: 8px;
      }
      .view-calendar__month-selector > .month-selector__prev-month.prev-month--disabled,
      .view-calendar__month-selector > .month-selector__next-month.next-month--disabled {
        display: none;
      }
      .view-calendar__full-calendar {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      table,
      tr,
      td,
      th {
        margin: 0;
        padding: 0;
        border-collapse: collapse;
        border: 1px solid #ddd;
      }
      .view-calendar__full-calendar > table {
        width: calc(100% - 8px * 2);
        padding: 0 8px;
      }
      .view-calendar__full-calendar > table tr > th,
      .view-calendar__full-calendar > table tr > td {
        position: relative;
        width: calc(100% / 7);
        text-align: center;
      }
      .view-calendar__full-calendar.has-week-number > table tr > th,
      .view-calendar__full-calendar.has-week-number > table tr > td {
        width: calc(100% / 8);
      }
      .view-calendar__full-calendar.has-week-number > table tr > td:first-of-type {
        color: var(--app-datepicker-week-number-color, var(--app-datepicker-primary-color));
        opacity: .7;
      }
      .view-calendar__full-calendar > table tr > td:after {
        display: block;
        content: '';
        margin-top: 100%;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day:empty
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--empty:empty,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--empty,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--weekday {
        cursor: unset;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled {
        color: rgba(0, 0, 0, .26);
        cursor: not-allowed;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today.day--selected > span,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled.day--selected > span,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today.day--disabled.day--selected > span,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--selected > span {
        color: var(--app-datepicker-selected-day-color, #fff);
        z-index: 1;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today.day--selected:after,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled.day--selected:after,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today.day--disabled.day--selected:after,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--selected:after {
        position: absolute;
        display: block;
        content: '';
        width: 40px;
        height: 40px;
        background-color: var(--app-datepicker-selected-day-bg, var(--app-datepicker-primary-color));
        border-radius: 50%;
        z-index: 0;
      }
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled.day--today,
      .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today {
        color: var(--app-datepicker-today-color, var(--app-datepicker-primary-color));
      } */

    </style>

    <div class="datepicker-header">
    ${cache(renderHeaderSelectorButton({ locale, selectedDate, selectedView, updateViewFn: this._updateView }))}
    </div>

    <div class="datepicker-body">
    ${cache(renderDatepickerBody({ calendarContent, locale, selectedDate, selectedView }))}
    </div>
    `;
  }

  private _updateView(view: string) {
    this._selectedView = view;
  }

  // //  Month Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  // //  Days   31  28  31  30  31  30  31  31  30  31  30  31
  // //   31?    0       2       4       6   7       9      11
  // //   30?                3       5           8      10
  // //  Feb?        1
  // //  Su Mo Tu We Th Fr Sa    startDay - _firstDayOfWeek
  // //                  1  2        5 - 0 < 0 ? 6 : 5 - 0;
  // //  Mo Tu We Th Fr Sa Su
  // //               1  2  3        5 - 1 < 0 ? 6 : 5 - 1;
  // //  Tu We Th Fr Sa Su Mo
  // //            1  2  3  4        5 - 2 < 0 ? 6 : 5 - 2;
  // //  We Th Fr Sa Su Mo Tu
  // //         1  2  3  4  5        5 - 3 < 0 ? 6 : 5 - 3;
  // //  Th Fr Sa Su Mo Tu We
  // //      1  2  3  4  5  6        5 - 4 < 0 ? 6 : 5 - 4;
  // //  Fr Sa Su Mo Tu We Th
  // //   1  2  3  4  5  6  7        5 - 5 < 0 ? 6 : 5 - 5;
  // //  Sa Su Mo Tu We Th Fr
  // //                     1        5 - 6 < 0 ? 6 : 5 - 6;
  // // Compute the days for a month.
  // _computeDaysOfMonth(_activeYear, _activeMonth, _firstDayOfWeek, _locale) {
  //   // No op for Intl is undefined (for Safari below v10.x.x).
  //   if (!window.Intl) {
  //     return;
  //   }

  //   // Compute total number of days for a month.
  //   function _computeTotalDaysOfMonth(_year, _month) {
  //     var _totalDaysOfMonth = new Date(_year, _month + 1, 0).getDate();
  //     return _totalDaysOfMonth;
  //   }

  //   var _start = new Date(_activeYear, _activeMonth, 1).getDay();
  //   var _daysOfMonth = [];
  //   var _totalDays = _computeTotalDaysOfMonth(_activeYear, _activeMonth);

  //   //  if _firstDayOfWeek is greater than 0 but less than 7.
  //   if (_firstDayOfWeek > 0 && _firstDayOfWeek < 7) {
  //     _start = _start - _firstDayOfWeek;
  //     _start = _start < 0 ? 7 + _start : _start;
  //   }

  //   // Set up Intl.
  //   _locale = _locale || ((window.Intl
  //     && window.Intl.DateTimeFormat
  //     && window.Intl.DateTimeFormat().resolvedOptions
  //     && window.Intl.DateTimeFormat().resolvedOptions().locale)
  //     || "en-US");
  //   var _formatter = window.Intl && window.Intl.DateTimeFormat
  //     ? new window.Intl.DateTimeFormat(_locale, { timeZone: "UTC", day: "numeric" }).format
  //     : function dateTimeFormatShim(date) { return date.getDate() };
  //   for (var i = 0, j = 1 - _start; i < 42; i++ , j++) {
  //     var _formatted = _formatter(new Date(Date.UTC(_activeYear, _activeMonth, j)));
  //     var _dateObj = { date: "", index: "" };
  //     if (i >= _start & i < _start + _totalDays) {
  //       /**
  //        * NOTE: Coercing "_formatted" to a number will cause
  //        * dates in other languages that contain other character
  //        * to become a NaN.
  //        */
  //       _dateObj.date = _formatted;
  //       _dateObj.index = j;
  //     }
  //     _daysOfMonth.push(_dateObj);
  //   }

  //   // Update _chosenDaysOfMonth for every new calendar being rendered.
  //   this.set("_chosenDaysOfMonth", this._computeChosenDaysOfMonth(_daysOfMonth, this._selectedDate));

  //   // Update the old _daysOfMonth.
  //   this.set("_daysOfMonth", _daysOfMonth);
  // }
  // /// Re-compute disable days with firstDayOfWeek.
  // _computeShiftedDisableDays(_firstDayOfWeek, _isDisableDays) {
  //   _firstDayOfWeek = _firstDayOfWeek > 0 && _firstDayOfWeek < 7 ? _firstDayOfWeek : 0;
  //   var _sdd = this.disableDays.map(function (_day) {
  //     _day = _day - _firstDayOfWeek;
  //     return _day < 0 ? 7 + _day : _day;
  //   });
  //   this.set("_shiftedDisableDays", _sdd);
  // }

  // // Increment the month via user interaction.
  // _incrementMonth(ev) {
  //   this.debounce("_incrementMonth", function () {
  //     this.set("_isIncrementMonth", !0);
  //     window.requestAnimationFrame(function () {
  //       var _month = this._activeMonth;

  //       if (++_month % 12 === 0) {
  //         this._activeYear++;
  //       }
  //       this.set("_activeMonth", _month % 12);

  //       if (!this.noAnimation) {
  //         this.cancelAnimation();
  //         this.playAnimation("incrementEntry");
  //       }

  //       this.set("_isIncrementMonth", !1);
  //     }.bind(this));
  //   }, 100);
  // }

  // // Decrement the month via user interaction.
  // _decrementMonth(ev) {
  //   this.debounce("_decrementMonth", function () {
  //     this.set("_isDecrementMonth", !0);
  //     window.requestAnimationFrame(function () {
  //       var _month = this._activeMonth;

  //       if (--_month < 0) {
  //         this._activeYear--;
  //         _month = 11;
  //       }
  //       this.set("_activeMonth", _month);

  //       if (!this.noAnimation) {
  //         this.cancelAnimation();
  //         this.playAnimation("decrementEntry");
  //       }

  //       this.set("_isDecrementMonth", !1);
  //     }.bind(this));
  //   }, 100);
  // }

  // // Re-compute active month year if new date is selected.
  // _computeActiveMonthYear(_activeYear, _activeMonth, _locale) {
  //   if (window.Intl) {
  //     _locale = _locale || ((window.Intl
  //       && window.Intl.DateTimeFormat
  //       && window.Intl.DateTimeFormat().resolvedOptions
  //       && window.Intl.DateTimeFormat().resolvedOptions().locale)
  //       || "en-US");
  //     var _amy = new window.Intl.DateTimeFormat(_locale, {
  //       timeZone: "UTC",
  //       month: "short",
  //       year: "numeric"
  //     }).format(new Date(Date.UTC(_activeYear, _activeMonth, 1)));
  //     this.set("_activeMonthYear", _amy);
  //   }
  // }

  // // Re-compute short version of full date to show on the picker.
  // _computeShortSelectedDate(_selectedYear, _selectedMonth, _selectedDate, _locale) {
  //   if (window.Intl) {
  //     _locale = _locale || ((window.Intl
  //       && window.Intl.DateTimeFormat
  //       && window.Intl.DateTimeFormat().resolvedOptions
  //       && window.Intl.DateTimeFormat().resolvedOptions().locale)
  //       || "en-US");
  //     var _ssd = new window.Intl.DateTimeFormat(_locale, {
  //       timeZone: "UTC",
  //       weekday: "short",
  //       month: "short",
  //       day: "numeric"
  //     }).format(new Date(Date.UTC(_selectedYear, _selectedMonth, _selectedDate)));
  //     this.set("_shortSelectedDate", _ssd);

  //     // When datepicker has no button for date confirmation,
  //     // by asserting `autoUpdateDate` will trigger auto update on
  //     // date change.
  //     if (this.autoUpdateDate) {
  //       this.enforceDateChange();
  //     }
  //   }
  // }

  // _computeShowSelectedYear(_selectedYear, _locale) {
  //   if (window.Intl) {
  //     _locale = _locale || ((window.Intl
  //       && window.Intl.DateTimeFormat
  //       && window.Intl.DateTimeFormat().resolvedOptions
  //       && window.Intl.DateTimeFormat().resolvedOptions().locale)
  //       || "en-US");
  //     var _ssy = new window.Intl.DateTimeFormat(_locale, {
  //       timeZone: "UTC",
  //       year: "numeric"
  //     }).format(new Date(Date.UTC(_selectedYear, 0, 1)));
  //     this.set("_showSelectedYear", _ssy);
  //   }
  // }

  // // When a day of month is selected, a lot of tasks need to be carried out.
  // _chooseDaysOfMonth(ev) {
  //   var _target = ev.target;
  //   // daysOfMonth is chooseable when:
  //   // a) _target.date is of type Number,
  //   // b) _target.classList.contains("is-disabled-day").
  //   if (_target &&
  //     this._isNumber(_target.date) &&
  //     !_target.classList.contains("is-disabled-day")
  //   ) {
  //     // This will trigger _isChosenDaysOfMonth to recompute style.
  //     this.set("_chosenDaysOfMonth", _target.index);

  //     this.set("_selectedYear", this._activeYear);
  //     this.set("_selectedDate", _target.date);
  //     this.set("_selectedMonth", this._activeMonth);
  //   }
  // }

  // // Re-compute class when the item (day of month) is today"s date.
  // _isToday(_item, _activeYear, _activeMonth) {
  //   var _now = new Date();
  //   var _isToday = _item === _now.getDate() &&
  //     _activeYear === _now.getFullYear() &&
  //     _activeMonth === _now.getMonth()
  //   return _isToday ? " is-today" : "";
  // }

  // // Re-compute class when the item (day of month) is empty date & non-selectable.
  // _isEmptyDate(_item) {
  //   return this._isNumber(_item) ? "" : " is-non-selectable";
  // }

  // // Re-compute class if the item (day of month) is the selected date.
  // _isChosenDaysOfMonth(_item, _selectedYear, _selectedMonth, _selectedDate) {
  //   // able to retain selected daysOfMonth even after navigating to other months.
  //   var _isChosenDaysOfMonth = this._chosenDaysOfMonth >= 0 &&
  //     this._activeYear === _selectedYear &&
  //     this._activeMonth === _selectedMonth &&
  //     _item === _selectedDate;
  //   return _isChosenDaysOfMonth ? " chosen-days-of-month" : "";
  // }

  // // Re-compute class if the item (day of month) is a disable day.
  // _isDisableDays(_index, _firstDayOfWeek, _minDate, _maxDate, _item) {
  //   var _isLessThanMinDate = !1;
  //   var _isMoreThanMaxDate = !1;
  //   var _isDisableDay = !1;
  //   var _isDisableDates = false;
  //   // _index % 7 gives values from 0 to 6.
  //   // and if _index matches some of these disableDays values return true.
  //   var _isDisableDays = this._shiftedDisableDays.some(function (_n) {
  //     return _n === _index % 7;
  //   });
  //   // ------ < _minDate ---------------- _maxDate > ------
  //   // if _item is of type Number.
  //   // if converted _item into new Date() < minDate or > maxDate.
  //   if (this._isNumber(_item)) {
  //     var _minDateObj = this._convertDateStringToDateObject(_minDate);
  //     var _maxDateObj = this._convertDateStringToDateObject(_maxDate);
  //     var _currentDate = new Date(this._activeYear, this._activeMonth, _item);
  //     // run two different obj differently just in case only one of them
  //     // is defined and still be able to update disabled days.
  //     if (_minDateObj) {
  //       _isLessThanMinDate = _currentDate.getTime() < _minDateObj.getTime();
  //     }
  //     if (_maxDateObj) {
  //       _isMoreThanMaxDate = _currentDate.getTime() > _maxDateObj.getTime();
  //     }
  //     _isDisableDates = this.disableDates && this.disableDates.length && this.disableDates.some(function (date) {
  //       var _dateObj = this._convertDateStringToDateObject(date);
  //       return _dateObj && _currentDate.getTime() === _dateObj.getTime();
  //     }.bind(this));
  //   }
  //   // To disable a date, it must be either one of the followings:
  //   // a) _isDisabledDays (set by property disableDays),
  //   // b) _isDisableDates (set by property disableDates),
  //   // c) _isLessThanMinDate (set by property minDate), and
  //   // d) _isMoreThanMaxDate (set by propery moreDate).
  //   _isDisableDay = _isDisableDays || _isDisableDates || _isLessThanMinDate || _isMoreThanMaxDate;
  //   return _isDisableDay ? " is-disabled-day is-non-selectable" : "";
  // }

  // // Re-compute class when a year is selected at year page.
  // _isListOfYearsSelected(selectedYear, year) {
  //   return +selectedYear === +year ? " is-selected" : "";
  // }

  // _computeDaysOfWeek(_firstDayOfWeek, _locale) {
  //   // _daysOfWeek needs to be changed as well with firstDayOfWeek and locale.
  //   var _dow = ["S", "M", "T", "W", "T", "F", "S"];
  //   var _firstDayOfWeek = _firstDayOfWeek > 0 && _firstDayOfWeek < 7 ? _firstDayOfWeek : 0;

  //   // if locale is set and window.Intl is supported...
  //   if (_locale && window.Intl) {
  //     _dow = [];
  //     var _today = new Date();
  //     var _offsetDate = _today.getDate() - _today.getDay();
  //     var _formatter = new window.Intl.DateTimeFormat(_locale, {
  //       timeZone: "UTC",
  //       weekday: "narrow"
  //     }).format;
  //     var newDate = null;

  //     for (var i = 0; i < 7; i++) {
  //       newDate = new Date(Date.UTC(_today.getFullYear(), _today.getMonth(), _offsetDate + i));
  //       _dow.push(_formatter(newDate));
  //     }
  //   }

  //   var _sliced = _dow.slice(_firstDayOfWeek);
  //   var _rest = _dow.slice(0, _firstDayOfWeek);
  //   var _concatted = Array.prototype.concat(_sliced, _rest);

  //   this.set("_daysOfWeek", _concatted);
  // }

  // // Re-compute the index of the selected date when a new date is selected
  // // via user interaction.
  // _computeChosenDaysOfMonth(_daysOfMonth, _selectedDate) {
  //   // depends on _daysOfMonth and recalculate the index of _chosenDaysOfMonth.
  //   var _len = _daysOfMonth.length;
  //   for (var i = 0; i < _len; i++) {
  //     if (i >= 0 && _daysOfMonth[i].index === _selectedDate) {
  //       return i;
  //     }
  //   }
  // }

  // // Convert date string into date object.
  // _convertDateStringToDateObject(_date) {
  //   var _checkDate = _date instanceof Date || typeof _date !== "string" ? _date : new Date(_date);
  //   var _isValidDate = _checkDate.toDateString() !== "Invalid Date";
  //   return _isValidDate ? _checkDate : null;
  // }

  // // Dynamically load items into the iron-list when switching page to year view.
  // _updateList(_activeView) {
  //   for (var _newList = [], y = 1900, i = y; i <= 2100; i++) {
  //     _newList.push({ year: i });
  //   }
  //   this.set("_listOfYears", _newList);
  // }

  // // On neon-animaition-finish, udpate scroller position of the iron-list.
  // // It is to fix the iron-list so that the selected year will always be centered by
  // // hardcoded with fixed length of #items.
  // _onAnimationFinish(ev) {
  //   var _target = ev.detail;
  //   // TO fix the scrolling of iron-list, hard coded with fixed length of #items.
  //   if (_target && _target.toPage.tagName === "IRON-LIST") {
  //     var _focusableItem = this._updateListScroller(_target.toPage);
  //     // Automatically focus selected list of year at year view.
  //     this.async(function () {
  //       _target.toPage._focusPhysicalItem(_focusableItem);
  //     }, 1);
  //   } else {
  //     // When user navigate to calendar view from list view,
  //     // re-focus showSelectedYear.
  //     this.async(function () {
  //       this.$.showSelectedYear.focus();
  //     }, 1);
  //   }
  // }

  // _updateListScroller(_list) {
  //   var _sl = dom(_list.root).querySelector("#items");
  //   var _slh = _sl.getBoundingClientRect().height || 12863.994140625;
  //   var _sli = Math.floor(_slh / (2100 - 1900 + 1) * (this._activeYear - 1900 - 2)) + 1;

  //   // Adjust center position when datepickers has no buttons and in landscape mode.
  //   if (!this.$.dp.classList.contains("with-buttons") &&
  //     window.matchMedia("(orientation: landscape)").matches) {
  //     _sli = Math.floor(_slh / (2100 - 1900 + 1) * (this._activeYear - 1900 - 1)) + 1;
  //   }

  //   // Scroll to selected year.
  //   this.async(function () {
  //     _list.scroll(0, _sli);
  //     // Select initial item for the list.
  //     _list.selectItem(this._activeYear - 1900);
  //   }, 17); // wait for at least 17ms to update the scroller position.

  //   // Return index of item that should be focused on the list.
  //   return this._activeYear - 1900;
  // }

  // // When first time switching page to year view, dynamically render iron-list.
  // _onIronSelectorSelectedChanged(ev) {
  //   if (ev.detail.value === "year") {
  //     if (!this._isListRendered) {
  //       this._updateList();
  //       this.set("_isListRendered", !0);
  //     } else {
  //       // When noAnimation is truthy, this will update the list scroller.
  //       if (this.noAnimation) {
  //         this._updateListScroller(this.$$("#listOfYears"));
  //       }
  //     }
  //   }
  // }

  // _onListRendered(ev) {
  //   // When noAnimation is truthy, this will update the list scroller.
  //   if (ev.target.if && this.noAnimation) {
  //     this.async(function () {
  //       this._updateListScroller(this.$$("#listOfYears"));
  //     }, 1);
  //   }
  // }

  // _goCalendar(ev) {
  //   // Listen for enter key from keyboard.
  //   if (ev.type === "keydown" && ev.keyCode !== 13) {
  //     return;
  //   }

  //   var _selectedYear = ev.model.item.year;
  //   // Set _activeYear and _selectedYear to the selected year.
  //   this.set("_activeYear", _selectedYear);
  //   this.set("_selectedYear", _selectedYear);
  //   // Update selected item in iron-list.
  //   this.$$("#listOfYears").selectItem(_selectedYear - 1900);

  //   // Go back to calendar page.
  //   this.set("_activeView", "calendar");
  // }

  // // split capturing group of format into year, month and date.
  // _computeSeparateFormat(_format) {
  //   var re = /^(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)$/g;
  //   var m = re.exec(_format);
  //   var _temp = {};
  //   var _tempArr = [];
  //   if (m !== null) {
  //     _tempArr.push(m[1]);
  //     _tempArr.push(m[2]);
  //     _tempArr.push(m[3]);

  //     for (var i = 0, matched; i < 3; i++) {
  //       matched = _tempArr[i];

  //       if (matched.indexOf("y") >= 0) {
  //         _temp.y = matched;
  //       } else if (matched.indexOf("m") >= 0) {
  //         _temp.m = matched;
  //       } else if (matched.indexOf("d") >= 0) {
  //         _temp.d = matched;
  //       }
  //     }
  //   }

  //   // Only set _format if the new format is valid.
  //   if ("d" in _temp && "m" in _temp && "y" in _temp) {
  //     this.set("_format", _temp);
  //   }

  //   _temp = null;
  // }

  // // bind the selected date so that it"s ready to be read from the outside world.
  // _bindSelectedFulldate(_selectedYear, _selectedMonth, _selectedDate, _format) {
  //   // show long date (eg. Fri, May 12 2017 instead.
  //   if (this.showLongDate) {
  //     return this._computeShowLongDate(this.showLongDate, this.locale, !0);
  //   }

  //   var _formattedYear = _selectedYear;
  //   var _formattedMonth = this._monthNames[_selectedMonth];
  //   var _formattedDate = _selectedDate;
  //   var _finalFormatted = this.format;
  //   // compute new formatted year.
  //   if (_format.y === "yy") {
  //     _formattedYear = _selectedYear % 100;
  //   }
  //   // compute new formatted month.
  //   if (_format.m === "mmm") {
  //     _formattedMonth = _formattedMonth.slice(0, 3);
  //   } else if (_format.m === "mm") {
  //     _formattedMonth = this._padStart(_selectedMonth + 1, 2, "0");
  //   } else if (_format.m === "m") {
  //     _formattedMonth = _selectedMonth + 1;
  //   }
  //   // compute new formatted date.
  //   if (_format.d === "do") {
  //     var _cardinalNumber = _formattedDate % 10;
  //     var _suffixOrdinal = _cardinalNumber > 3 ? "th" :
  //       ["th", "st", "nd", "rd"][_cardinalNumber];
  //     if (_formattedDate === 11 || _formattedDate == 12 || _formattedDate === 13) {
  //       _suffixOrdinal = "th";
  //     }
  //     _formattedDate = _formattedDate + _suffixOrdinal;
  //   } else if (_format.d === "dd") {
  //     _formattedDate = this._padStart(_formattedDate, 2, "0");
  //   }
  //   // set formatted value with user defined symbols.
  //   _finalFormatted = _finalFormatted.replace(_format.y, _formattedYear);
  //   _finalFormatted = _finalFormatted.replace(_format.m, _formattedMonth);
  //   _finalFormatted = _finalFormatted.replace(_format.d, _formattedDate);

  //   return _finalFormatted;
  // }

  // // method for content tag (eg. buttons).
  // _updateBindDate(ev) {
  //   this.debounce("_updateBindDate", function () {
  //     var _type = ev.type;
  //     if (_type === "tap") {
  //       this.set("_isSelectedDateConfirmed", !0);
  //     }

  //     if (_type === "transitionend" || this.noAnimation) {
  //       if (this._isSelectedDateConfirmed) {
  //         var _sy = this._selectedYear;
  //         var _sm = this._selectedMonth;
  //         var _sd = this._selectedDate;
  //         var _f = this._format
  //         var _confirmDate = this._bindSelectedFulldate(_sy, _sm, _sd, _f);
  //         this._setDate(_confirmDate);
  //         this.set("_isSelectedDateConfirmed", !1);

  //         if (this.alwaysResetSelectedDateOnDialogClose) {
  //           this.resetDate();
  //         }
  //       }
  //     }
  //   }, 1);
  // }

  // // Update date to show long date or short date.
  // _computeShowLongDate(_showLongDate, _locale, _returnResult) {
  //   if (!window.Intl || !this._selectedDate || typeof this._selectedDate === "undefined") {
  //     return;
  //   }

  //   var _selectedDate = this._selectedDate;
  //   var _longDate = new Date(Date.UTC(this._selectedYear, this._selectedMonth, _selectedDate));

  //   if (_showLongDate) {
  //     _locale = _locale || ((window.Intl
  //       && window.Intl.DateTimeFormat
  //       && window.Intl.DateTimeFormat().resolvedOptions
  //       && window.Intl.DateTimeFormat().resolvedOptions().locale)
  //       || "en-US");
  //     var _options = {
  //       timeZone: "UTC",
  //       weekday: this.showLongDate ? "short" : undefined,
  //       year: "numeric",
  //       month: this.showLongDate ? "short" : "2-digit",
  //       day: "2-digit"
  //     };
  //     _longDate = new window.Intl.DateTimeFormat(_locale, _options).format(_longDate);

  //     if (_returnResult) {
  //       return _longDate;
  //     }

  //     // Fix for notorious IE - add unknown spaces (%E2%80%8E) when formatting date with Intl.
  //     // http://utf8-chartable.de/unicode-utf8-table.pl?start=8192&number=128
  //     if (window.navigator.msManipulationViewsEnabled) {
  //       if (_locale || _locale === "") {
  //         _longDate = decodeURIComponent(encodeURIComponent(_longDate).replace(/\%E2\%80\%8[0-9A-F]/gi, ""));
  //       }
  //     }

  //     this._setDate(_longDate);
  //   } else {
  //     _longDate = this._bindSelectedFulldate(this._selectedYear,
  //       this._selectedMonth, _selectedDate, this._format);

  //     if (_returnResult) {
  //       return _longDate;
  //     }

  //     this._setDate(_longDate);
  //   }
  // }

  // // TO make things simple and works across different browsers, the input date string
  // // has to be standardized - YYYY/MM/DD.
  // // http://dygraphs.com/date-formats.html
  // _updateToReflectExternalChange(_inputDate) {
  //   // Due to limitation of input date received by platform"s Date,
  //   // inputDate was designed to only be able to accept inputs for the followings:
  //   // short date for all locales in the format of yyyy/mm/dd or yyyy/d/m eg. 2016/06/06.
  //   // long formatted date for en and en-* locale **ONLY** eg. Tue, Jul 5, 2016.
  //   if (this.showLongDate && this.locale.indexOf("en") < 0) {
  //     this._setInvalidDate(!0);
  //     return;
  //   }
  //   // accepted input date string:
  //   // 1. 2016 January 31
  //   // 2. 2016 January 3
  //   // 3. 2016 Jan 31
  //   // 4. 2016 Jan 3
  //   // 5. 2016/13/13
  //   function validateDate(_id, _showLongDate) {
  //     var _res = {
  //       valid: !1,
  //       result: ""
  //     };
  //     // Check if long input date is a valid date.
  //     if (_showLongDate) {
  //       var _ds = _id.split(", ");
  //       if (_ds.length > 2) {
  //         _ds = _ds[1].split(" ").join("/") + ", " + _ds[2];
  //         var _newDate = new Date(_ds);
  //         if (_newDate.toString() === "Invalid Date") {
  //           return _res;
  //         } else {
  //           return {
  //             valid: !0,
  //             result: _newDate
  //           };
  //         }
  //       }

  //       return _res;
  //     }

  //     // From here onwards, to check for short input date.
  //     var _re1 = /^(\d{4})\W+(\d{1,2})\W+(\d{1,2})$/i;
  //     var _re2 = /^(\d{4})[ ](\w+)[ ](\d{1,2})$/i;

  //     var _validWithRe1 = _re1.exec(_id);
  //     var _validWithRe2 = _re2.exec(_id);

  //     if (_validWithRe1 === null && _validWithRe2 === null) {
  //       return _res;
  //     } else {
  //       var _resultToDate = null;
  //       if (_validWithRe1 === null) {
  //         _resultToDate = new Date(_validWithRe2[1] + " " + _validWithRe2[2] + " " + _validWithRe2[3]);
  //       } else if (_validWithRe2 === null) {
  //         _resultToDate = new Date(+_validWithRe1[1], +_validWithRe1[2] - 1, +_validWithRe1[3]);
  //       }

  //       return {
  //         valid: !0,
  //         result: _resultToDate
  //       };
  //     }
  //   }

  //   var _showLongDate = this.showLongDate;
  //   var _yy = 0;
  //   var _mm = 0;
  //   var _dd = 0;
  //   var _isValidDate = validateDate(_inputDate, _showLongDate);

  //   if (_isValidDate.valid) {
  //     if (this.alwaysResetSelectedDateOnDialogClose) {
  //       return;
  //     }

  //     var _vd = new Date(_isValidDate.result);
  //     var _yy = _vd.getFullYear();
  //     var _mm = _vd.getMonth();
  //     this._setInvalidDate(!1);

  //     this.set("_activeYear", _yy);
  //     this.set("_activeMonth", _mm);
  //     this.set("_selectedYear", _yy);
  //     this.set("_selectedMonth", _mm);
  //     this.set("_selectedDate", _vd.getDate());
  //   } else {
  //     this.set("_selectedDate", this._selectedDate || new Date().getDate());
  //     this._computeShowLongDate(_showLongDate, this.locale);
  //     this._setInvalidDate(!0);
  //   }
  // }

  // /**
  //  * By default, buttons are required so that they are to confirm the date change.
  //  * This method allows force update the datepicker when there are no buttons inside the datepicker to confirm date change.
  //  */
  // enforceDateChange() {
  //   this._setInvalidDate(!1);
  //   this._computeShowLongDate(this.showLongDate, this.locale);
  // }

  // // reset date to today"s date if alwaysResetSelectedDateOnDialogClose is set.
  // resetDate() {
  //   if (this._isSelectedDateConfirmed) {
  //     return;
  //   }

  //   var now = new Date();
  //   var nowFy = now.getFullYear();
  //   var nowM = now.getMonth();
  //   var nowD = now.getDate();

  //   this.set("_activeYear", nowFy);
  //   this.set("_activeMonth", nowM);
  //   this.set("_selectedYear", nowFy);
  //   this.set("_selectedMonth", nowM);
  //   this.set("_selectedDate", nowD);
  //   this._setInvalidDate(false);
  // }

  // // Accessibility enhancment.
  // _shouldTabIndex(_index, _firstDayOfWeek, _minDate, _maxDate, _item) {
  //   var _isDisableDays = this._isDisableDays(_index, _firstDayOfWeek, _minDate, _maxDate, _item);
  //   return _item && _item >= 0 && !_isDisableDays ? 0 : -1;
  // }

  // _shouldAriaDisabled(_index, _firstDayOfWeek, _minDate, _maxDate, _item) {
  //   var _isDisableDays = this._isDisableDays(_index, _firstDayOfWeek, _minDate, _maxDate, _item);
  //   return !(_item && _item >= 0 && !_isDisableDays);
  // }

  // // Lodash"s replacements.
  // _padStart(_string, _length, _chars) {
  //   var _len = -_length;
  //   var _str = (_chars + _string).slice(_len);
  //   return _str;
  // }

  // _isNumber(_value) {
  //   // return typeof _value == "number" || (!Number.isNaN(parseFloat(_value)) && Number.isFinite(_value));
  //   // Fallback: caused by IE11 as those methods are not supported in IE11.
  //   return typeof _value == "number" || (!isNaN(parseFloat(_value)) && isFinite(_value));
  // }

  // // Update theme color.
  // _updateThemeColor(_theme) {
  //   var _themes = ["dark-theme", "light-theme", "goog-theme"];
  //   var _themeIdx = _themes.indexOf(_theme);
  //   var _distributedButtons = dom(this).querySelectorAll("paper-button");
  //   var _distributedButtonsLen = _distributedButtons.length;
  //   var _colorCode = ["#bcbcbc", "#737373", "#616161"][_themeIdx];

  //   if (_themeIdx >= 0) {
  //     _themes.splice(_themeIdx, 1);

  //     this.toggleClass(_themes[0], !1, this);
  //     this.toggleClass(_themes[1], !1, this);
  //     this.toggleClass(_theme, !0, this);
  //   } else {
  //     this.toggleClass("dark-theme", !1, this);
  //     this.toggleClass("light-theme", !1, this);
  //     this.toggleClass("goog-theme", !1, this);
  //   }

  //   // workaround to update custom property of distributed buttons.
  //   for (var i = 0; i < _distributedButtonsLen; i++) {
  //     this._updateDistributedButtonInkColorCustomProp(_distributedButtons[i], _colorCode || "#737373");
  //   }
  //   // Update styles of the whole datepicker.
  //   this.updateStyles();
  // }

  // // Forcefully update the view of the datepicker.
  // _updateDatepickerView(_view) {
  //   this.toggleClass("horizontal-view", _view === "horizontal", this);
  //   this.toggleClass("vertical-view", _view === "vertical", this);
  // }

  // // workaround to update custom property of distributed children until Polymer supports Native custom properties.
  // _updateDistributedButtonInkColorCustomProp(_node, _colorCode) {
  //   _node.updateStyles({
  //     "--paper-button-ink-color": _colorCode,
  //   });
  // }
}
