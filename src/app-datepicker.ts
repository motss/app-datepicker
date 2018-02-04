// @ts-check

import '../node_modules/@polymer/iron-pages/iron-pages.js';
import '../node_modules/@polymer/iron-selector/iron-selector.js';
import '../node_modules/@polymer/paper-button/paper-button.js';
import * as Polymer from '../node_modules/@polymer/polymer/polymer-element.js';

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
        .main__selector > .selector__view-year {
          overflow: auto;
        }
        .main__selector > .selector__view-year > .view-year__year-list {
          /** DEBUG: Test oveflow in year list view */
          height: 999px;
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
            view="year">[[_selectedYear]]</button>
          <button class="btn--reset selector__calendar"
            view="calendar">[[_selectedFormattedDate]]</button>
        </iron-selector>
      </div>

      <div class="datepicker__main">
        <iron-selector class="main__selector"
          selected="{{selectedView}}"
          attr-for-selected="view">
          <div class="selector__view-year" view="year">
            <div class="view-year__year-list">year</div>
          </div>
          <div class="selector__view-calendar" view="calendar">Calendar</div>
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
        value: () => new Date(),
      },
      selectedView: {
        type: String,
        value: () => 'year',
      },

      _selectedDate: {
        type: Date,
        value: () => new Date(),
      },
      _selectedYear: {
        type: String,
        value: () => new Date().getUTCFullYear(),
        computed: 'computeSelectedYear(_selectedDate)',
      },
      _selectedFormattedDate: {
        type: String,
        computed: 'computeSelectedFormattedDate(_selectedDate)',
      },
    };
  }

  private computeSelectedYear(selectedDate) {
    return this.formatDateWithIntl(selectedDate, {
      year: 'numeric',
    });
  }

  private computeSelectedFormattedDate(selectedDate) {
    return this.formatDateWithIntl(selectedDate, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  private formatDateWithIntl(date: Date, opts: Intl.DateTimeFormatOptions, lang = 'en-US') {
    return Intl.DateTimeFormat(lang || 'en-US', { ...(opts || {}), }).format(new Date(date));
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
