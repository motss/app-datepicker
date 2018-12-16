import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { cache } from 'lit-html/directives/cache.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';

import '@polymer/paper-icon-button/paper-icon-button-light';

import './app-datepicker-icons.js';
import { calendar } from './calendar.js';
import { iconChevronLeft, iconChevronRight } from './app-datepicker-icons.js';
import { resetButton } from './common-styles.js';

function getResolvedTodayDate() {
  const dateDate = new Date();
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return new Date(Date.UTC(fy, m, d));
}

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
  focusedDate,
  selectedView,
  updateViewFn,
}) {
  const dateDate = new Date(focusedDate);
  const formattedDate = Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(dateDate);
  const isCalendarView = selectedView === 'calendar';

  return html`
  <button
    class="${classMap({ 'btn__selector-year': true, selected: !isCalendarView })}"
    view="year"
    @click="${() => updateViewFn('year')}">${new Date(selectedDate).getUTCFullYear()}</button>

  <div class="datepicker-toolbar">
    <button
      class="${classMap({ 'btn__selector-calendar': true, selected: isCalendarView })}"
      view="calendar"
      @click="${() => updateViewFn('calendar')}">${formattedDate}</button>
  </div>
  `;
}

function renderDatepickerCalendar({
  updateMonthFn,
  updateFocusedDateFn,
  longMonthYearFormatterFn,

  calendars,
  disabledDays,
  showWeekNumber,
  min,
  max,
  todayDate,
  focusedDate,
}) {
  let hasMinDate = false;
  let hasMaxDate = false;
  const minTime = +new Date(min);
  const maxTime = +new Date(max);

  const fixedDisabledDays = Array.isArray(disabledDays) && disabledDays.length > 0
    ? disabledDays.map(n => showWeekNumber ? n + 1 : n)
    : [];
  const calendarsContent = calendars.map((n) => {
    let formattedDate = null;

    const weekdaysContent = n.weekdays.map(o => {
      return html`<th aria-label="${o.label}">${o.value}</th>`;
    });
    const tbodyContent = n.daysInMonth.map((o) => {
      const trContent = o.map((q, qi) => {
        if (q.fullDate == null && q.value == null) {
          hasMinDate = false;
          hasMaxDate = false;

          return html`<td class="full-calendar__day day--empty"></td>`;
        }

        /** NOTE(motss): Could be week number labeling */
        if (q.fullDate == null && showWeekNumber && qi < 1) {
          return html`<td class="full-calendar__day weekday-label" aria-label="${q.label}">${q.value}</td>`;
        }

        const curTime = +new Date(q.fullDate);
        if (formattedDate == null) formattedDate = longMonthYearFormatterFn(curTime);

        const isDisabledDay = fixedDisabledDays.some(fdd => fdd === qi)
          || (curTime < minTime || curTime > maxTime);

        hasMinDate = curTime === minTime;
        hasMaxDate = curTime === maxTime;

        return html`
        <td
          class="${classMap({
            'full-calendar__day': true,
            'day--disabled': isDisabledDay,
            'day--today': +todayDate === curTime,
            'day--focused': +focusedDate === curTime,
          })}"
          aria-label="${q.label}"
          .full-date="${q.fullDate}"
          .day="${q.value}">
          <div class="calendar-day">${q.value}</div>
        </td>
        `;
      });

      return html`<tr>${trContent}</tr>`;
    });

    return html`
    <div class="calendar-container">
      <div class="calendar-label">${formattedDate}</div>

      <table
        class="calendar-table"
        tabindex="0"
        @click="${ev => updateFocusedDateFn(ev)}">
        <thead>
          <tr class="calendar-weekdays">${weekdaysContent}</tr>
        </thead>

        <tbody>${tbodyContent}</tbody>
      </table>
    </div>
    `;
  });

  return html`
  <div class="datepicker-body__calendar-view">
    <div class="calendar-view__month-selector">
      <div class="month-selector-container">
        ${hasMinDate
          ? null
          : html`
          <paper-icon-button-light>
            <button
              class="month-selector-button"
              aria-label="Previous month"
              @click="${() => updateMonthFn('previous')}">${iconChevronLeft}</button>
          </paper-icon-button-light>
          `}
      </div>

      <div class="month-selector-container">
        ${hasMaxDate
          ? null
          : html`
          <paper-icon-button-light>
            <button
              class="month-selector-button"
              aria-label="Next month"
              @click="${() => updateMonthFn('next')}">${iconChevronRight}</button>
          </paper-icon-button-light>
          `}
      </div>
    </div>

    <div class="calendar-view__full-calendar">${calendarsContent}</div>
  </div>
  `;
}

