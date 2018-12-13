import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';

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

  focusedDate,
  selectedDate,
  todayDate,
  disabledDays,

  updatePointerdownFn,
  updatePointermoveFn,
  updatePointerupFn,
  updateFocusedDateFn,

  dayFormatterFn,
  fullDateFormatterFn,
  longWeekdayFormatterFn,
  narrowWeekdayFormatterFn,
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

    dayFormatterFn,
    fullDateFormatterFn,
    longWeekdayFormatterFn,
    narrowWeekdayFormatterFn,
  });

  const calendarContent = html`
  <table class="calendar-table"
    tabindex="0"
    @pointerdown="${() => updatePointerdownFn()}"
    @pointermove="${(ev) => updatePointermoveFn(ev)}"
    @pointerup="${(ev) => updatePointerupFn(ev)}"
    @pointerleave="${(ev) => updatePointerupFn(ev)}"
    @click="${ev => updateFocusedDateFn(ev)}">
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
                  'day--focused': +focusedDate === oriTimestamp,
                  'weekday-label': showWeekNumber && nni < 1,
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
  calendarContents,
  locale,
  selectedDate,
  selectedView,
  updateMonthFn,
  updateYearFn,
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
              aria-label="Previous month"
              @click="${() => updateMonthFn('previous')}">${iconChevronLeft}</button>
          </paper-icon-button-light>
        </div>

        <div class="month-selector__selected-month">${formattedDate}</div>

        <div class="month-selector-container">
          <paper-icon-button-light>
            <button
              class="month-selector-button"
              aria-label="Next month"
              @click="${() => updateMonthFn('next')}">${iconChevronRight}</button>
          </paper-icon-button-light>
        </div>
      </div>

      <div class="calendar-view__full-calendar">${cache(repeat(calendarContents, n => n, n => n.value))}</div>
    </div>
    `;
  }

  return html`
  <div class="datepicker-body__year-view">
    <div
      class="year-view__full-list"
      @click="${ev => updateYearFn(ev)}">
    ${cache(repeat(
      Array.from(Array(2100 - 1900 + 1), (_, i) => 1900 + i),
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

function computeThreeCalendarsInARow(selectedDate: Date, updateMonthWithClick: boolean) {
  const dateDate = new Date(selectedDate);
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return Boolean(updateMonthWithClick == null ? false : updateMonthWithClick)
    ? [null, dateDate, null]
    : [
      new Date(fy, m - 1, d),
      dateDate,
      new Date(fy, m + 1, d),
    ];
}

@customElement(AppDatepicker.is as any)
export class AppDatepicker extends LitElement {
  static get is() {
    return 'app-datepicker';
  }

  public constructor() {
    super();

    this._updateMonth = this._updateMonth.bind(this);
    this._updateView = this._updateView.bind(this);
    this._updateYear = this._updateYear.bind(this);
    this._updateFocusedDate = this._updateFocusedDate.bind(this);
    this._updatePointerdownFn = this._updatePointerdownFn.bind(this);
    this._updatePointermoveFn = this._updatePointermoveFn.bind(this);
    this._updatePointerupFn = this._updatePointerupFn.bind(this);
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
  public locale: string = getResolvedLocale();

  @property({ type: String })
  public startView: string;

  @property({ type: String })
  private _selectedView: string = 'calendar';

  @property({ type: Date })
  private _selectedDate: Date = getResolvedTodayDate();

  @property({ type: Date })
  private _focusedDate: Date = getResolvedTodayDate();

  private _updateMonthWithClick: boolean = false;
  private _isPointerdown: boolean = false;
  private _isPointerup: boolean = false;
  private _dx: number = 0;
  private _totalDraggableDistance: number = 0;

  // valueAsDate: Date,
  // valueAsNumber: Number,
  // weekdayFormat: String,

  protected render() {
    const locale = this.locale;
    const disabledDays = this.disableDays;
    const firstDayOfWeek = this.firstDayOfWeek;
    const min = this.min;
    const max= this.max;
    const showWeekNumber = this.showWeekNumber;
    const weekNumberType = this.weekNumberType;

    const focusedDate = this._focusedDate;
    const selectedDate = this._selectedDate;
    const selectedView = this._selectedView;
    const todayDate = getResolvedTodayDate();
    const updateMonthWithClick = this._updateMonthWithClick;

    /** NOTE(motss): For perf reason, initialize all formatters for calendar rendering */
    const dayFormatterFn = Intl.DateTimeFormat(locale, { day: 'numeric' }).format;
    const fullDateFormatterFn = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format;
    const longWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'long' }).format;
    const narrowWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format;

    /** FIXME: Skip rendering tri-calendars when clicking instead of swiping */
    const calendarContents = computeThreeCalendarsInARow(selectedDate, updateMonthWithClick).map((n) => {
      if (n == null) return html`<table class="calendar-table" tabindex="-1"></table>`;

      return computeCalendarContent({
        disabledDays,
        firstDayOfWeek,
        locale,
        max,
        min,
        selectedDate: n,
        showWeekNumber,
        todayDate,
        focusedDate,
        weekNumberType,

        updateFocusedDateFn: this._updateFocusedDate,
        updatePointerdownFn: this._updatePointerdownFn,
        updatePointermoveFn: this._updatePointermoveFn,
        updatePointerupFn: this._updatePointerupFn,

        dayFormatterFn,
        fullDateFormatterFn,
        longWeekdayFormatterFn,
        narrowWeekdayFormatterFn,
      });
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

        position: relative;
        width: calc(100% * 3);
        left: calc(-100%);
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
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;

        max-width: calc((100% / 3) - 16px * 2);
        width: calc((100% / 3) - 16px * 2);
        margin: 0 16px;
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
      tr > td.full-calendar__day:not(.weekday-label):not(.day--empty) {
        cursor: pointer;
        pointer-events: auto;
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
    ${cache(renderHeaderSelectorButton({ locale, selectedDate, selectedView, updateViewFn: this._updateView }))}
    </div>

    <div class="datepicker-body">
    ${cache(renderDatepickerBody({ calendarContents, locale, selectedDate, selectedView, updateMonthFn: this._updateMonth, updateYearFn: this._updateYear }))}
    </div>
    `;
  }

  protected firstUpdated() {
    const hostBoundingRect = this.getBoundingClientRect();
    this._totalDraggableDistance = hostBoundingRect.width;
  }

  protected updated() {
    if (this._selectedView === 'year') {
      this._yearViewFullList.scrollTo({
        top: (this._selectedDate.getUTCFullYear() - 1900 - 2) * 48,
        left: 0,
      });
    }

    this._updateMonthWithClick = false;

    /**
     * NOTE(motss):
     * If `table` is less than 3, once current update completes,
     * re-render again on next frame
     */
    if (Array.from(this._calendarViewFullCalendar.querySelectorAll('table')).length < 3) {
      this.updateComplete.then(() => {
        const rerenderFn = (window as any).requestIdleCallback || window.requestAnimationFrame;
        rerenderFn(() => this.requestUpdate());
      });
    }
  }

  private _updateView(view: string) {
    this._selectedView = view;
  }

  private _updateMonth(updateType: string) {
    const dateDate = new Date(this._selectedDate);
    const fy = dateDate.getUTCFullYear();
    const m = dateDate.getUTCMonth();
    const d = dateDate.getUTCDate();
    /** NOTE: updateType === 'next' as fallback */
    const nm = updateType === 'previous' ? -1 : 1;

    this._updateMonthWithClick = true;
    this._selectedDate = new Date(Date.UTC(fy, m + nm, d));
  }

  private _updateYear(ev: Event) {
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

  private _updateFocusedDate(ev: Event) {
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

  private _updatePointerdownFn() {
    // console.debug('is-pointer-down', this._dx);
    this._isPointerdown = true;
  }
  private _updatePointermoveFn(ev: PointerEvent) {
    if (!this._isPointerdown) return;

    // const calendarTableToDrag = ev.composedPath().find(n => (n as HTMLElement).classList.contains('calendar-table')) as HTMLTableElement;
    const calendarViewFullCalendar = this._calendarViewFullCalendar;
    const dx = this._dx + Number(ev.movementX);

    calendarViewFullCalendar.style.transform = `translate3d(${dx}px, 0, 0)`;
    this._dx = dx;
  }
  private _updatePointerupFn(ev) {
    /**
     * NOTE(motss):
     * When to skip execution,
     *  - `pointerup` or `pointerleave` event has been fired, or
     *  - `pointerdown` has not been fired
     */
    if (this._isPointerup || !this._isPointerdown) return;

    // console.debug('is-pointer-up', this._dx, ev.type);
    this._isPointerup = true;

    const calendarViewFullCalendar = this._calendarViewFullCalendar;
    const totalDraggableDistance = this._totalDraggableDistance;
    const dx = this._dx;
    const isPositive = dx > 0;
    const absDx = Math.abs(dx);

    /**
     * NOTE(motss):
     * If dragged distance < 30% of the calendar ratio,
     * reset calendar position
     */
    if (absDx < totalDraggableDistance * .3) {
      const dragAnimation = calendarViewFullCalendar.animate([
        { transform: `translate3d(${dx}px, 0, 0)` },
        { transform: 'translate3d(0px, 0, 0)' },
      ], {
        duration: 250,
        easing: 'cubic-bezier(0, 0, .4, 1)',
        fill: 'none',
      });

      return dragAnimation
        .finished
        .then(() => {
          calendarViewFullCalendar.style.transform = null;

          this._isPointerdown = false;
          this._isPointerup = false;
          this._dx = 0;
        });
    }

    const restDx = totalDraggableDistance * (isPositive ? 1 : -1);
    const dragAnimation = calendarViewFullCalendar.animate([
      { transform: `translate3d(${dx}px, 0, 0)` },
      { transform: `translate3d(${restDx}px, 0, 0)` },
    ], {
      duration: 250,
      easing: 'cubic-bezier(0, 0, .4, 1)',
      fill: 'none',
    });

    /** NOTE(motss): Drag to next calendar when drag ratio meets threshold value */
    return dragAnimation
      .finished
      .then(() => {
        this._isPointerdown = false;
        this._dx = 0;

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

        this._isPointerup = false;
        this._dx = 0;
      });
  }

  private get _yearViewFullList() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.year-view__full-list')!;
  }

  private get _calendarViewFullCalendar() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.calendar-view__full-calendar')!;
  }

}
