/** Import project dependencies */
import '../node_modules/@polymer/iron-selector/iron-selector.js';
import '../node_modules/@polymer/paper-button/paper-button.js';
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import * as Polymer from '../node_modules/@polymer/polymer/polymer-element.js';

/** Import other modules */
import './app-datepicker-icons.js';

export class AppDatepicker extends Polymer.Element {
  static get is() {
    return 'app-datepicker';
  }

  static get template() {
    console.log('🚧 template', Polymer);

    return Polymer.html`
      <style>
        :host {
          display: block;

          width: var(--app-datepicker-width);
          height: calc(var(--app-datepicker-width) / .6);
          background-color: #fff;

          --app-datepicker-width: 300px;
          --app-datepicker-primary-color: #4285F4;

          --app-datepicker-header-height: 80px;

          --app-datepicker-footer-height: 56px;
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

          @apply --layout-horizontal;
          @apply --layout-center;
        }

        .header__selector {
          width: 100%;
          padding: 0 14px;

          @apply --layout-vertical;
          @apply --layout-center-justified;
        }
        .selector__year,
        .selector__calendar {
          color: #fff;
          opacity: .7;

          text-overflow: ellipsis;
          overflow: hidden;

          @apply --layout-horizontal;
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
          overflow: auto;

          @apply --layout-vertical;
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
          padding: 16px;

          @apply --layout-horizontal;
          @apply --layout-center-center;
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
          left: 16px;
        }
        .view-calendar__month-selector > .month-selector__next-month {
          right: 16px;
        }

        .view-calendar__full-calendar > table {
          width: 100%;
        }
        .view-calendar__full-calendar > table tr {
          padding: 0 16px;
        }
        .view-calendar__full-calendar > table tr > th,
        .view-calendar__full-calendar > table tr > td {
          max-width: 40px;
          max-height: 40px;
          width: 100%;
          height: 100%;
          text-align: center;
        }
        .view-calendar__full-calendar > table tr > td > paper-button {
          min-width: 0;
          width: 40px;
          height: 40px;
          margin: 0;
          padding: 0;
          border-radius: 50%;
        }

        .datepicker__footer {
          background-color: #fff;
          width: 100%;
          height: var(--app-datepicker-footer-height);
          padding: 0 8px 0 0;

          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-end-justified;
        }
        .datepicker__footer > paper-button {
          color: var(--app-datepicker-primary-color);
          font-size: 14px;

          --paper-button-ink-color: #848484;
        }
      </style>

      <div class="datepicker__header">
        <iron-selector class="header__selector"
          selected="{{selectedView}}"
          attr-for-selected="view">
          <button class="btn--reset selector__year"
            view="year">[[computeSelectedFormattedYear(_selectedDate)]]</button>
          <button class="btn--reset selector__calendar"
            view="calendar">[[computeSelectedFormattedDate(_selectedDate)]]</button>
        </iron-selector>
      </div>

      <div class="datepicker__main">
        <iron-selector class="main__selector"
          selected="{{selectedView}}"
          on-selected-item-changed="onSelectedViewChanged"
          attr-for-selected="view">
          <div class="selector__view-year" view="year">
            <iron-selector class="view-year__year-list"
              selected="{{selectedYear}}"
              on-selected-item-changed="onSelectedYearChanged"
              attr-for-selected="year">
              <template is="dom-repeat"
                items="[[__allAvailableYears]]"
                as="year"
                strip-whitespace>
                <button class="btn--reset year-list__year"
                  year="[[year.label]]">[[year.label]]</button>
              </template>
            </iron-selector>
          </div>

          <div class="selector__view-calendar" view="calendar">
            <div class="view-calendar__month-selector">
              <paper-icon-button class="month-selector__prev-month"
                icon="datepicker:chevron-left"
                on-tap="decrementSelectedMonth"></paper-icon-button>
              <div>[[computeSelectedFormattedMonth(_selectedDate)]]</div>
              <paper-icon-button class="month-selector__next-month"
                icon="datepicker:chevron-right"
                on-tap="incrementSelectedMonth"></paper-icon-button>
            </div>

            <div class="view-calendar__full-calendar"></div>
          </div>
        </iron-selector>
      </div>

      <div class="datepicker__footer">
        <paper-button dialog-dismiss>cancel</paper-button>
        <paper-button dialog-confirm>ok</paper-button>
      </div>
    `;
  }

  constructor() {
    super();
  }

