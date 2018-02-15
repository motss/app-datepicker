/** Import project dependencies */
import '../node_modules/@polymer/iron-selector/iron-selector.js';
import '../node_modules/@polymer/paper-button/paper-button.js';
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import {
  html,
  LitElement,

  classString,
  renderAttributes,
  styleString,
} from '../node_modules/@polymer/lit-element/lit-element.js';

/** Import other modules */
import './app-datepicker-icons.js';

export class AppDatepicker extends LitElement {
  static get is() {
    return 'app-datepicker';
  }

  static get properties() {
    return {
      min: Date,
      max: Date,
      value: String,
      valueAsDate: Date,
      valueAsNumber: Number,

      _selectedDate: Date,
      _selectedView: String,
      _selectedYear: String,
      _currentDate: Date,
      _todayDate: Date,
      _pattern: String,

      __allAvailableYears: Array,
      __allWeekdays: Array,
    };
  }

  constructor() {
    super();

    this.initProps();
    this.setAttribute('type', 'date');
  }

  _shouldPropertiesChange(props, changedProps) {
    if (changedProps == null) {
      return;
    }

    Object.keys(changedProps)
      .filter(propKey => !/^_+/i.test(propKey))
      .map((propKey) => {
        switch (propKey) {
          case 'min':
          case 'max':
          case 'pattern': {
            break;
          }
          case 'value': {
            const propVal = changedProps[propKey];

            if (typeof propVal === 'string') {
              if (!propVal.length) {
                // NOTE: Clear selected date to signify invalid 'value'.
                this[propKey] = propVal;
                this.valueAsDate = null;
                this.valueAsNumber = NaN;
                this._selectedDate = null;
                this._currentDate = AppDatepicker.toUTCDate(new Date());

                return;
              }

              const toValueDate = new Date(propVal);

              if (
                /^invalid date/i.test(toValueDate) || !/^\d{4}\-\d{2}\-\d{2}/i.test(propVal)
                  // || !new RegExp(
                  //   this._pattern.replace(/(y|m|d)/gi, '\\d'),
                  //   'i'
                  // ).test(propVal)
              ) {
                console.warn(
                  `The specified value "${propVal}" does not conform to the required format, "${this._pattern}"`
                );

                return;
              }

              this[propKey] = propVal;
              this.valueAsDate = toValueDate;
              this.valueAsNumber = +toValueDate;
              this._selectedDate = toValueDate;
              this._currentDate = toValueDate;

              break;
            }
          }
          case 'valueAsDate': {
            const propVal = changedProps[propKey];

            if (propVal === null) {
              // NOTE: Clear selected date to signify invalid 'valueAsDate'.
              this[propKey] = null;
              this.value = '';
              this.valueAsNumber = NaN;
              this._selectedDate = null;
              this._currentDate = AppDatepicker.toUTCDate(new Date());

              return;
            }

            if (!(propVal instanceof Date)) {
              this[propKey] = AppDatepicker.toUTCDate(this.value || this.valueAsNumber);

              throw new TypeError(
                'Failed to set the \'valueAsDate\' property on \'HTMLInputElement\': The provided value is not a Date.'
              );
            }

            if (/^invalid date/i.test(new Date(propVal))) {
              // NOTE: Clear selected date to signify invalid 'valueAsDate'.
              this[propKey] = null;
              this.value = '';
              this.valueAsNumber = NaN;
              this._selectedDate = null;
              this._currentDate = AppDatepicker.toUTCDate(new Date());

              console.warn(
                `The specified value "${propVal}" does not conform to the required format, "${this._pattern}"`
              );

              return;
            }

            this[propKey] = propVal;
            this.value = propVal.toJSON().replace(/^(.+)T.+/i, '$1');
            this.valueAsNumber = +propVal;
            this._selectedDate = propVal;
            this._currentDate = propVal;

            break;
          }
          case 'valueAsNumber': {
            const propVal = changedProps[propKey];

            if (typeof propVal === 'string') {
              if (!propVal.length) {
                const toValueAsNumberDate = AppDatepicker.toUTCDate(new Date('1970-01-01'));

                this[propKey] = +toValueAsNumberDate;
                this.value = toValueAsNumberDate.toJSON().replace(/^(.+)T.+/i, '$1');
                this.valueAsDate = toValueAsNumberDate;
                this._selectedDate = toValueAsNumberDate;
                this._currentDate = toValueAsNumberDate;

                return;
              }

              if (/^invalid date/i.test(new Date(propVal))) {
                // NOTE: Clear selected date to signify invalid 'valueAsNumber'.
                this[propKey] = NaN;
                this.value = '';
                this.valueAsDate = null;
                this._selectedDate = null;
                this._currentDate = AppDatepicker.toUTCDate(new Date());

                return;
              }
            }

            if (propVal instanceof Date) {
              if (/^invalid date/i.test(propVal)) {
                // NOTE: Clear selected date to signify invalid 'valueAsNumber'.
                this[propKey] = NaN;
                this.value = '';
                this.valueAsDate = null;
                this._selectedDate = null;
                this._currentDate = AppDatepicker.toUTCDate(new Date());

                return;
              }
            }

            const toValueAsNumberDate = AppDatepicker.toUTCDate(propVal);

            this[propKey] = +toValueAsNumberDate;
            this.value = toValueAsNumberDate.toJSON().replace(/^(.+)T.+/i, '$1');
            this.valueAsDate = toValueAsNumberDate;
            this._selectedDate = toValueAsNumberDate;
            this._currentDate = toValueAsNumberDate;

            break;
          }
          default: {
            throw new Error(`Unknown propKey '${propKey}'`);
          }
        }
      });

    return true;
  }

