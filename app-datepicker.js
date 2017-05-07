/**
 * A contructor for AppDatepicker
 *
 * @class AppDatepicker
 * @extends {Polymer.Element}
 */
class AppDatepicker extends Polymer.Element {
  /**
   * Required id for <dom-module> for Polymer to pick up
   * the dom-module to stamp the template.
   *
   * @readonly
   * @static
   *
   * @memberOf AppDatepicker
   */
  static get is() {
    return 'app-datepicker';
  }

  /**
   * Polymer-specific properties.
   *
   * @readonly
   *
   * @memberOf AppDatepicker
   */
  static get properties() {
    return {
      disableDates: {
        type: Array,
      },

      disableDays: {
        type: Array,
        value: () => [0, 6],
      },

      firstDayOfWeek: {
        type: String,
        value: () => 0,
      },

      format: {
        type: String,
        value: () => 'yyyy-mm-dd',
      },

      inputDate: {
        type: Date,
      },

      locale: {
        type: String,
        value: () => {
          const localeFromNativeIntl = window.Intl
            && window.Intl.DateTimeFormat
            && new window.Intl.DateTimeFormat().resolvedOptions
            && new window.Intl.DateTimeFormat().resolvedOptions().locale;
          const localeFromNavigator = window.navigator.language;

          return localeFromNativeIntl || localeFromNavigator || 'en-US';
        },
      },

      maxDate: {
        type: Date,
        value: () => new Date('9999/12/31').toJSON(),
      },

      minDate: {
        type: Date,
        value: () => new Date('1970/1/1').toJSON(),
      },

      noAnimation: {
        type: Boolean,
      },

      selectedDate: {
        type: Date,
        readOnly: true,
        reflectToAttribute: true,
      },

      selectedView: {
        type: String,
      },

    };
  }

  /**
   * Polymer-specific observedAttributes.
   *
   * @readonly
   *
   * @memberOf AppDatepicker
   */
  get observedAttributes() {
    return [
    ];
  }

  /**
   * Observer changes to properties.
   *
   * @readonly
   * @static
   *
   * @memberOf AppDatepicker
   */
  static get observers() {
    return [
      // TODO: More to come.
      'setupDatepicker(locale)',
    ];
  }

  /**
   * Creates an instance of AppDatepicker.
   *
   * @memberOf AppDatepicker
   */
  constructor() {
    super();

    console.info('created!');
  }

  /**
   * Extended version of connectedCallback method
   * from Native Custom Element v1.
   *
   * @memberOf AppDatepicker
   */
  connectedCallback() {
    super.connectedCallback();

    console.info('connected.');

    // Setup datepicker.
    // this.setupDatepicker();
  }

  /**
   * Extended version of disconnectedCallback method
   * from Native Custom Element v1.
   *
   * @memberOf AppDatepicker
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    console.info('disconnected.');
  }

  /**
   *
   *
   *
   * @memberof AppDatepicker
   */
  setupDatepicker() {
    const now = this.parseInputDate(this.inputDate) || new Date();
    const lang = this.locale;
    const fdow = this.firstDayOfWeek;
    const date = now.getDate();
    const day = now.getDay();
    const month = now.getMonth();
    const fullYear = now.getFullYear();

    this._activeDateObject = {
      date,
      day,
      month,
      fullYear,

      longMonth: AppDatepicker.parseDateToMonth(lang, now, 'long'),
      longFullYear: AppDatepicker.parseDateToFullYear(lang, now, 'numeric'),
      shortDay: AppDatepicker.parseDateToDay(lang, now),
      shortMonth: AppDatepicker.parseDateToMonth(lang, now),
      shortWeekday: AppDatepicker.parseDateToWeekday(lang, now),

      weekdays: AppDatepicker.setupWeekdays(lang),
      daysOfMonth: AppDatepicker.setupDaysOfMonth(lang, fullYear, month, fdow),
    };

    /* Update selectedDate based on inputDate or fallback Date object */
    this._setSelectedDate(now.toJSON());

    console.log(this._activeDateObject);
    console.log(this.inputDate.toJSON(), this.selectedDate);
  }