function renderDatepickerYearList({
  updateYearFn,

  yearList,
  selectedDate,
}) {
  return html`
  <div class="datepicker-body__year-view">
    <div
      class="year-view__full-list"
      @click="${ev => updateYearFn(ev)}">
    ${(repeat(
      yearList,
      n => n,
      (n) => html`<button
        class="${classMap({
          'year-view__list-item': true,
          'year--selected': selectedDate.getUTCFullYear() === n,
        })}"
        .year="${n}">${n}</button>`))}
    </div>
  </div>
  `;
}

function computeThreeCalendarsInARow(selectedDate: Date) {
  const dateDate = new Date(selectedDate);
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return [
    new Date(fy, m - 1, d),
    dateDate,
    new Date(fy, m + 1, d),
  ];
}

@customElement(AppDatepicker.is)
export class AppDatepicker extends LitElement {
  static get is() {
    return 'app-datepicker';
  }

  @property({ type: String })
  public min: string;

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
  public disabledDays: string = '0,6';

  @property({ type: String })
  public disableDates: string;

  @property({ type: String })
  public format: string = 'yyyy-MM-dd';

  @property({ type: String })
  public orientation: string = 'portrait';

  @property({ type: String })
  public locale: string = getResolvedLocale();

  @property({ type: String })
  public startView: string;

  @property({ type: Number })
  public dragRatio: number = .15;

  @property({ type: String })
  private _selectedView: string = 'calendar';

  @property({ type: Date })
  private _selectedDate: Date;

  @property({ type: Date })
  private _focusedDate: Date;

  private _todayDate: Date;
  private _isTrackingStart: boolean = false;
  private _isTrackingMove: boolean = false;
  private _dx: number = 0;
  private _totalDraggableDistance: number = 0;
  private _dragAnimationDuration: number = 150;
  private _yearList: number[];

  // valueAsDate: Date,
  // valueAsNumber: Number,
  // weekdayFormat: String,

  public constructor() {
    super();

    this._updateMonthFn = this._updateMonthFn.bind(this);
    this._updateViewFn = this._updateViewFn.bind(this);
    this._updateYearFn = this._updateYearFn.bind(this);
    this._updateFocusedDateFn = this._updateFocusedDateFn.bind(this);
    this._trackingStartFn = this._trackingStartFn.bind(this);
    this._trackingMoveFn = this._trackingMoveFn.bind(this);
    this._trackingEndFn = this._trackingEndFn.bind(this);

    /** NOTE(motss): To force all event listeners for gestures to be passive */
    setPassiveTouchGestures(true);

    const todayDate = getResolvedTodayDate();
    const todayDateFullYear = todayDate.getUTCFullYear();
    const yearList: number[] = [];
    for (let i = 0, len = 2100 - todayDateFullYear + 1; i < len; i += 1) {
      yearList.push(todayDateFullYear + i);
    }

    this.min = todayDate.toJSON();
    this._todayDate = todayDate;
    this._selectedDate = todayDate;
    this._focusedDate = todayDate;
    this._yearList = yearList;
  }