  render({
    min,
    max,

    // required,
    // step,

    _selectedDate,
    _selectedView,
    _selectedYear,
    _currentDate,
    _todayDate,

    __allAvailableYears,
    __allWeekdays,
  }) {
    const renderedCalendar = this.setupCalendar(
      __allWeekdays,
      this.computeAllDaysInMonth(_currentDate),
      min,
      max,
      _selectedDate,
      _todayDate
    );

    return html`
      <style>
        :host {
          display: block;

          width: var(--app-datepicker-width);
          /** NOTE: Magic number as 16:9 aspect ratio does not look good */
          height: calc(var(--app-datepicker-width) / .66);
          background-color: #fff;

          --app-datepicker-width: 300px;
          --app-datepicker-primary-color: #4285F4;

          --app-datepicker-header-height: 80px;

          --app-datepicker-footer-height: 56px;

          border: 1px solid #ddd;
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
          height: calc(
            100% - var(--app-datepicker-header-height) - var(--app-datepicker-footer-height)
          );
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
          top: 0;
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
        }
        .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled {
          color: rgba(0, 0, 0, .26);
        }
        .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today.day--selected,
        .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--selected {
          background-color: var(--app-datepicker-selected-day-bg, var(--app-datepicker-primary-color));
          color: var(--app-datepicker-selected-day-color, #fff);
        }
        .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--disabled.day--today,
        .view-calendar__full-calendar > table tr > td > .full-calendar__day.day--today {
          color: var(--app-datepicker-today-color, var(--app-datepicker-primary-color));
        }

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
      </style>

      <div class="datepicker__header">
        <iron-selector class="header__selector"
          selected="${_selectedView}"
          on-selected-changed="${(ev) => { this._selectedView = ev.detail.value; }}"
          attr-for-selected="view">
          <button class="btn--reset selector__year"
            view="year">${this.computeSelectedFormattedYear(_currentDate)}</button>
          <button class="btn--reset selector__calendar"
            view="calendar">${this.computeSelectedFormattedDate(_currentDate)}</button>
        </iron-selector>
      </div>

      <div class="datepicker__main">
        <iron-selector class="main__selector"
          selected="${_selectedView}"
          on-selected-item-changed="${ev => this.onSelectedViewChanged(ev)}"
          attr-for-selected="view">
          <div class="selector__view-year" view="year">
            <iron-selector class="view-year__year-list"
              selected="${_selectedYear}"
              on-selected-item-changed="${ev => this.onSelectedYearChanged(ev)}"
              attr-for-selected="year">${
              __allAvailableYears.map(year => html`<button class="btn--reset year-list__year"
                year$="${year.label}">${year.label}</button>`)
            }</iron-selector>
          </div>

          <div class="selector__view-calendar" view="calendar">
            <div class="view-calendar__month-selector">
              <paper-icon-button class$="month-selector__prev-month${
                renderedCalendar.hasMinDate ? ' prev-month--disabled' : ''
              }"
                icon="datepicker:chevron-left"
                on-tap="${ev => this.decrementSelectedMonth(ev)}"></paper-icon-button>
              <div>${this.computeSelectedFormattedMonth(_currentDate)}</div>
              <paper-icon-button class$="month-selector__next-month${
                renderedCalendar.hasMaxDate ? ' next-month--disabled' : ''
              }"
                icon="datepicker:chevron-right"
                on-tap="${ev => this.incrementSelectedMonth(ev)}"></paper-icon-button>
            </div>

            <div class="view-calendar__full-calendar" tabindex="0"
              on-keyup="${ev => this.updateCurrentDateOnKeyup(ev)}"
              on-tap="${ev => this.updateCurrentDateOnTap(ev)}">${renderedCalendar.content}</div>
          </div>
        </iron-selector>
      </div>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm
          on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
      </div>
    `;
  }