  /**
   * Setup days of a month.
   *
   * @param {string} locale - Locale to format days of month.
   * @param {number} fullYear - Full year of the active date object.
   * @param {number} month - Month of the active date object.
   * @param {number} firstDayOfWeek - First day of the week.
   * @returns {string[]} Array of days of a month.
   *
   * @memberof AppDatepicker
   */
  static setupDaysOfMonth(locale, fullYear, month, firstDayOfWeek) {
    console.log(locale, fullYear, month, firstDayOfWeek);

    const totalDays = AppDatepicker.getTotalDaysOfMonth(fullYear, month);
    const startDay = new Date(fullYear, month, 1).getDay();
    const normalizedStartDay = AppDatepicker
      .getFirstDayOfWeek(firstDayOfWeek, startDay);
    const hasNativeIntl = AppDatepicker.hasNativeIntl;
    const formatter = hasNativeIntl
      ? new window.Intl.DateTimeFormat(locale, {
          day: 'numeric',
        }).format
      : (d) => d.getDate();
    let daysOfMonth = [];
    const labelFormatter = hasNativeIntl
      ? new window.Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format
      : (d) => d;

    for (let i = 0, j = 1 - startDay; i < 42; i++, j++) {
      const fullDate = new Date(fullYear, month, j);
      const date = formatter(fullDate);
      const dateLabel = labelFormatter(fullDate);
      const nd = normalizedStartDay;
      const shouldPushDate = i >= nd && i < nd + totalDays;
      const dayOfMonth = shouldPushDate
        ? {dateLabel, date, dateIndex: j}
        : {};

      daysOfMonth.push(dayOfMonth);
    }

    return daysOfMonth;
  }


  /**
   * Normalize day with pre-defined first day of week.
   *
   * @static
   * @param {number} firstDayOfWeek - First day of week.
   * @param {number} day - Current day.
   * @returns {number} Normalized day with first day of week.
   *
   * @memberof AppDatepicker
   */
  static getFirstDayOfWeek(firstDayOfWeek, day) {
    if (firstDayOfWeek > 0 && firstDayOfWeek < 7) {
      const startDay = day - firstDayOfWeek;

      return startDay < 0 ? 7 + startDay : startDay;
    }

    return day;
  }

  /**
   * Get the total days of a month in that given year.
   *
   * @static
   * @param {number} fullYear - Full year of a date.
   * @param {number} month - Month of a date.
   * @returns {number} - Total days of a month.
   *
   * @memberof AppDatepicker
   */
  static getTotalDaysOfMonth(fullYear, month) {
    return new Date(fullYear, month + 1, 0).getDate();
  }

  /**
   * Setup weekdays in text format.
   *
   * @static
   * @param {string} locale - Locale to format weekdays.
   * @returns {string[]} Array of formatted weekdays.
   *
   * @memberof AppDatepicker
   */
  static setupWeekdays(locale) {
    if (AppDatepicker.hasNativeIntl) {
      const formatter = new window.Intl.DateTimeFormat(locale, {
        weekday: 'narrow',
      }).format;
      const labelFormatter = new window.Intl.DateTimeFormat(locale, {
        weekday: 'long',
      }).format;

      return [
        new Date('2017-05-07'),
        new Date('2017-05-08'),
        new Date('2017-05-09'),
        new Date('2017-05-10'),
        new Date('2017-05-11'),
        new Date('2017-05-12'),
        new Date('2017-05-13'),
      ].map((date) => ({
        weekdayLabel: labelFormatter(date),
        weekday: formatter(date),
      }));
    }

    return AppDatepicker.defaultWeekdays.map((wd) => {
      return {
        weekdayLabel: wd,
        weekday: wd.slice(0, 1),
      };
    });
  }

  /**
   * Check if native Intl is supported.
   *
   * @returns {boolean} True if native Intl is supported.
   *
   * @memberOf AppDatepicker
   */
  static get hasNativeIntl() {
    return window.Intl && window.Intl.DateTimeFormat;
  }

