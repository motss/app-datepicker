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

      // TODO: To implement format.
      format: {
        type: String,
        value: () => 'yyyy-mm-dd',
      },

      inputDate: {
        type: Date,
      },

      locale: {
        type: String,
        value: () => AppDatepicker.localeFromNativeIntl,
      },

      maxDate: {
        type: Date,
        value: () => new Date('9999-12-31').toJSON(),
      },

      minDate: {
        type: Date,
        value: () => new Date('1970-01-01').toJSON(),
      },

      // TODO: To implement noAnimation flag.
      noAnimation: {
        type: Boolean,
      },

      selectedDate: {
        type: Date,
        readOnly: true,
        reflectToAttribute: true,
      },

      // TODO: To implement selectedView flag.
      selectedView: {
        type: String,
      },

      activeDateObject: {
        type: Object,
        readOnly: true,
      },

      isCustomElementConnected: {
        type: Boolean,
        readOnly: true,
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
      'setupDatepicker(isCustomElementConnected, locale, firstDayOfWeek, minDate, maxDate, disableDays.*, disableDates.*)',
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

    /* NOTE: To ensure and defer rendering to when or after connectedCallback. */
    this._setIsCustomElementConnected(true);

    console.info('connected.');
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
   * Check if the value of firstDayOfWeek is valid.
   *
   * @static
   * @param {number} firstDayOfWeek - First day of week.
   * @returns {boolean} True if firstDayOfWeek is valid.
   *
   * @memberof AppDatepicker
   */
  static withinFirstDayOfWeekRange(firstDayOfWeek) {
    return firstDayOfWeek > 0 && firstDayOfWeek < 7;
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
   * Check if the input date is valid.
   *
   * @static
   * @param {any} inputDate
   * @returns
   *
   * @memberof AppDatepicker
   */
  static isValidDate(inputDate) {
    if (typeof inputDate === 'string') {
      return (new Date(inputDate)).toJSON() !== null;
    } else if (inputDate instanceof Date) {
      return inputDate.toJSON() !== null;
    }

    return false;
  }

  /**
   * Find the row number of a date.
   *
   * @static
   * @param {number} dateIndex - Date number.
   * @returns {number} Row number of a date in a calendar.
   *
   * @memberof AppDatepicker
   */
  static dateToCalendarRow(dateIndex) {
    return Math.floor(dateIndex / 7);
  }

  /**
   * Find the column number of a date.
   *
   * @static
   * @param {number} dateIndex - Date number.
   * @returns {number} Column number of a date in a calendar.
   *
   * @memberof AppDatepicker
   */
  static dateToCalendarCol(dateIndex) {
    return dateIndex - 7 * AppDatepicker.dateToCalendarRow(dateIndex);
  }

  /**
   * True if the input date is before the minimum allowed date.
   *
   * @static
   * @param {string|Date} inputDate - Input date.
   * @param {string|Date} [minDate=new Date('1970/01/01')] - Minimum allowed date.
   *  Defaults to '1970/01/01'.
   * @returns {boolean} True if the input date is before the minimum allowed date.
   *
   * @memberof AppDatepicker
   */
  static isBeforeThanMinDate(inputDate, minDate = new Date('1970-01-01')) {
    if (!AppDatepicker.isValidDate(minDate)) {
      console.warn(`${minDate} is not a valid Date object`);
      return false;
    }

    if (!AppDatepicker.isValidDate(inputDate)) {
      console.warn(`${inputDate} is not a valid Date object`);
      return false;
    }

    const newDate = typeof minDate === 'string' ? new Date(minDate) : minDate;
    const newInputDate = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    const ndFullYear = newDate.getFullYear();
    const ndMonth = newDate.getMonth();
    const ndDate = newDate.getDate();
    const nidFullYear = newInputDate.getFullYear();
    const nidMonth = newInputDate.getMonth();
    const nidDate = newInputDate.getDate();
    const ndTime = +new Date(ndFullYear, ndMonth, ndDate);
    const nidTime = +new Date(nidFullYear, nidMonth, nidDate);

    return nidTime < ndTime;
  }

  /**
   * True if the input date is afer the maximum allowed date.
   *
   * @static
   * @param {string|Date} inputDate - Input date.
   * @param {string|Date} [maxDate=new Date('9999/12/31')] - Maximum allowed date.
   * @returns {boolean} True if the input date is after the maximum allowed date.
   *
   * @memberof AppDatepicker
   */
  static isAfterThanMaxDate(inputDate, maxDate = new Date('9999-12-31')) {
    if (!AppDatepicker.isValidDate(maxDate)) {
      console.warn(`${maxDate} is not a valid Date object`);
      return false;
    }

    if (!AppDatepicker.isValidDate(inputDate)) {
      console.warn(`${inputDate} is not a valid Date object`);
      return false;
    }

    const newDate = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
    const newInputDate = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    const ndFullYear = newDate.getFullYear();
    const ndMonth = newDate.getMonth();
    const ndDate = newDate.getDate();
    const nidFullYear = newInputDate.getFullYear();
    const nidMonth = newInputDate.getMonth();
    const nidDate = newInputDate.getDate();
    const ndTime = +new Date(ndFullYear, ndMonth, ndDate);
    const nidTime = +new Date(nidFullYear, nidMonth, nidDate);

    return nidTime > ndTime;
  }

  /**
   * Check if the input date is today's date.
   *
   * @static
   * @param {Date} date - Date object.
   * @returns {boolean} True if the input date is today's date.
   *
   * @memberof AppDatepicker
   */
  static isTheDateToday(inputDate) {
    if (!AppDatepicker.isValidDate(inputDate)) {
      return false;
    }

    const now = new Date();
    const tdFullYear = now.getFullYear();
    const tdMonth = now.getMonth();
    const tdDate = now.getDate();
    const fy = inputDate.getFullYear();
    const m = inputDate.getMonth();
    const d = inputDate.getDate();
    const isFullYearEqual = tdFullYear === fy;
    const isMonthEqual = tdMonth === m;
    const isDateEqual = tdDate === d;

    return isFullYearEqual && isMonthEqual && isDateEqual;
  }

  /**
   * Parse input date into UTC Date object instead of local time.
   *
   * @static
   * @param {Date} inputDate - Date object as input.
   * @returns {Date} Valid Date object in UTC instead of local time.
   *
   * @memberOf AppDatepicker
   */
  static parseInputDateIntoUTC(inputDate) {
    if (!AppDatepicker.isValidDate(inputDate)) {
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
   * Filter and process disable dates into valid ones.
   *
   * @static
   * @param {Object[]} disableDates - A list of disable dates with its override style.
   * @returns {Object[]} A list of valid disable dates with its override style.
   *
   * @memberof AppDatepicker
   */
  static parseDisableDates(disableDates) {
    const isValidDisableDates = disableDates
      && Array.isArray(disableDates)
      && disableDates.length;

    if (!isValidDisableDates) {
      return [];
    }

    return disableDates.reduce((prev, cur) => {
      if (!AppDatepicker.isValidDate(cur.date)) {
        return prev;
      }

      return prev.concat({
        time: new Date(cur.date).getTime(),
        overrideStyle: cur.style,
      });
    }, []);
  }

  /**
   * Setup weekdays in text format.
   *
   * @static
   * @param {string} locale - Locale to format weekdays.
   * @param {number} firstDayOfWeek - First day of the week.
   * @returns {string[]} Array of formatted weekdays.
   *
   * @memberof AppDatepicker
   */
  static setupWeekdays(locale, firstDayOfWeek) {
    const hasNativeIntl = AppDatepicker.hasNativeIntl;
    const fdow = AppDatepicker.withinFirstDayOfWeekRange(firstDayOfWeek) ? firstDayOfWeek : 0;
    const dows = hasNativeIntl
      ? AppDatepicker.defaultWeekdaysDates
      : AppDatepicker.defaultWeekdays;
    const sliced = dows.slice(fdow);
    const rest = dows.slice(0, fdow);
    const shifted = Array.prototype.concat.apply(sliced, rest);

    if (hasNativeIntl) {
      const formatter = new window.Intl.DateTimeFormat(locale, {
        weekday: 'narrow',
      }).format;
      const labelFormatter = new window.Intl.DateTimeFormat(locale, {
        weekday: 'long',
      }).format;

      return shifted.map((date) => ({
        weekdayLabel: labelFormatter(date),
        weekday: formatter(date),
      }));
    }

    return shifted.map((wd) => {
      return {
        weekdayLabel: wd,
        weekday: wd.slice(0, 1),
      };
    });
  }

  /**
   * Setup days of a month.
   *
   * @static
   * @param {string} locale - Locale to format days of month.
   * @param {number} fullYear - Full year of the active date object.
   * @param {number} month - Month of the active date object.
   * @param {number} firstDayOfWeek - First day of the week.
   * @param {Date} minDate - Minimum allowed date.
   * @param {Date} maxDate - Maximum allowed date.
   * @param {number[]} disableDays - A list of the index of the weekdays need to be disabled.
   * @param {Object[]} disableDates - A list of dates need to be disabled.
   *  Each contains the date string and override style to be applied to a disabled date.
   * @returns {string[]} Array of days of a month.
   *
   * @memberof AppDatepicker
   */
  static setupDaysOfMonth(isCustomElementConnected, locale, fullYear, month, firstDayOfWeek, minDate, maxDate, disableDays, disableDates) {
    /* NOTE: Do nothing when the element has yet to be connected to the DOM. */
    if (!isCustomElementConnected) {
      console.info('Custom element yet to be connected');

      return;
    }

    let startDay = new Date(fullYear, month, 1).getDay();
    const totalDays = AppDatepicker.getTotalDaysOfMonth(fullYear, month);
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

    // NOTE: Shift days with firstDayOfWeek.
    if (AppDatepicker.withinFirstDayOfWeekRange(firstDayOfWeek)) {
      startDay -= firstDayOfWeek;
      startDay = startDay < 0 ? 7 + startDay : startDay;
    }

    console.time('setupDaysOfMonth');
    for (let i = 0, j = 1 - startDay; i < 42; i++, j++) {
      const fullDate = new Date(Date.UTC(fullYear, month, j)); // NOTE: Always UTC date.
      const date = formatter(fullDate);
      const dateLabel = labelFormatter(fullDate);
      const shouldPushDate = i >= startDay && (i < startDay + totalDays);
      const isToday = AppDatepicker.isTheDateToday(fullDate);
      const hasDisableDay = disableDays.length > 0
        && disableDays.some(dd => dd.day === AppDatepicker.dateToCalendarCol(j));
      let hasDisableDateOverrideStyle = '';
      const hasDisableDate = disableDates.length > 0
        && disableDates.some(dd => {
          const isEqualTime = dd.time === fullDate.getTime();

          if (isEqualTime) {
            hasDisableDateOverrideStyle = dd.overrideStyle;
          }

          return isEqualTime;
        });
      let isDisableDay = AppDatepicker.isBeforeThanMinDate(fullDate, minDate)
        || AppDatepicker.isAfterThanMaxDate(fullDate, maxDate)
        || hasDisableDay
        || hasDisableDate;

      const dayOfMonth = shouldPushDate
        ? {date, dateIndex: j, dateLabel, today: isToday ? 'is-today' : '', disable: isDisableDay ? 'is-disable' : '', overrideStyle: isDisableDay ? hasDisableDateOverrideStyle : ''}
        : {};

      daysOfMonth.push(dayOfMonth);
    }
    console.timeEnd('setupDaysOfMonth');

    return daysOfMonth;
  }

  /**
   * Deeply freeze an object.
   *
   * @static
   * @param {Object} obj - An Object that needs to be frozen.
   * @returns {Object} A frozen object which its property cannot be modified.
   *
   * @memberof AppDatepicker
   */
  static deepFreeze(obj) {
    const propNames = Object.getOwnPropertyNames(obj);

    propNames.map((propName) => {
      const prop = obj[propName];

      if (prop instanceof Object && prop !== null) {
        AppDatepicker.deepFreeze(prop);
      }
    });

    return Object.freeze(obj);
  }

  /**
   *
   *
   *
   * @memberof AppDatepicker
   */
  setupDatepicker() {
    const inputDate = AppDatepicker.isValidDate(this.inputDate) ? this.inputDate : new Date();
    const now = AppDatepicker.parseInputDateIntoUTC(inputDate);
    const lang = this.locale || AppDatepicker.localeFromNativeIntl;
    const fdow = this.firstDayOfWeek || 0; // TODO: Is this needed?
    const minD = this.minDate;
    const maxD = this.maxDate;
    const dsbDays = this.disableDays
      && Array.isArray(this.disableDays)
      && this.disableDays.length
      ? this.disableDays.map(dd => ({
        day: dd,
        dayLabel: AppDatepicker.hasNativeIntl
          ? new window.Intl.DateTimeFormat(lang, {
            weekday: 'long',
          }).format(AppDatepicker.defaultWeekdaysDates[dd])
          : AppDatepicker.defaultWeekdays[dd],
      }))
      : [];
    const dsbDates = AppDatepicker.parseDisableDates(this.disableDates);

    const date = now.getDate();
    const day = now.getDay();
    const month = now.getMonth();
    const fullYear = now.getFullYear();

    this._setActiveDateObject(AppDatepicker.deepFreeze({
      locale: lang,
      firstDayOfWeek: fdow,

      date,
      day,
      month,
      fullYear,

      longMonth: AppDatepicker.parseDateToMonth(lang, now, 'long'),
      longFullYear: AppDatepicker.parseDateToFullYear(lang, now, 'numeric'),
      shortDay: AppDatepicker.parseDateToDay(lang, now),
      shortMonth: AppDatepicker.parseDateToMonth(lang, now),
      shortWeekday: AppDatepicker.parseDateToWeekday(lang, now),

      weekdays: AppDatepicker.setupWeekdays(lang, fdow),
      daysOfMonth: AppDatepicker.setupDaysOfMonth(lang, fullYear, month, fdow, minD, maxD, dsbDays, dsbDates),

      minDate: minD,
      maxDate: maxD,
      disableDays: dsbDays,
      disableDates: dsbDates,
    }));

    /* Update selectedDate based on inputDate or fallback Date object */
    this._setSelectedDate(now.toJSON());

    console.log(this.activeDateObject);
    console.log(this.inputDate.toJSON(), this.selectedDate);
  }


  /**
   * Get the locale from native Intl object.
   *
   * @readonly
   * @static
   * @returns {string} Locale from native Intl object or 'en-US' as fallback value.
   *
   * @memberof AppDatepicker
   */
  static get localeFromNativeIntl() {
    const localeFromNativeIntl = window.Intl
      && window.Intl.DateTimeFormat
      && new window.Intl.DateTimeFormat().resolvedOptions
      && new window.Intl.DateTimeFormat().resolvedOptions().locale;
    const localeFromNavigator = window.navigator.language;

    return localeFromNativeIntl || localeFromNavigator || 'en-US';
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

  /**
   * Default weekdays in Date objects.
   *
   * @readonly
   * @static
   *
   * @memberof AppDatepicker
   */
  static get defaultWeekdaysDates() {
    return [
      new Date('2017-05-07'),
      new Date('2017-05-08'),
      new Date('2017-05-09'),
      new Date('2017-05-10'),
      new Date('2017-05-11'),
      new Date('2017-05-12'),
      new Date('2017-05-13'),
    ];
  }

}

window.customElements.define(AppDatepicker.is, AppDatepicker);

// TODO: toUTCString or toJSON will return date string with UTC offset.
// TODO: new Date(null) is a valid Date object.