  static get properties() {
    return {
      inputDate: {
        type: Date,
        value: () => AppDatepicker.toUTCDate(new Date()),
      },
      selectedView: {
        type: String,
        value: () => 'calendar',
      },
      selectedYear: {
        type: String,
        value: () => AppDatepicker.toUTCDate(new Date()).getUTCFullYear(),
      },

      _selectedDate: {
        type: Date,
        readOnly: true,
        value: () => AppDatepicker.toUTCDate(new Date()),
        // TODO: This should be computed with selectedYear, selectedMonth, selectedDay.
        // computed: 'computeSelectedDate()',
      },

      __allAvailableYears: {
        type: Array,
        readOnly: true,
        computed: 'computeAllAvailableYears(selectedYear)',
      },
      __allWeekdays: {
        type: Array,
        readOnly: true,
        value: () => {
          return Array.from(Array(7), (_, i) => {
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
        },
      },
      __allDaysInMonth: {
        type: Array,
        readOnly: true,
        computed: 'computeAllDaysInMonth(_selectedDate)',
        observer: 'setupFullCalendar',
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  onSelectedViewChanged(ev) {
    if (ev.detail && ev.detail.value) {
      console.log('🚧 onSelectedViewChanged', ev, this.selectedYear);

      const selectedView = ev.detail.value.getAttribute('view');

      if (/^year/i.test(selectedView)) {
        Promise.resolve()
          .then(() => this.centerYearListScroller(this.selectedYear));
      }
    }
  }

  onSelectedYearChanged(ev) {
    if (ev.detail && ev.detail.value) {
      const selectedYear = ev.detail.value.year;

      Promise.resolve()
        .then(() => this.centerYearListScroller(selectedYear))
        .then(() => {
          window.requestAnimationFrame(() => {
            console.log('🚧 onSelectedYearChanged', selectedYear);

            this.setProperties({
              selectedView: 'calendar',
              _selectedDate: this.updateSelectedDate(this._selectedDate, {
                year: selectedYear,
              }),
            }, true);
          });
        });
    }
  }

  computeAllAvailableYears(selectedYear) {
    return Array.from(Array(2100 - 1900 + 1))
      .map((_, i) => ({
        label: 1900 + i,
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

    this.setProperties({
      selectedYear,
      _selectedDate: this.updateSelectedDate(newDate, {
        year: selectedYear,
      }),
    }, true);
  }

  incrementSelectedMonth() {
    const od = AppDatepicker.toUTCDate(this._selectedDate);
    const nfy = od.getUTCFullYear();
    const nm = od.getUTCMonth();
    const nd = od.getUTCDate();
    const newDate = new Date(Date.UTC(nfy, nm + 1, nd));

    const selectedYear = newDate.getUTCFullYear();

    this.setProperties({
      selectedYear,
      _selectedDate: this.updateSelectedDate(newDate, {
        year: selectedYear,
      }),
    }, true);
  }

  centerYearListScroller(selectedYear) {
    window.requestAnimationFrame(() => {
      this.selectorViewYear.scrollTo(0, (+selectedYear - 1900 - 3) * 50);
    });
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
                ? Array.from(Array(firstWeekday), n => ({ original: '', label: '', value: '' }))
                : []
            ),
            ...Array.from(Array(7 - (i < 1 ? firstWeekday : 0)), (n, ni) => {
              const day = (i * 7) + ni + 1;

              if (day > totalDays) {
                return {
                  original: '',
                  label: '',
                  value: '',
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

  setupFullCalendar() {
    // console.log('🚧 computeFullCalendar', this.__allWeekdays, this.__allDaysInMonth);

    Promise.resolve()
      .then(() => {
        const tmpl = document.createElement('template');

        tmpl.innerHTML = `<table><tr>${
          this.__allWeekdays.map(n => `<th>${n.value}</th>`).join('')
        }</tr>${
          this.__allDaysInMonth.map((n) => {
            return `<tr>${
              n.map(m =>
                `<td><paper-button aria-label="${m.label}">${m.value}</paper-button></td>`)
                .join('')
            }</tr>`;
          }).join('')
        }</table>`;

        return tmpl;
      })
      .then((tmpl) => {
        this.shadowRoot.querySelector('.view-calendar__full-calendar').innerHTML = tmpl.innerHTML;
      });
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
    return Intl.DateTimeFormat(lang || 'en-US', { ...(opts || {}), })
      .format(AppDatepicker.toUTCDate(date));
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