  /**
   * Parse date into full year in text format.
   *
   * @static
   * @param {string} locale - Locale to format date.
   * @param {Date} date - Date object.
   * @param {string} [year='numeric'] - Representation of the year.
   *  Defaults to 'numeric'. Possible values are 'numeric' and '2-digit'.
   * @returns {string} Full year in text format.
   *
   * @memberof AppDatepicker
   */
  static parseDateToFullYear(locale, date, year = 'numeric') {
    if (AppDatepicker.hasNativeIntl) {
      return new window.Intl.DateTimeFormat(locale, {
        year,
      }).format(date);
    }

    return year === '2-digit'
      ? `${date.getFullYear()}`.slice(-2)
      : date.getFullYear();
  }

  /**
   * Parse date into month in text format.
   *
   * @static
   * @param {string} locale - Locale to format date.
   * @param {Date} date - Date object.
   * @param {string} [month='short'] - Representation of the month.
   *  Defaults to 'short'. Possible values are 'numeric', '2-digit', 'narrow',
   *  'short', and 'long'.
   * @returns {string} Month in text format.
   *
   * @memberOf AppDatepicker
   */
  static parseDateToMonth(locale, date, month = 'short') {
    if (AppDatepicker.hasNativeIntl) {
      return new window.Intl.DateTimeFormat(locale, {
        month,
      }).format(date);
    }

    const getMonthFromDate = date.getMonth();

    if (month === 'numeric') {
      return date.getMonth() + 1;
    } else if (month === '2-digit') {
      return `0${date.getMonth() + 1}`.slice(-2);
    }

    const sliceUntil = month === 'narrow' ? 1 : month === 'short' ? 3 : 9;

    return AppDatepicker
      .defaultMonths[getMonthFromDate]
      .slice(0, sliceUntil);
  }

  /**
   * Parse date into weekday in text format.
   *
   * @static
   * @param {string} locale - Locale to format date.
   * @param {Date} date - Date object.
   * @param {string} [weekday='short'] - Representation of the weekday.
   *  Defaults to 'short'. Possible values are 'narrow', 'short', and 'long'.
   * @returns {string} Weekday in text format.
   *
   * @memberOf AppDatepicker
   */
  static parseDateToWeekday(locale, date, weekday = 'short') {
    if (AppDatepicker.hasNativeIntl) {
      return new window.Intl.DateTimeFormat(locale, {
        weekday,
      }).format(date);
    }

    const getDayFromDate = date.getDay();
    const sliceUntil = weekday === 'narrow'
      ? 1
      : weekday === 'short' ? 3 : 9;


    return AppDatepicker
      .defaultWeekdays[getDayFromDate]
      .slice(0, sliceUntil);
  }

  /**
   *  Parse date into day in text format.
   *
   * @static
   * @param {string} locale - Locale to format date.
   * @param {Date} date - Date object.
   * @param {string} [day='numeric'] - Representation of the day.
   *  Defaults to 'numeric'. Possible values are 'numeric', '2-digit'.
   * @returns {string} Day in text format.
   *
   * @memberof AppDatepicker
   */
  static parseDateToDay(locale, date, day = 'numeric') {
    if (AppDatepicker.hasNativeIntl) {
      return new window.Intl.DateTimeFormat(locale, {
        day,
      }).format(date);
    }

    return day === '2-digit'
      ? `0${date.getDate()}`.slice(-2)
      : date.getDate();
  }

  /**
   * Parse input date into Date object.
   *
   * @param {Date} inputDate - Date object as input.
   * @returns {Date} Valid Date object.
   *
   * @memberOf AppDatepicker
   */
  parseInputDate(inputDate) {
    if (typeof inputDate === 'undefined' || inputDate.toJSON() === null) {
      return null;
    }

    // NOTE: Defaults to UTC datetime.
    const fy = inputDate.getFullYear();
    const m = inputDate.getMonth();
    const d = inputDate.getDate();
    const nd = new Date(Date.UTC(fy, m, d));

    return nd;
  }

  /**
   * Default weekdays in en-US.
   *
   * @readonly
   * @static
   *
   * @memberOf AppDatepicker
   */
  static get defaultWeekdays() {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
  }

  /**
   * Default months in en-US.
   *
   * @readonly
   * @static
   *
   * @memberOf AppDatepicker
   */
  static get defaultMonths() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }

}

window.customElements.define(AppDatepicker.is, AppDatepicker);

// TODO: toUTCString or toJSON will return date string with UTC offset.