  initProps() {
    const defaultToday = AppDatepicker.toUTCDate(new Date());
    const preSelectedYear = this._selectedYear == null
      ? defaultToday.getUTCFullYear()
      : this._selectedYear;
    const preValue = this.value == null
      ? defaultToday
      : AppDatepicker.toUTCDate(this.value);

    this.min = this.min == null
      ? AppDatepicker.toUTCDate(new Date(`${AppDatepicker.MIN_DATE}-01-01`))
      : this.min;
    this.max = this.max == null
      ? AppDatepicker.toUTCDate(new Date(`${AppDatepicker.MAX_DATE}-12-31`))
      : this.max;
    this.value = preValue.toJSON().replace(/^(.+)T.+/, '$1');
    this.valueAsDate = preValue;
    this.valueAsNumber = +preValue;

    this._selectedDate = preValue;
    this._selectedView = this._selectedView == null
      ? 'calendar'
      : this._selectedView;
    this._selectedYear = preSelectedYear;

    this._currentDate = preValue;
    this._todayDate = defaultToday;
    this._pattern = 'yyyy-MM-dd';

    this.__allAvailableYears = this.computeAllAvailableYears(preSelectedYear);
    this.__allWeekdays = Array.from(Array(7), (_, i) => {
      const d = new Date(Date.UTC(2017, 0, i + 1));

      return {
        original: d,
        label: AppDatepicker.formatDateWithIntl(d, {
          weekday: 'long',
        }),
        value: AppDatepicker.formatDateWithIntl(d, {
          weekday: 'narrow',
        }),
      };
    });
  }

  onSelectedViewChanged(ev) {
    if (ev.detail && ev.detail.value) {
      const selectedView = ev.detail.value.getAttribute('view');

      if (/^year/i.test(selectedView)) {
        this.centerYearListScroller(this._selectedYear)
      }
    }
  }

  onSelectedYearChanged(ev) {
    if (ev.detail && ev.detail.value) {
      const selectedYear = ev.detail.value.getAttribute('year');

      this.centerYearListScroller(selectedYear);

      this._selectedView = 'calendar';
      this._selectedYear = selectedYear;
      this._currentDate = this.updateCurrentDate(this._currentDate, {
        year: selectedYear,
      });
    }
  }

  computeAllAvailableYears(selectedYear) {
    return Array.from(Array(AppDatepicker.MAX_DATE - AppDatepicker.MIN_DATE + 1))
      .map((_, i) => ({
        label: AppDatepicker.MIN_DATE + i,
      }));
  }

  computeSelectedFormattedYear(currentDate) {
    return AppDatepicker.formatDateWithIntl(currentDate, {
      year: 'numeric',
    });
  }

