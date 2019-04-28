type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
type ClassProperties<T> = {
  [P in keyof T]: T[P] extends CallableFunction ? never : T[P];
};
interface ParamUpdatedChanged extends ClassProperties<
  Omit<Omit<AppDatepicker, HTMLElement>, LitElement>
> {
  _selectedDate: Date;
  _focusedDate: Date;
  _startView: START_VIEW;
}

interface ParamsAnimateCalendar {
  target: HTMLElement;
  from: number;
  to: number;
  postX: number;
  postTask: () => Promise<unknown>;
}

export const enum START_VIEW {
  CALENDAR = 'calendar',
  YEAR_LIST = 'yearList',
}
export const enum MONTH_UPDATE_TYPE {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

import {
  css,
  customElement,
  eventOptions,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';

import { iconChevronLeft, iconChevronRight } from './app-datepicker-icons.js';
import { WEEK_NUMBER_TYPE } from './calendar.js';
import { datepickerVariables, resetButton } from './common-styles.js';
import {
  ALL_NAV_KEYS_SET,
  computeAllCalendars,
  computeNextFocusedDate,
  dispatchCustomEvent,
  findShadowTarget,
  getResolvedDate,
  getResolvedLocale,
  hasClass,
  isValidDate,
  KEYCODES_MAP,
  makeNumberPrecise,
  passiveHandler,
  targetScrollTo,
  toFormattedDateString,
  toUTCDate,
  toYearList,
  updateFormatters,
  updateYearWithMinMax,
} from './datepicker-helpers.js';
import { Tracker } from './tracker.js';

@customElement(AppDatepicker.is)
export class AppDatepicker extends LitElement {
  static get is() { return 'app-datepicker'; }

  public static styles = [
    // tslint:disable:max-line-length
    datepickerVariables,
    resetButton,
    css`
    :host {
      min-width: 300px;
      width: 300px;
      /** NOTE: Magic number as 16:9 aspect ratio does not look good */
      /* height: calc((var(--app-datepicker-width) / .66) - var(--app-datepicker-footer-height, 56px)); */
      background-color: #fff;
      border-radius:
        var(--app-datepicker-border-top-left-radius, 8px)
        var(--app-datepicker-border-top-right-radius, 8px)
        var(--app-datepicker-border-bottom-right-radius, 8px)
        var(--app-datepicker-border-bottom-left-radius, 8px);
      overflow: hidden;
    }
    :host([landscape]) {
      display: flex;

      /** <iphone-5-landscape-width> - <standard-side-margin-width> */
      min-width: calc(568px - 16px * 2);
      width: calc(568px - 16px * 2);
    }

    .datepicker-header + .datepicker-body {
      border-top: 1px solid #ddd;
    }
    :host([landscape]) > .datepicker-header + .datepicker-body {
      border-top: none;
      border-left: 1px solid #ddd;
    }

    .datepicker-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      position: relative;
      padding: 16px 24px;
    }
    :host([landscape]) > .datepicker-header {
      /** :this.<one-liner-month-day-width> + :this.<side-padding-width> */
      min-width: calc(14ch + 24px * 2);
    }

    .btn__year-selector,
    .btn__calendar-selector {
      color: rgba(0, 0, 0, .55);
      cursor: pointer;
      /* outline: none; */
    }
    .btn__year-selector.selected,
    .btn__calendar-selector.selected {
      color: currentColor;
    }

    /**
      * NOTE: IE11-only fix. This prevents formatted focused date from overflowing the container.
      */
    .datepicker-toolbar {
      width: 100%;
    }

    .btn__year-selector {
      font-size: 16px;
      font-weight: 700;
    }
    .btn__calendar-selector {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
    }

    .datepicker-body {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .datepicker-body__calendar-view {
      min-height: 56px;
    }

    .calendar-view__month-selector {
      display: flex;
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

    .btn__month-selector {
      padding: calc((56px - 24px) / 2);
      /**
        * NOTE: button element contains no text, only SVG.
        * No extra height will incur with such setting.
        */
      line-height: 0;
    }
    .btn__month-selector:hover {
      cursor: pointer;
    }

    .calendar-view__full-calendar {
      display: flex;
      justify-content: center;

      position: relative;
      width: calc(100% * 3);
      padding: 0 0 16px;
      will-change: transform;
      /**
        * NOTE: Required for Pointer Events API to work on touch devices.
        * Native \`pan-y\` action will be fired by the browsers since we only care about the
        * horizontal direction. This is great as vertical scrolling still works even when touch
        * event happens on a datepicker's calendar.
        */
      touch-action: pan-y;
      /* outline: none; */
    }

    .year-list-view__full-list {
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
    }

    tr > th,
    tr > td {
      position: relative;
      min-height: 40px;
      height: 40px;
      padding: 8px 0;
    }

    /**
      * NOTE: Interesting fact! That is ::after will trigger paint when dragging. This will trigger
      * layout and paint on **ONLY** affected nodes. This is much cheaper as compared to rendering
      * all :::after of all calendar day elements. When dragging the entire calendar container,
      * because of all layout and paint trigger on each and every ::after, this becomes a expensive
      * task for the browsers especially on low-end devices. Even though animating opacity is much
      * cheaper, the technique does not work here. Adding 'will-change' will further reduce overall
      * painting at the expense of memory consumption as many cells in a table has been promoted
      * a its own layer.
      */
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label) {
      will-change: transform;
    }
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label).day--focused::after,
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after {
      content: '';
      display: block;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 50%;
      left: 50%;
      background-color: var(--app-datepicker-primary-color, #1a73e8);
      border-radius: 50%;
      transform: translate3d(-50%, -50%, 0);
      will-change: transform;
      opacity: 0;
      pointer-events: none;
    }
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label).day--focused::after {
      opacity: 1;
    }
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after {
      opacity: .15;
    }
    tr > td.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label) {
      cursor: pointer;
      pointer-events: auto;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    tr > td.full-calendar__day.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after,
    tr > td.full-calendar__day.day--today.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after {
      opacity: 1;
    }

    tr > td.full-calendar__day > .calendar-day {
      position: relative;
      color: currentColor;
      z-index: 1;
      pointer-events: none;
    }
    tr > td.full-calendar__day.day--today {
      color: var(--app-datepicker-primary-color, #1a73e8);
    }
    tr > td.full-calendar__day.day--focused,
    tr > td.full-calendar__day.day--today.day--focused {
      color: #fff;
    }
    tr > td.full-calendar__day.day--empty,
    tr > td.full-calendar__day.weekday-label,
    tr > td.full-calendar__day.day--disabled > .calendar-day {
      pointer-events: none;
    }
    tr > td.full-calendar__day.day--disabled:not(.day--today) {
      color: rgba(0, 0, 0, .35);
    }

    .year-list-view__list-item {
      position: relative;
      width: 100%;
      padding: 12px 16px;
      text-align: center;
      /** NOTE: Reduce paint when hovering and scrolling, but this increases memory usage */
      /* will-change: opacity; */
      /* outline: none; */
    }
    .year-list-view__list-item:hover {
      cursor: pointer;
    }
    .year-list-view__list-item > div {
      z-index: 1;
    }
    .year-list-view__list-item::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0;
      pointer-events: none;
    }
    .year-list-view__list-item:focus::after,
    .year-list-view__list-item:hover::after {
      opacity: .05;
    }
    .year-list-view__list-item.year--selected {
      color: var(--app-datepicker-primary-color, #1a73e8);
      font-size: 24px;
      font-weight: 500;
    }
    `,
    // tslint:enable:max-line-length
  ];

  @property({ type: Number, reflect: true })
  public firstDayOfWeek: number = 0;

  @property({ type: Boolean, reflect: true })
  public showWeekNumber: boolean = false;

  @property({ type: String, reflect: true })
  public weekNumberType: WEEK_NUMBER_TYPE = WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK;

  @property({ type: Boolean, reflect: true })
  public landscape: boolean = false;

  @property({ type: String, reflect: true })
  public get startView() {
    return this._startView!;
  }
  public set startView(val: string) {
    /**
     * NOTE: Defaults to `START_VIEW.CALENDAR` when `val` is falsy.
     */
    const defaultVal = !val ? START_VIEW.CALENDAR : val;

    /**
     * NOTE: No-op when `val` is not falsy and not valid accepted values.
     */
    if (defaultVal !== START_VIEW.CALENDAR && defaultVal !== START_VIEW.YEAR_LIST) return;

    const oldVal = this._startView;

    this._startView = defaultVal;
    this.requestUpdate('startView', oldVal);
  }

  @property({ type: String, reflect: true })
  public get min() {
    return this.__hasMin ? toFormattedDateString(this._min!) : '';
  }
  public set min(val: string) {
    const valDate = getResolvedDate(val);
    const focusedDate = this._focusedDate;
    const isValidMin = isValidDate(val, valDate);

    this._min = isValidMin ? valDate : this._todayDate;
    this.__hasMin = isValidMin;
    this.value = toFormattedDateString(+focusedDate < +valDate ? valDate : focusedDate);
    this.updateComplete.then(() => this.requestUpdate('min'));
  }

  @property({ type: String, reflect: true })
  public get max() {
    return this.__hasMax ? toFormattedDateString(this._max!) : '';
  }
  public set max(val: string) {
    const valDate = getResolvedDate(val);
    const focusedDate = this._focusedDate;
    const isValidMax = isValidDate(val, valDate);

    this._max = isValidMax ? valDate : this._maxDate;
    this.__hasMax = isValidMax;
    this.value = toFormattedDateString(+focusedDate > +valDate ? valDate : focusedDate);
    this.updateComplete.then(() => this.requestUpdate('max'));
  }

  @property({ type: String })
  public get value() {
    return toFormattedDateString(this._focusedDate);
  }
  public set value(val: string) {
    const valDate = getResolvedDate(val);

    if (isValidDate(val, valDate)) {
      this._focusedDate = new Date(valDate);
      this._selectedDate = this._lastSelectedDate = new Date(valDate);
      // this.valueAsDate = newDate;
      // this.valueAsNumber = +newDate;
    }
  }

  @property({ type: String })
  public locale: string = getResolvedLocale();

  @property({ type: String })
  public disabledDays: string = '';

  @property({ type: String })
  public disabledDates: string = '';

  @property({ type: String })
  public weekLabel: string = '';

  @property({ type: Number })
  public dragRatio: number = .15;

  @property({ type: Date })
  private _selectedDate: Date;

  @property({ type: Date })
  private _focusedDate: Date;

  @property({ type: String })
  private _startView?: START_VIEW;

  @query('.year-list-view__full-list')
  private _yearViewFullList?: HTMLDivElement;

  @query('.datepicker-body__calendar-view')
  private _datepickerBodyCalendarView?: HTMLDivElement;

  @query('.calendar-view__full-calendar')
  private _calendarViewFullCalendar?: HTMLDivElement;

  @query('.btn__year-selector')
  private _buttonSelectorYear?: HTMLButtonElement;

  @query('.year-list-view__list-item')
  private _yearViewListItem?: HTMLButtonElement;

  private _min?: Date;
  private _max?: Date;
  private __hasMin?: boolean = false;
  private __hasMax?: boolean = false;
  private _totalDraggableDistance?: number;
  private _todayDate?: Date;
  private _maxDate?: Date;
  private _dragAnimationDuration: number = 150;
  private _yearList: number[];
  private _hasNativeElementAnimate: boolean =
    Element.prototype.animate.toString().indexOf('[native code]') >= 0;
  private _formatters?: import('./datepicker-helpers').Formatters;
  private _disabledDaysSet?: Set<number>;
  private _disabledDatesSet?: Set<number>;
  private _calendarTracker?: Tracker;
  private _lastSelectedDate?: Date;
  private _dragging: boolean = false;

  public constructor() {
    super();

    this._trackingStartFn = this._trackingStartFn.bind(this);
    this._trackingMoveFn = this._trackingMoveFn.bind(this);
    this._trackingEndFn = this._trackingEndFn.bind(this);

    const todayDate = getResolvedDate();
    const allFormatters = updateFormatters(this.locale);
    const formattedTodayDate = toFormattedDateString(todayDate);
    const max = getResolvedDate('2100-12-31');

    this.value = formattedTodayDate;
    this.startView = START_VIEW.CALENDAR;

    this._min = new Date(todayDate);
    this._max = new Date(max);
    this._todayDate = todayDate;
    this._maxDate = max;
    this._yearList = toYearList(todayDate, max);
    this._selectedDate = new Date(todayDate);
    this._focusedDate = new Date(todayDate);
    this._formatters = allFormatters;
  }

  public disconnectedCallback() {
    super.disconnectedCallback();

    /**
     * NOTE: This could run before `_calendarTracker` is ready.
     */
    if (this._calendarTracker) {
      this._calendarTracker.disconnect();
      this._calendarTracker = void 0;
    }
  }

  protected render() {
    /**
     * NOTE: Update `_formatters` when `locale` changes.
     */
    if (this._formatters!.locale !== this.locale) this._formatters = updateFormatters(this.locale);

    /**
     * NOTE(motss): For perf reason, initialize all formatters for calendar rendering
     */
    const datepickerBodyContent: import('lit-element').TemplateResult =
      START_VIEW.YEAR_LIST === this._startView ?
        this._renderDatepickerYearList() : this._renderDatepickerCalendar();

    return html`
    <div class="datepicker-header">${this._renderHeaderSelectorButton()}</div>
    <div class="datepicker-body">${cache(datepickerBodyContent)}</div>
    `;
  }

  protected firstUpdated() {
    const firstFocusableElement = START_VIEW.CALENDAR === this._startView ?
      this._buttonSelectorYear : this._yearViewListItem;

    dispatchCustomEvent(this, 'datepicker-first-updated', { firstFocusableElement });
  }

  protected updated(changed: Map<keyof ParamUpdatedChanged, unknown>) {
    const startView = this._startView;

    if (changed.has('min') || changed.has('max')) {
      this._yearList = toYearList(this._min!, this._max!);

      if (START_VIEW.YEAR_LIST === startView) this.requestUpdate('_yearList');
    }

    if (changed.has('_startView') || changed.has('startView')) {
      if (START_VIEW.YEAR_LIST === startView) {
        const selectedYearScrollTop =
          48 * (this._selectedDate.getUTCFullYear() - this._min!.getUTCFullYear() - 2);

        targetScrollTo(this._yearViewFullList!, { top: selectedYearScrollTop, left: 0 });
      }
    }

    /**
     * NOTE(motss): A datepicker could start with a year list view. In a year view list, there is
     * no calendar rendered on screen. Therefore the tracker setup should not be setup until a
     * calendar view is selected. This also applies to updating draggable/ swipeable calendar's
     * position.
     */
    if (START_VIEW.CALENDAR === startView) {
      const dragEl = this._calendarViewFullCalendar!;

      if (!this._calendarTracker) {
        let started = false;
        let dx = 0;
        let abortDragIfHasMinDate = false;
        let abortDragIfHasMaxDate = false;

        const handlers: import('./tracker').TrackerHandlers = {
          down: () => {
            if (started) return;
            this._trackingStartFn();
            started = true;
          },
          move: (changedPointer, oldPointer) => {
            if (!started) return;

            dx += changedPointer.x - oldPointer.x;
            abortDragIfHasMinDate = dx > 0 && hasClass(dragEl, 'has-min-date');
            abortDragIfHasMaxDate = dx < 0 && hasClass(dragEl, 'has-max-date');

            if (abortDragIfHasMaxDate || abortDragIfHasMinDate) return;

            this._trackingMoveFn(dx);
          },
          up: (changedPointer, oldPointer) => {
            if (!started) return;
            if (abortDragIfHasMaxDate || abortDragIfHasMinDate) {
              abortDragIfHasMaxDate = false;
              abortDragIfHasMinDate = false;
              dx = 0;
              return;
            }

            dx += changedPointer.x - oldPointer.x;
            this._trackingEndFn(dx);
            dx = 0;
            started = false;
          },
        };

        this._calendarTracker = new Tracker(dragEl, handlers);
      }

      /** NOTE(motss): Always update calendar position */
      const totalDraggableDistance =
        this._datepickerBodyCalendarView!.getBoundingClientRect().width;

      this._calendarViewFullCalendar!.style.transform =
        `translate3d(${makeNumberPrecise(totalDraggableDistance * -1)}px, 0, 0)`;
      this._totalDraggableDistance = totalDraggableDistance;
    }
  }

  private _renderHeaderSelectorButton() {
    const { yearFormatter, dateFormatter } = this._formatters!;
    const isCalendarView = this.startView === START_VIEW.CALENDAR;
    const focusedDate = this._focusedDate;
    const formattedDate = dateFormatter(focusedDate);
    const formatterFy = yearFormatter(focusedDate);

    return html`
    <button
      class="${classMap({ 'btn__year-selector': true, selected: !isCalendarView })}"
      data-view="${START_VIEW.YEAR_LIST}"
      @click="${this._updateView(START_VIEW.YEAR_LIST)}">${formatterFy}</button>

    <div class="datepicker-toolbar">
      <button
        class="${classMap({ 'btn__calendar-selector': true, selected: isCalendarView })}"
        data-view="${START_VIEW.CALENDAR}"
        @click="${this._updateView(START_VIEW.CALENDAR)}">${formattedDate}</button>
    </div>
    `;
  }

  private _renderDatepickerYearList() {
    const { yearFormatter } = this._formatters!;
    const focusedDateFy = this._focusedDate.getUTCFullYear();

    return html`
    <div class="datepicker-body__year-list-view">
      <div class="year-list-view__full-list" @click="${this._updateYear}">
      ${this._yearList.map(n =>
        html`<button
          class="${classMap({
            'year-list-view__list-item': true,
            'year--selected': focusedDateFy === n,
          })}"
          .year="${n}">
          <div>${yearFormatter(toUTCDate(n, 0, 1))}</div>
        </button>`)
      }</div>
    </div>
    `;
  }

  private _renderDatepickerCalendar() {
    const {
      longMonthYearFormatter,
      dayFormatter,
      fullDateFormatter,
      longWeekdayFormatter,
      narrowWeekdayFormatter,
    } = this._formatters!;
    const disabledDays = this.disabledDays;
    const showWeekNumber = this.showWeekNumber;
    const focusedDate = this._focusedDate;
    const firstDayOfWeek = this.firstDayOfWeek;
    const todayDate = getResolvedDate();

    let hasMinDate = false;
    let hasMaxDate = false;

    const { calendars, disabledDaysSet, disabledDatesSet, weekdays } = computeAllCalendars({
      disabledDays,
      firstDayOfWeek,
      disabledDates: this.disabledDates,
      selectedDate: this._selectedDate,
      showWeekNumber: this.showWeekNumber,
      weekNumberType: this.weekNumberType,
      max: this._max!,
      min: this._min!,
      weekLabel: this.weekLabel,

      dayFormatterFn: dayFormatter,
      fullDateFormatterFn: fullDateFormatter,
      longWeekdayFormatterFn: longWeekdayFormatter,
      narrowWeekdayFormatterFn: narrowWeekdayFormatter,
    });
    const weekdaysContent = weekdays.map(o => html`<th aria-label="${o.label}">${o.value}</th>`);
    const calendarsContent = calendars.map((daysInMonth, i) => {
      if (daysInMonth == null) {
        /** NOTE: If first and last month is of type null, set the corresponding flag. */
        if (i === 0) hasMinDate = true;
        if (i === 2) hasMaxDate = true;

        return html`<div class="calendar-container"></div>`;
      }

      let formattedDate: string | null = null;

      const tbodyContent = daysInMonth.map((n) => {
        const trContent = n.map((o, oi) => {
          const { disabled, fullDate, label, value } = o;

          if (fullDate == null && value == null) {
            return html`<td class="full-calendar__day day--empty"></td>`;
          }

          /** NOTE(motss): Could be week number labeling */
          if (fullDate == null && showWeekNumber && oi < 1) {
            return html`
            <td class="full-calendar__day weekday-label" aria-label="${label}">${value}</td>
            `;
          }

          const curTime = +new Date(fullDate!);

          if (formattedDate == null) formattedDate = longMonthYearFormatter(curTime);

          const tdClass = classMap({
            'full-calendar__day': true,
            'day--disabled': disabled,
            'day--today': +todayDate === curTime,
            'day--focused': !disabled && +focusedDate === curTime,
          });

          return html`
          <td
            class="${tdClass}"
            aria-label="${label}"
            .fullDate="${fullDate}"
            .day="${value}">
            <div class="calendar-day">${value}</div>
          </td>
          `;
        });

        return html`<tr>${trContent}</tr>`;
      });

      return html`
      <div class="calendar-container">
        <div class="calendar-label">${formattedDate}</div>

        <table class="calendar-table" @click="${this._updateFocusedDate}">
          <thead>
            <tr class="calendar-weekdays">${weekdaysContent}</tr>
          </thead>

          <tbody>${tbodyContent}</tbody>
        </table>
      </div>
      `;
    });

    /**
     * FIXME(motss): For unknown reason, this has to be moved out of the `html` tagged literal. On
     * IE11, this particular element is not parsed by `ShadyCSS` thus losing the original CSS
     * styling when it first gets rendered. This workaround resolves the issue temporarily but still
     * good to dig into this further to find out the root cause and report it to the Polymer Team.
     */
    const calendarViewFullCalendarContentCls = classMap({
      'calendar-view__full-calendar': true,
      'has-min-date': hasMinDate,
      'has-max-date': hasMaxDate,
    });
    const calendarViewFullCalendarContent =
      html`<div
        class="${calendarViewFullCalendarContentCls}"
        tabindex="0"
        @keyup="${this._updateMonthWithKeyboard}">${calendarsContent}</div>`;

    /** NOTE: Updates disabled dates and days with computed Sets. */
    this._disabledDatesSet = disabledDatesSet;
    this._disabledDaysSet = disabledDaysSet;

    /**
     * FIXME(motss): Allow users to customize the aria-label for accessibility and i18n reason.
     */
    return html`
    <div class="datepicker-body__calendar-view">
      <div class="calendar-view__month-selector">
        <div class="month-selector-container">${hasMinDate ? null : html`
          <button
            class="btn__month-selector"
            aria-label="Previous month"
            @click="${this._updateMonth(MONTH_UPDATE_TYPE.PREVIOUS)}"
          >${iconChevronLeft}</button>
        `}</div>

        <div class="month-selector-container">${hasMaxDate ? null : html`
          <button
            class="btn__month-selector"
            aria-label="Next month"
            @click="${this._updateMonth(MONTH_UPDATE_TYPE.NEXT)}"
          >${iconChevronRight}</button>
        `}</div>
      </div>

      ${calendarViewFullCalendarContent}
    </div>
    `;
  }

  private _updateView(view: START_VIEW) {
    const handleUpdateView = () => {
      if (START_VIEW.CALENDAR === view) {
        this._selectedDate = this._lastSelectedDate =
          new Date(updateYearWithMinMax(this._focusedDate, this._min!, this._max!));
      }

      this._startView = view;
    };

    return passiveHandler(handleUpdateView);
  }

  private _updateMonth(updateType: string) {
    const handleUpdateMonth = () => {
      const calendarViewFullCalendar = this._calendarViewFullCalendar!;
      const totalDraggableDistance = this._totalDraggableDistance!;
      const dateDate = this._lastSelectedDate || this._selectedDate;
      const minDate = this._min!;
      const maxDate = this._max!;

      const isPreviousMonth = updateType === MONTH_UPDATE_TYPE.PREVIOUS;
      const initialX = totalDraggableDistance * -1;
      const newDx = totalDraggableDistance * (isPreviousMonth ? 0 : -2);

      const newSelectedDate = toUTCDate(
        dateDate.getUTCFullYear(),
        dateDate.getUTCMonth() + (isPreviousMonth ? -1 : 1),
        1);
      const newSelectedDateFy = newSelectedDate.getUTCFullYear();
      const newSelectedDateM = newSelectedDate.getUTCMonth();

      const minDateFy = minDate.getUTCFullYear();
      const minDateM = minDate.getUTCMonth();

      const maxDateFy = maxDate.getUTCFullYear();
      const maxDateM = maxDate.getUTCMonth();

      /**
       * NOTE: Instead of debouncing/ throttling the animation when switching between
       * calendar months, this prevents subsequent animation that can cause an issue
       * where a blank calendar comes into view to be queued by ensuring the new updated
       * selected date's month always fall between the defined `_min` and `_max` values.
       * Not only does it prevents the aforementioned issue but also avoid adding too much
       * delay in between animations. Happy spamming the animations as you wish! 😄 🎉
       */
      const isLessThanYearAndMonth = newSelectedDateFy < minDateFy ||
        (newSelectedDateFy <= minDateFy && newSelectedDateM < minDateM);
      const isMoreThanYearAndMonth = newSelectedDateFy > maxDateFy ||
        (newSelectedDateFy >= maxDateFy && newSelectedDateM > maxDateM);
      if (isLessThanYearAndMonth || isMoreThanYearAndMonth) return this.updateComplete;

      /**
       * NOTE: This improves spamming animations via gestures but relying on another property
       * to keep track of the last/ latest selected date so that when you spam click on
       * the navigate next button 3 times, based on the expected mental model and behavior,
       * the calendar month should switch 3 times, e.g. Jan 2020 -> 3 clicks -> Apr 2020.
       */
      this._lastSelectedDate = newSelectedDate;

      return this._animateCalendar({
        target: calendarViewFullCalendar,
        from: initialX,
        to: newDx,
        postX: initialX,
        postTask: () => {
          /**
           * NOTE: We can **ONLY** update `_selectedDate` when animation finishes due to UX.
           * It will defeat the purpose of animating the calendar month during switching
           * as calendar month gets updated before the animation kicks in.
           */
          this._selectedDate = this._lastSelectedDate!;
          return this.updateComplete;
        },
      });
    };

    return passiveHandler(handleUpdateMonth);
  }

  @eventOptions({ passive: true })
  private _updateYear(ev: MouseEvent) {
    const selectedYearEl = findShadowTarget(
      ev,
      (n: HTMLElement) => hasClass(n, 'year-list-view__list-item')) as HTMLButtonElement;

    if (selectedYearEl == null) return;

    /**
     * 2 things to do here:
     *  - Update `_selectedDate` and `_focusedDate` with update `year` value of old focused date
     *  - Update `_startView` to `START_VIEW.CALENDAR`
     */

    const newFocusedDate = updateYearWithMinMax(new Date(
      this._focusedDate!).setUTCFullYear(+selectedYearEl.year), this._min!, this._max!);

    this._selectedDate = this._lastSelectedDate = new Date(newFocusedDate);
    this._focusedDate = new Date(newFocusedDate);
    this._startView = START_VIEW.CALENDAR;
  }

  @eventOptions({ passive: true })
  private _updateFocusedDate(ev: MouseEvent) {
    if (this._dragging) return;

    const selectedDayEl = findShadowTarget(
      ev,
      (n: HTMLElement) => hasClass(n, 'full-calendar__day')) as HTMLTableCellElement;

    /** NOTE: Required condition check else these will trigger unwanted re-rendering */
    if (selectedDayEl == null ||
      [
        'day--empty',
        'day--disabled',
        'day--focused',
        'weekday-label',
      ].some(n => hasClass(selectedDayEl, n))) return;

    this._focusedDate = new Date(this._selectedDate.setUTCDate(+selectedDayEl.day!));
  }

  private _trackingStartFn() {
    const trackableEl = this._calendarViewFullCalendar!;
    const trackableElWidth = trackableEl.getBoundingClientRect().width;

    /**
     * NOTE(motss): Perf tips - By setting fixed width for the following containers,
     * it drastically minimizes layout and painting during tracking even on slow
     * devices:-
     *
     *  - `.calendar-view__full-calender`
     *  - `.datepicker-body__calendar-view`
     */
    trackableEl.style.width = trackableEl.style.minWidth = `${trackableElWidth}px`;
    this._totalDraggableDistance = trackableElWidth / 3;
  }

  private _trackingMoveFn(dx: number) {
    const totalDraggableDistance = this._totalDraggableDistance!;
    const clamped = Math.min(totalDraggableDistance, Math.abs(dx));
    const newX = totalDraggableDistance! * -1 + (clamped * (dx > 0 ? 1 : -1));

    this._dragging = true;
    this._calendarViewFullCalendar!.style.transform =
      `translate3d(${makeNumberPrecise(newX)}px, 0, 0)`;
  }

  private _animateCalendar({ target, from, to, postX, postTask }: ParamsAnimateCalendar) {
    return new Promise(yay => (target.animate([
      { transform: `translate3d(${makeNumberPrecise(from)}px, 0, 0)` },
      { transform: `translate3d(${makeNumberPrecise(to)}px, 0, 0)` },
    ], {
      duration: this._dragAnimationDuration,
      easing: 'cubic-bezier(0, 0, .4, 1)',
      fill: this._hasNativeElementAnimate ? 'none' : 'both',
    })).onfinish = yay)
      .then(postTask)
      .then(() => {
        target.style.transform = `translate3d(${makeNumberPrecise(postX)}px, 0, 0)`;
        return this.updateComplete;
      })
      .then(() => dispatchCustomEvent(this, 'datepicker-animation-finished'));
  }
  private _trackingEndFn(dx: number) {
    const totalDraggableDistance = this._totalDraggableDistance!;
    const isPositive = dx > 0;
    const absDx = Math.abs(dx);
    const clamped = Math.min(totalDraggableDistance, absDx);
    const initialX = totalDraggableDistance * -1;
    const newX = totalDraggableDistance * -1 + (clamped * (isPositive ? 1 : -1));
    /**
     * NOTE(motss): If dragged distance < `dragRatio`, reset calendar position.
     */
    const shouldReset = absDx < totalDraggableDistance * this.dragRatio;

    return this._animateCalendar({
      target: this._calendarViewFullCalendar!,
      from: newX,
      to: shouldReset ? initialX : totalDraggableDistance! * (isPositive ? 0 : -2),
      postX: initialX,
      postTask: () => {
        if (!shouldReset) {
          const dateDate = new Date(this._selectedDate);
          const m = dateDate.getUTCMonth();

          this._selectedDate = this._lastSelectedDate =
            new Date(dateDate.setUTCMonth(m + (isPositive ? -1 : 1)));
        }

        const trackableEl = this._calendarViewFullCalendar!;
        trackableEl.style.width = trackableEl.style.minWidth = '';

        this._dragging = false;
        return this.updateComplete;
      },
    });
  }

  // Left Move focus to the previous day. Will move to the last day of the previous month,
  //  if the current day is the first day of a month.
  // Right Move focus to the next day. Will move to the first day of the following month,
  //  if the current day is the last day of a month.
  // Up Move focus to the same day of the previous week.
  //  Will wrap to the appropriate day in the previous month.
  // Down Move focus to the same day of the following week.
  //  Will wrap to the appropriate day in the following month.
  // PgUp Move focus to the same date of the previous month. If that date does not exist,
  //  focus is placed on the last day of the month.
  // PgDn Move focus to the same date of the following month. If that date does not exist,
  //  focus is placed on the last day of the month.
  // Alt+PgUp Move focus to the same date of the previous year.
  //  If that date does not exist (e.g leap year), focus is placed on the last day of the month.
  // Alt+PgDn Move focus to the same date of the following year.
  //  If that date does not exist (e.g leap year), focus is placed on the last day of the month.
  // Home Move to the first day of the month.
  // End Move to the last day of the month
  // Tab / Shift+Tab If the datepicker is in modal mode, navigate between calender grid and
  //  close/previous/next selection buttons, otherwise move to the field following/preceding the
  //  date textbox associated with the datepicker
  // Enter / Space Fill the date textbox with the selected date then close the datepicker widget.
  @eventOptions({ passive: true })
  private _updateMonthWithKeyboard(ev: KeyboardEvent) {
    const keyCode = ev.keyCode;

    /** NOTE: Skip updating and fire an event to notify of updated focused date. */
    if (KEYCODES_MAP.ENTER === keyCode || KEYCODES_MAP.SPACE === keyCode) {
      dispatchCustomEvent(this, 'datepicker-value-updated', { value: this.value });
      return;
    }

    /** NOTE: Skip for TAB key and other non-related keys */
    if (keyCode === KEYCODES_MAP.TAB || !ALL_NAV_KEYS_SET.has(keyCode)) return;

    console.time('compute-next-focused-date');
    const selectedDate = this._selectedDate;
    const nextFocusedDate = computeNextFocusedDate({
      keyCode,
      selectedDate,

      disabledDatesSet: this._disabledDatesSet!,
      disabledDaysSet: this._disabledDaysSet!,
      focusedDate: this._focusedDate,
      hasAltKey: ev.altKey,
      maxTime: +this._max!,
      minTime: +this._min!,
    });
    console.timeEnd('compute-next-focused-date');

    const nextFocusedDateFy = nextFocusedDate.getUTCFullYear();
    const nextFocusedDateM = nextFocusedDate.getUTCMonth();
    const selectedDateFY = selectedDate.getUTCFullYear();
    const selectedDateM = selectedDate.getUTCMonth();
    /**
     * NOTE: Update `_selectedDate` if new focused date is no longer in the same month or year.
     */
    if (nextFocusedDateFy !== selectedDateFY || nextFocusedDateM !== selectedDateM) {
      this._selectedDate = nextFocusedDate;
    }

    this._focusedDate = nextFocusedDate;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'app-datepicker': AppDatepicker;
  }

  interface HTMLTableCellElement {
    day: string;
  }

  interface HTMLButtonElement {
    year: number;
  }
}