  protected render() {
    const locale = this.locale;
    const disabledDays = this.disabledDays;
    const firstDayOfWeek = this.firstDayOfWeek;
    const min = this.min;
    const max= this.max;
    const showWeekNumber = this.showWeekNumber;
    const weekNumberType = this.weekNumberType;
    const yearList = this._yearList;

    const focusedDate = this._focusedDate;
    const selectedDate = this._selectedDate;
    const selectedView = this._selectedView;
    const todayDate = getResolvedTodayDate();

    /** NOTE(motss): For perf reason, initialize all formatters for calendar rendering */
    const dayFormatterFn = Intl.DateTimeFormat(locale, { day: 'numeric' }).format;
    const fullDateFormatterFn = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format;
    const longWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'long' }).format;
    const narrowWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format;
    const longMonthYearFormatterFn = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
    }).format;

    let clt = window.performance.now();
    const calendars = computeThreeCalendarsInARow(selectedDate).map((n, idx) => calendar({
      firstDayOfWeek,
      locale,
      selectedDate: n,
      showWeekNumber,
      weekNumberType,
      idOffset: idx * 10,

      dayFormatterFn,
      fullDateFormatterFn,
      longWeekdayFormatterFn,
      narrowWeekdayFormatterFn,
    }));
    clt = window.performance.now() - clt;
    const cltEl = document.body.querySelector('.calendar-render-time');
    cltEl && (cltEl.textContent = `Rendering calendar takes ${clt.toFixed(3)} ms`);

    return html`
    ${resetButton}
    <style>
      :host {
        display: block;
        width: var(--app-datepicker-width);
        /** NOTE: Magic number as 16:9 aspect ratio does not look good */
        /* height: calc((var(--app-datepicker-width) / .66) - var(--app-datepicker-footer-height, 56px)); */
        background-color: #fff;
        border-top-left-radius: var(--app-datepicker-border-top-left-radius, var(--app-datepicker-border-radius));
        border-top-right-radius: var(--app-datepicker-border-top-right-radius, var(--app-datepicker-border-radius));
        border-bottom-left-radius: var(--app-datepicker-border-bottom-left-radius, var(--app-datepicker-border-radius));
        border-bottom-right-radius: var(--app-datepicker-border-bottom-right-radius, var(--app-datepicker-border-radius));
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

      .datepicker-body__calendar-view {
        min-height: 56px;
      }

      .calendar-view__month-selector {
        display: flex;
        flex-direction: row;
        align-items: center;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0 8px;
        z-index: 1;
      }

      .month-selector-container {
        max-height: 56px;
        height: 100%;
      }
      .month-selector-container + .month-selector-container {
        margin: 0 0 0 auto;
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

      .calendar-view__full-calendar {
        display: flex;
        flex-direction: row;
        justify-content: center;

        position: relative;
        width: calc(100% * 3);
        left: calc(-100%);
        padding: 0 0 16px;
      }

      .year-view__full-list {
        max-height: calc(48px * 7);
        overflow-y: auto;
      }

      .calendar-weekdays > th,
      td.weekday-label {
        color: rgba(0, 0, 0, .55);
        font-weight: 400;
      }

      .calendar-container {
        max-width: calc(100% / 3);
        width: calc(100% / 3);
      }

      .calendar-label,
      .calendar-table {
        width: calc(100% - 16px * 2);
      }

      .calendar-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        max-width: calc(100% - 8px * 2);
        width: 100%;
        height: 56px;
        margin: 0 8px;
        font-weight: 500;
        text-align: center;
      }

      .calendar-table {
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;

        margin: 0 16px;
        border-collapse: collapse;
        text-align: center;
        outline: none;
      }

      tr > th,
      tr > td {
        position: relative;
        min-height: 40px;
        height: 40px;
        padding: 8px 0;
        pointer-events: none;
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
      tr > td.full-calendar__day:not(.day--empty):hover::after {
        opacity: .7;
      }
      tr > td.full-calendar__day:not(.weekday-label):not(.day--empty) {
        cursor: pointer;
        pointer-events: auto;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      tr > td.full-calendar__day.day--focused:not(.day--empty)::after,
      tr > td.full-calendar__day.day--today.day--focused:not(.day--empty)::after {
        opacity: 1
      }

      tr > td.full-calendar__day > .calendar-day {
        position: relative;
        color: #000;
        z-index: 1;
        pointer-events: none;
      }
      tr > td.full-calendar__day.day--today > .calendar-day {
        color: var(--app-datepicker-primary-color);
      }
      tr > td.full-calendar__day.day--focused > .calendar-day,
      tr > td.full-calendar__day.day--today.day--focused > .calendar-day {
        color: #fff;
      }

      .year-view__list-item {
        width: 100%;
        padding: 12px 16px;
        text-align: center;
      }
      .year-view__list-item.year--selected {
        color: var(--app-datepicker-primary-color);
        font-size: 24px;
        font-weight: 500;
      }

    </style>

    <div class="datepicker-header">
    ${(renderHeaderSelectorButton({
      locale,
      selectedDate,
      focusedDate,
      selectedView,
      updateViewFn: this._updateViewFn,
    }))}
    </div>

    <div class="datepicker-body">
    ${cache(selectedView === 'calendar'
      ? renderDatepickerCalendar({
        updateMonthFn: this._updateMonthFn,
        updateFocusedDateFn: this._updateFocusedDateFn,
        longMonthYearFormatterFn,

        calendars,
        disabledDays,
        focusedDate,
        max,
        min,
        showWeekNumber,
        todayDate,
      })
      : renderDatepickerYearList({
        updateYearFn: this._updateYearFn,

        selectedDate,
        yearList,
      }))}
    </div>
    `;
  }

  protected firstUpdated() {
    const hostBoundingRect = this.getBoundingClientRect();
    this._totalDraggableDistance = hostBoundingRect.width;

    addListener(this._calendarViewFullCalendar, 'down', this._trackingStartFn);
    addListener(this._calendarViewFullCalendar, 'track', this._trackingMoveFn);
    addListener(this._calendarViewFullCalendar, 'up', this._trackingEndFn);
  }

  protected updated() {
    if (this._selectedView === 'year') {
      this.updateComplete
        .then(() => {
          return this._yearViewFullList.scrollTo({
            top: (this._selectedDate.getUTCFullYear() - this._todayDate.getUTCFullYear() - 2) * 48,
            left: 0,
          });
        });
    }
  }

  private _updateViewFn(view: string) {
    this._selectedView = view;
  }

  private _updateMonthFn(updateType: string) {
    const calendarViewFullCalendar = this._calendarViewFullCalendar;
    const dateDate = new Date(this._selectedDate);
    const fy = dateDate.getUTCFullYear();
    const m = dateDate.getUTCMonth();
    const d = dateDate.getUTCDate();
    /** NOTE: updateType === 'next' as fallback */
    const nm = updateType === 'previous' ? 1 : -1;

    const dragAnimation = calendarViewFullCalendar.animate([
      { transform: 'translate3d(0px, 0, 0)' },
      { transform: `translate3d(${this._totalDraggableDistance * nm}px, 0, 0)` },
    ], {
      duration: this._dragAnimationDuration,
      easing: 'cubic-bezier(0, 0, .4, 1)',
      fill: 'none',
    });

    return new Promise(yay => (dragAnimation.onfinish = yay))
      .then(() => {
        this._selectedDate = new Date(Date.UTC(fy, m - nm, d));

        return this.updateComplete;
      })
      .then(() => {
        calendarViewFullCalendar.style.transform = null;

        this._dx = 0;
        this._isTrackingStart = false;
      });
  }

  private _updateYearFn(ev: Event) {
    const composedPath = ev.composedPath();
    const selectedYearEl = composedPath.find(n =>
      n
      && (n as HTMLElement).classList
      && (n as HTMLElement).classList.contains('year-view__list-item'));

    if (selectedYearEl == null) return;

    const dateDate = new Date(this._selectedDate);
    const m = dateDate.getUTCMonth();
    const d = dateDate.getUTCDate();
    const selectedYear = Number((selectedYearEl as HTMLButtonElement)!.textContent);

    /**
     * 2 things to do here:
     *  - Update `_selectedDate` with selected year
     *  - Update `_selectedView` to 'calendar'
     */
    this._selectedDate = new Date(Date.UTC(selectedYear, m, d));
    this._selectedView = 'calendar';
  }

  private _updateFocusedDateFn(ev: Event) {
    const composedPath = ev.composedPath();
    const selectedDayEl = composedPath.find(n =>
      n
      && (n as HTMLElement).classList
      && (n as HTMLElement).classList.contains('full-calendar__day'));

    if (selectedDayEl == null) return;

    const dateDate = new Date(this._selectedDate);
    const fy = dateDate.getUTCFullYear();
    const m = dateDate.getUTCMonth();
    const selectedDate = Number((selectedDayEl as HTMLTableDataCellElement).textContent);

    this._focusedDate = new Date(Date.UTC(fy, m, selectedDate));
  }

  private _trackingStartFn() {
    // console.debug('tracking-start', this._dx);
    this._isTrackingStart = true;
  }
  private _trackingMoveFn(ev: CustomEvent) {
    // console.debug('tracking-move', ev);
    if (!this._isTrackingStart) return;

    this._isTrackingMove = true;

    const calendarViewFullCalendar = this._calendarViewFullCalendar;
    const dx = Number(ev.detail.dx);

    calendarViewFullCalendar.style.transform = `translate3d(${dx}px, 0, 0)`;
    this._dx = dx;
  }
  private _trackingEndFn(ev) {
    console.debug('tracking-end-fn');
    /**
     * NOTE(motss): If tracking starts but does not move,
     * skip execution and reset `isTrackingStart`.
     */
    if (!this._isTrackingMove) {
      this._isTrackingStart = false;
      return;
    }

    // console.debug('tracking-env', this._dx, ev.type);
    const calendarViewFullCalendar = this._calendarViewFullCalendar;
    const totalDraggableDistance = this._totalDraggableDistance;
    const dx = this._dx;
    const isPositive = dx > 0;
    const absDx = Math.abs(dx);

    /**
     * NOTE(motss):
     * If dragged distance < `dragRatio`, reset calendar position.
     */
    if (absDx < totalDraggableDistance * this.dragRatio) {
      const dragAnimation = calendarViewFullCalendar.animate([
        { transform: `translate3d(${dx}px, 0, 0)` },
        { transform: 'translate3d(0px, 0, 0)' },
      ], {
        duration: this._dragAnimationDuration,
        easing: 'cubic-bezier(0, 0, .4, 1)',
        fill: 'none',
      });

      return new Promise(yay => (dragAnimation.onfinish = yay))
        .then(() => {
          calendarViewFullCalendar.style.transform = null;

          this._dx = 0;
          this._isTrackingStart = false;
        });
    }

    const restDx = totalDraggableDistance * (isPositive ? 1 : -1);
    const dragAnimation = calendarViewFullCalendar.animate([
      { transform: `translate3d(${dx}px, 0, 0)` },
      { transform: `translate3d(${restDx}px, 0, 0)` },
    ], {
      duration: this._dragAnimationDuration,
      easing: 'cubic-bezier(0, 0, .4, 1)',
      fill: 'none',
    });

    /** NOTE(motss): Drag to next calendar when drag ratio meets threshold value */
    return new Promise(yay => (dragAnimation.onfinish = yay))
      .then(() => {
        const dateDate = new Date(this._selectedDate);
        const fy = dateDate.getUTCFullYear();
        const m = dateDate.getUTCMonth();
        const d = dateDate.getUTCDate();
        const nm = isPositive ? -1 : 1;

        this._selectedDate = new Date(Date.UTC(fy, m + nm, d));

        return this.updateComplete;
      })
      .then(() => {
        calendarViewFullCalendar.style.transform = null;

        this._dx = 0;
        this._isTrackingStart = false;
        this._isTrackingMove = false;
      });
  }

  private get _yearViewFullList() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.year-view__full-list')!;
  }

  private get _calendarViewFullCalendar() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.calendar-view__full-calendar')!;
  }

}
