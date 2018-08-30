// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';

import {
  toUTCDate,
} from './helper';

export class AppDatepicker extends LitElement {
  public min: Date;
  public max: Date;
  public value: Date;
  public valueAsDate: Date;
  public valueAsNumber: number;

  public selectedView: string = 'calendar';
  public firstDayOfWeek: number = 0;
  public disabledDays: string = '';
  public locale: string = window.navigator.language;
  public weekdayFormat: string|null = null;
  public showWeekNumber: boolean = false;

  // tslint:disable-next-line:variable-name
  private _today: Date = toUTCDate();
  private _pattern: string = 'yyyy-MM-dd';

  constructor() {
    super();

    this.min = this._today;
    this.max = this._today;
    this.value = this._today;
    this.valueAsDate = this._today;
  }

  static get is() {
    return 'app-datepicker';
  }

  static get properties() {
    return {
      selectedView: { type: String },
    };
  }

  protected render() {
    return html`
<style>
  :host {
    display: block;

    width: var(--app-datepicker-width);
    /** NOTE: Magic number as 16:9 aspect ratio does not look good */
    height: calc((var(--app-datepicker-width) / .66) - var(--app-datepicker-footer-height, 56px));
    background-color: #fff;

    --app-datepicker-width: 300px;
    --app-datepicker-primary-color: #4285F4;

    --app-datepicker-header-height: 80px;
  }

  * {
    box-sizing: border-box;
  }

  .btn--reset {
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    margin: 0;
    padding: 0;
    background-color: inherit;
    color: inherit;
    font-size: inherit;
    border: none;
    box-sizing: border-box;
  }

  .datepicker__header {
    width: 100%;
    height: var(--app-datepicker-header-height);
    background-color: var(--app-datepicker-primary-color);

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .header__selector {
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

  .datepicker__main {
    position: relative;
    width: 100%;
    height: calc(100% - var(--app-datepicker-header-height));
    background-color: #fff;
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

  /** .selector__view-calendar {} */
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
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--today.day--selected > span,
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--disabled.day--selected > span,
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--today.day--disabled.day--selected > span,
  .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--selected > span {
    color: var(--app-datepicker-selected-day-color, #fff);
    z-index: 1;
  }
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--today.day--selected:after,
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--disabled.day--selected:after,
  .view-calendar__full-calendar >
    table tr > td > .full-calendar__day.day--today.day--disabled.day--selected:after,
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
  }

  /*
  .datepicker__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    background-color: #fff;
    width: 100%;
    height: var(--app-datepicker-footer-height);
    padding: 0 8px 0 0;
  }
  .datepicker__footer > paper-button {
    color: var(--app-datepicker-primary-color);
    font-size: 14px;

    --paper-button-ink-color: #848484;
  }
  */
</style>

<div class="datepicker__header">
  <iron-selector class="header__selector"
    selected="${postSelectedView}"
    on-tap="${(ev) => { this._selectedView = ev.target.getAttribute('view'); }}"
    attr-for-selected="view">
    <button class="btn--reset selector__year"
      view="year">${this.computeSelectedFormattedYear(_currentDate, locale)}</button>
    <button class="btn--reset selector__calendar"
      view="calendar">${this.computeSelectedFormattedDate(_currentDate, locale)}</button>
  </iron-selector>
</div>

<div class="datepicker__main">
  <iron-selector class="main__selector"
    selected="${postSelectedView}"
    on-selected-changed="${ev => this.onSelectedViewChanged(ev)}"
    attr-for-selected="view">
    <div class="selector__view-year" view="year">
      <iron-selector class="view-year__year-list"
        selected="${_selectedYear}"
        on-tap="${ev => this.onSelectedYearChangedOnTap(ev)}"
        attr-for-selected="year">${
          isCalendarView
            ? null
            : this.computeAllAvailableYears('year', _selectedYear, locale)
                .map(year => html`<button class="btn--reset year-list__year" year$="${
                  year.originalValue
                }" aria-label$="${year.label}">${year.value}</button>`)
      }</iron-selector>
    </div>

    <div class="selector__view-calendar" view="calendar">
      <div class="view-calendar__month-selector">
        <paper-icon-button class$="month-selector__prev-month${
          renderedCalendar.hasMinDate ? ' prev-month--disabled' : ''
        }"
          icon="datepicker:chevron-left"
          on-tap="${() => this.updateCurrentDateOnKeyup({
            altKey: false,
            keyCode: AppDatepicker.KEYCODES.PAGE_UP,
          })}"></paper-icon-button>
        <div>${this.computeSelectedFormattedMonth(_currentDate, locale)}</div>
        <paper-icon-button class$="month-selector__next-month${
          renderedCalendar.hasMaxDate ? ' next-month--disabled' : ''
        }"
          icon="datepicker:chevron-right"
          on-tap="${() => this.updateCurrentDateOnKeyup({
            altKey: false,
            keyCode: AppDatepicker.KEYCODES.PAGE_DOWN,
          })}"></paper-icon-button>
      </div>

      <div class="view-calendar__full-calendar"
        tabindex="0"
        on-tap="${ev => this.updateCurrentDateOnTap(ev)}">${renderedCalendar.content}</div>
    </div>
  </iron-selector>
</div>

<!-- <div class="datepicker__footer">
  <paper-button dialog-dismiss>cancel</paper-button>
  <paper-button dialog-confirm
    on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
</div> -->
`;
  }

  protected shouldUpdate(changed) {
    console.log({ changed }, 'shouldUpdate');

    return true;
  }

  protected firstRendered() {
    console.log({}, 'firstRendered');
  }
}

export default AppDatepicker;

window.customElements.define(AppDatepicker.is, AppDatepicker);