// FIXED: To look into `passive` event listener option in future.
// FIXED: To reflect value on certain properties according to specs/ browser impl: min, max, value.
// FIXED: `disabledDates` are not supported
// FIXED: Updating `min` via attribute or property breaks entire UI
// FIXED: To improve date navigation using keyboard. Disabled date are selectable with Left, Right
//        arrows.
// FIXED: To add support for labels such week number for better i18n
// FIXED: To fix hardcoded `_yearList` when `min` has no initial value.
// FIXED: PgUp/ PgDown on new date that does not exist should fallback to last day of month.
// FIXED: Update year should update `_lastSelectedDate`
// FIXED: Showing blank calendar when updating year
// FIXED: Buggy condition check for max date when updating month
// FIXED: Gestures are broken on landscape mode.
// FIXED: `landscape` attribute breaks layout.
// FIXED: Do not update focused date while dragging/ swiping calendar
// FIXED: app-datepicker's initial-render.spec.ts fails for unknown reason
// FIXED: `disabledDays` is broken with `firstDayofWeek`
// FIXED: When a new property is set, it re-renders the calendar to last focused date but
//        never updates the selected date
// TODO: To suppport `valueAsDate` and `valueAsNumber`.
// TODO: To support RTL layout.
// FIXME: Replace Web Animations for better support for animations on older browsers.
// FIXME: Add test for custom events
