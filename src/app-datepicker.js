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
      value: Date,
      selectedView: String,
      selectedYear: String,

      _selectedDate: Date,

      __allAvailableYears: Array,
      __allWeekdays: Array,
      __allDaysInMonth: Array,
    };
  }

  constructor() {
    super();

    this.initProps();
    this.setAttribute('type', 'date');
  }

  render({
    min,
    max,
    value,
    // required,
    // pattern,

    selectedView,
    selectedYear,

    _selectedDate,

    __allAvailableYears,
    __allWeekdays,
    __allDaysInMonth,
  }) {
    const renderedCalendar = this.setupCalendar(
      __allWeekdays,
      this.computeAllDaysInMonth(_selectedDate),
      min,
      max
    );

    return html`
      <style>
        :host {
          display: block;

          width: var(--app-datepicker-width);
          /** NOTE: Magic number as 16:9 aspect ratio does not look good */
          height: calc(var(--app-datepicker-width) / .7);
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
          selected="${selectedView}"
          on-selected-changed="${(ev) => { this.selectedView = ev.detail.value; }}"
          attr-for-selected="view">
          <button class="btn--reset selector__year"
            view="year">${this.computeSelectedFormattedYear(_selectedDate)}</button>
          <button class="btn--reset selector__calendar"
            view="calendar">${this.computeSelectedFormattedDate(_selectedDate)}</button>
        </iron-selector>
      </div>

      <div class="datepicker__main">
        <iron-selector class="main__selector"
          selected="${selectedView}"
          on-selected-item-changed="${ev => this.onSelectedViewChanged(ev)}"
          attr-for-selected="view">
          <div class="selector__view-year" view="year">
            <iron-selector class="view-year__year-list"
              selected="${selectedYear}"
              on-selected-item-changed="${ev => this.onSelectedYearChanged(ev)}"
              attr-for-selected="year">${
              this
                .computeAllAvailableYears(selectedYear)
                .map(year =>
                  html`<button class="btn--reset year-list__year"
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
              <div>${this.computeSelectedFormattedMonth(_selectedDate)}</div>
              <paper-icon-button class$="month-selector__next-month${
                renderedCalendar.hasMaxDate ? ' next-month--disabled' : ''
              }"
                icon="datepicker:chevron-right"
                on-tap="${ev => this.incrementSelectedMonth(ev)}"></paper-icon-button>
            </div>

            <div class="view-calendar__full-calendar">${renderedCalendar.content}</div>
          </div>
        </iron-selector>
      </div>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm>ok</paper-button>
      </div>
    `;
  }

  initProps() {
    this.min = this.min == null
      ? AppDatepicker.toUTCDate(new Date(`${AppDatepicker.MIN_DATE}-01-01`))
      : this.min;
    this.max = this.max == null
      ? AppDatepicker.toUTCDate(new Date(`${AppDatepicker.MAX_DATE}-12-31`))
      : this.max;
    this.value = this.value == null
      ? AppDatepicker.toUTCDate(new Date())
      : this.value;
    this.selectedView = this.selectedView == null
      ? 'calendar'
      : this.selectedView;
    this.selectedYear = this.selectedYear == null
      ? AppDatepicker.toUTCDate(new Date()).getUTCFullYear()
      : this.selectedYear;

    this._selectedDate = AppDatepicker.toUTCDate(new Date());
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
        Promise.resolve()
          .then(() => this.centerYearListScroller(this.selectedYear));
      }
    }
  }

  onSelectedYearChanged(ev) {
    if (ev.detail && ev.detail.value) {
      const selectedYear = ev.detail.value.getAttribute('year');

      Promise.resolve()
        .then(() => this.centerYearListScroller(selectedYear))
        .then(() => {
          window.requestAnimationFrame(() => {
            this.selectedView = 'calendar';
            this.selectedYear = selectedYear;
            this._selectedDate = this.updateSelectedDate(this._selectedDate, {
              year: selectedYear,
            });
          });
        });
    }
  }

  computeAllAvailableYears(selectedYear) {
    return Array.from(Array(AppDatepicker.MAX_DATE - AppDatepicker.MIN_DATE + 1))
      .map((_, i) => ({
        label: AppDatepicker.MIN_DATE + i,
      }));
  }

  computeSelectedFormattedYear(selectedDate) {
    return AppDatepicker.formatDateWithIntl(selectedDate, {
      year: 'numeric',
    });
  }

  computeSelectedFormattedDate(selectedDate) {
    return AppDatepicker.formatDateWithIntl(selectedDate, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  computeSelectedFormattedMonth(selectedDate) {
    return AppDatepicker.formatDateWithIntl(selectedDate, {
      month: 'long',
      year: 'numeric',
    });
  }

  updateSelectedDate(currentDate, newDateOpts) {
    const fy = currentDate.getUTCFullYear();
    const m = currentDate.getUTCMonth();
    const d = currentDate.getUTCDate();
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
    const od = AppDatepicker.toUTCDate(this._selectedDate);
    const nfy = od.getUTCFullYear();
    const nm = od.getUTCMonth();
    const nd = od.getUTCDate();
    const newDate = new Date(Date.UTC(nfy, nm - 1, nd));

    const selectedYear = newDate.getUTCFullYear();

    this.selectedYear = selectedYear;
    this._selectedDate = this.updateSelectedDate(newDate, {
      year: selectedYear,
    });
  }

  incrementSelectedMonth() {
    const od = AppDatepicker.toUTCDate(this._selectedDate);
    const nfy = od.getUTCFullYear();
    const nm = od.getUTCMonth();
    const nd = od.getUTCDate();
    const newDate = new Date(Date.UTC(nfy, nm + 1, nd));

    const selectedYear = newDate.getUTCFullYear();

    this.selectedYear = selectedYear;
    this._selectedDate = this.updateSelectedDate(newDate, {
      year: selectedYear,
    });
  }

  centerYearListScroller(selectedYear) {
    // window.requestAnimationFrame(() => {
      this.selectorViewYear.scrollTo(0, (+selectedYear - AppDatepicker.MIN_DATE - 3) * 50);
    // });
  }

  computeAllDaysInMonth(selectedDate) {
    const fy = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();
    const totalDays = new Date(Date.UTC(fy, selectedMonth + 1, 0)).getDate();
    const firstWeekday = new Date(Date.UTC(fy, selectedMonth, 1)).getDay();

    return Array.from(Array(Math.ceil(totalDays / 7)))
      .reduce((p, n, i) => {
        return p.concat([
          [
            ...(
              firstWeekday > 0 && i < 1
                ? Array.from(
                  Array(firstWeekday),
                  n => ({ original: null, label: null, value: null })
                )
                : []
            ),
            ...Array.from(Array(7 - (i < 1 ? firstWeekday : 0)), (n, ni) => {
              const day = (i * 7) + ni + 1;

              if (day > totalDays) {
                return {
                  original: null,
                  label: null,
                  value: null,
                };
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
            }),
          ],
      ]);
    }, []);
  }

  setupCalendar(allWeekdays, allDaysInMonth, min, max) {
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

          return html`<td><div class$="full-calendar__day${
            oriTimestamp < minTimestamp || oriTimestamp > maxTimestamp
              ? ' day--disabled'
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
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