  computeSelectedFormattedDate(currentDate) {
    return AppDatepicker.formatDateWithIntl(currentDate, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  computeSelectedFormattedMonth(currentDate) {
    return AppDatepicker.formatDateWithIntl(currentDate, {
      month: 'long',
      year: 'numeric',
    });
  }

  updateCurrentDate(currentDate, newDateOpts) {
    const preCurrentDate = currentDate == null
      ? AppDatepicker.toUTCDate(new Date())
      : currentDate;
    const fy = preCurrentDate.getUTCFullYear();
    const m = preCurrentDate.getUTCMonth();
    const d = preCurrentDate.getUTCDate();
    const {
      year,
      month,
      day,
    } = newDateOpts || {};
    const nfy = year == null ? fy : +year;
    const nm = month == null ? m : +month;
    const nd = day == null ? d : +day;

    return new Date(Date.UTC(nfy, nm, nd));
  }

  decrementSelectedMonth() {
    const od = AppDatepicker.toUTCDate(this._currentDate);
    const nfy = od.getUTCFullYear();
    const nm = od.getUTCMonth();
    const nd = od.getUTCDate();
    const newDate = new Date(Date.UTC(nfy, nm - 1, nd));

    const selectedYear = newDate.getUTCFullYear();

    this._selectedYear = selectedYear;
    this._currentDate = this.updateCurrentDate(newDate, {
      year: selectedYear,
    });
  }

  incrementSelectedMonth() {
    const od = AppDatepicker.toUTCDate(this._currentDate);
    const nfy = od.getUTCFullYear();
    const nm = od.getUTCMonth();
    const nd = od.getUTCDate();
    const newDate = new Date(Date.UTC(nfy, nm + 1, nd));

    const selectedYear = newDate.getUTCFullYear();

    this._selectedYear = selectedYear;
    this._currentDate = this.updateCurrentDate(newDate, {
      year: selectedYear,
    });
  }

  centerYearListScroller(selectedYear) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.selectorViewYear.scrollTo(0, (+selectedYear - AppDatepicker.MIN_DATE - 3) * 50);
      });
    });
  }

  computeAllDaysInMonth(currentDate) {
    const fy = currentDate.getUTCFullYear();
    const selectedMonth = currentDate.getUTCMonth();
    const totalDays = new Date(Date.UTC(fy, selectedMonth + 1, 0)).getDate();
    const firstWeekday = new Date(Date.UTC(fy, selectedMonth, 1)).getDay();

    return Array.from(Array(Math.ceil((totalDays + firstWeekday) / 7)))
      .reduce((p, _, i) => {
        return p.concat([
          Array.from(
            Array(7),
            (__, ni) => {
              if (i < 1 && (firstWeekday > 0 && firstWeekday < 7) && ni < firstWeekday) {
                return { original: null, label: null, value: null };
              }

              const day = (i * 7) + ni + 1 - firstWeekday;

              if (day > totalDays) {
                return { original: null, label: null, value: null };
              }

              const d = new Date(Date.UTC(fy, selectedMonth, day));

              return {
                original: d,
                label: AppDatepicker.formatDateWithIntl(d, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                }),
                value: AppDatepicker.formatDateWithIntl(d, {
                  day: 'numeric',
                }),
              };
            }
          ),
        ]);
    }, []);
  }

  setupCalendar(allWeekdays, allDaysInMonth, min, max, selectedDate, todayDate) {
    let hasMinDate = false;
    let hasMaxDate = false;
    const d = html`<table><tr>${
      allWeekdays.map(weekday => html`<th>${weekday.value}</th>`)
    }</tr>${
      allDaysInMonth
      .map((day) => {
        const rendered = day.map((d) => {
          /** NOTE: Disable month selector if needed */
          const oriTimestamp = +d.original;
          const minTimestamp = +min;
          const maxTimestamp = +max;

          hasMinDate = hasMinDate || (d.original == null ? false : oriTimestamp === minTimestamp);
          hasMaxDate = hasMaxDate || (d.original == null ? false : oriTimestamp === maxTimestamp);

          return d.label == null
            ? html`<td><div class="full-calendar__day"></div></td>`
            : html`<td><div class$="full-calendar__day${
              oriTimestamp < minTimestamp || oriTimestamp > maxTimestamp
                ? ' day--disabled'
                : ''
            }${
              +todayDate === oriTimestamp
                ? ' day--today'
                : ''
            }${
              +selectedDate === +oriTimestamp
                ? ' day--selected'
                : ''
            }" aria-label$="${d.label}">${d.value}</div></td>`;
        });

        return html`<tr>${rendered}</tr>`;
      })
    }</table>`;

    return {
      hasMinDate,
      hasMaxDate,
      content: d,
    };
  }

  updateCurrentDateOnTap(ev) {
    const elemOnTap = ev.target;
    const selectedDateElem = this.shadowRoot
      .querySelector('.view-calendar__full-calendar .full-calendar__day.day--selected');

    if (selectedDateElem && selectedDateElem.classList.contains('day--selected')) {
      selectedDateElem.classList.remove('day--selected');
    }

    elemOnTap.classList.add('day--selected');

    const newValue = this.updateCurrentDate(this._currentDate, {
      day: elemOnTap.textContent,
    });

    this._selectedDate = newValue;
    this._currentDate = newValue;
  }

  updateValue(selectedDate) {
    const preSelectedDate = AppDatepicker.toUTCDate(selectedDate);
    const formattedValue = preSelectedDate.toJSON().replace(/^(.+)T.+/, '$1');

    const evDetail = {
      detail: {
        originalValue: preSelectedDate,
        value: formattedValue,
        timezone: 'UTC',
      },
    };

    this.value = formattedValue;
    this.valueAsDate = preSelectedDate;
    this.valueAsNumber = +preSelectedDate;

    this.dispatchEvent(new CustomEvent('value-changed', { ...evDetail }));
    this.dispatchEvent(new CustomEvent('change', { ...evDetail }));
    this.dispatchEvent(new CustomEvent('input', { ...evDetail }));

    return {
      value: formattedValue,
      valueAsDate: preSelectedDate,
      valueAsNumber: +preSelectedDate,
    };
  }

  updateValueOnTap(ev) {
    const elemOnTap = ev.target;

    if (!elemOnTap.hasAttribute('dialog-confirm')) {
      return;
    }

    this.updateValue(this._selectedDate);
  }

  dateUpdaterOnKeyCode(keyCode) {
    const KEYCODES = AppDatepicker.KEYCODES;

    switch (keyCode) {
      case KEYCODES.UP: {
        return -7;
      }
      case KEYCODES.DOWN: {
        return 7;
      }
      case KEYCODES.LEFT: {
        return -1;
      }
      case KEYCODES.RIGHT: {
        return 1;
      }
      default: {
        return 0;
      }
    }
  }

  updateCurrentDateOnKeyup(ev) {
    // TODO: To add keyboard support to navigate the calendar.
    console.log('🚧 updateCurrentDateOnKeyup', ev);

    const {
      altKey,
      ctrlKey,
      keyCode,
    } = ev;
    const KEYCODES = AppDatepicker.KEYCODES;

    switch (keyCode) {
      case KEYCODES.UP:
      case KEYCODES.DOWN:
      case KEYCODES.LEFT:
      case KEYCODES.RIGHT: {
        const newDate = this.updateCurrentDate(this._currentDate, {
          day: this._currentDate.getUTCDate() + this.dateUpdaterOnKeyCode(keyCode),
        });

        this._selectedDate = newDate;
        this._currentDate = newDate;

        break;
      }
      case KEYCODES.SHIFT:
      case KEYCODES.ALT:
      case KEYCODES.PAGE_DOWN:
      case KEYCODES.PAGE_UP:
      case KEYCODES.HOME:
      case KEYCODES.END:
      case KEYCODES.SPACEBAR:
      case KEYCODES.ENTER:
      case KEYCODES.TAB: {
        return;
      }
      default: {
        throw new Error(`Unknown keystroke with key code ${keyCode}`);
      }
    }
  }

  // stepDown() {}
  // stepUp() {}

  get selectorViewYear() {
    return this.shadowRoot.querySelector('.selector__view-year');
  }

  static toUTCDate(date) {
    const toDate = new Date(date);
    const fy = toDate.getUTCFullYear();
    const m = toDate.getUTCMonth();
    const d = toDate.getUTCDate();

    return new Date(Date.UTC(fy, m, d));
  }

  static formatDateWithIntl(date, opts, lang = 'en-US') {
    return Intl.DateTimeFormat(
      lang || 'en-US',
      { ...(opts || {}) }
    )
      .format(AppDatepicker.toUTCDate(date));
  }

  static get MIN_DATE() {
    return 1970;
  }

  static get MAX_DATE() {
    return 2100;
  }

  static get KEYCODES() {
    return {
      UP: 38,
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39,

      PAGE_UP: 33,
      PAGE_DOWN: 34,

      END: 35,
      HOME: 36,

      ALT: 18,
      SHIFT: 16,

      ENTER: 13,
      SPACEBAR: 32,
      TAB: 9,
    };
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
