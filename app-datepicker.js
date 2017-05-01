// @ts-check

/**
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

    const now = this.parseInputDate(this.inputDate) || new Date();

    this._activeDateObject = {
      fullYear: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
      day: now.getDay(),
      shortMonth: this.parseDateToShortMonth(now),
      shortWeekday: this.parseDayToWeekday(now),
    };

    /* Update selectedDate based on inputDate or fallback Date object */
    this._setSelectedDate(now.toJSON());

    console.log(this._activeDateObject);
    console.log(this.inputDate, this.selectedDate);
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
   * Check if native Intl is supported.
   *
   * @returns {boolean} True if native Intl is supported.
   *
   * @memberOf AppDatepicker
   */
  hasNativeIntl() {
    return window.Intl && window.Intl.DateTimeFormat;
  }

  /**
   * Parse date into short month in text format.
   *
   * @param {Date} date - Date object.
   * @returns {string} Short month in text format.
   *
   * @memberOf AppDatepicker
   */
  parseDateToShortMonth(date) {
    if (this.hasNativeIntl) {
      // const cachedLocale = this.properties.locale.value();
      const cachedLocale = this.locale;

      return new window.Intl.DateTimeFormat(cachedLocale, {
        month: 'short',
      }).format(date);
    } else {
      const getMonthFromDate = date.getMonth();

      return AppDatepicker
        .defaultMonths[getMonthFromDate]
        .slice(0, 3);
    }
  }

  /**
   * Parse date into weekday in text format.
   *
   * @param {Date} date - Date object.
   * @returns {string} weekday in text format.
   *
   * @memberOf AppDatepicker
   */
  parseDayToWeekday(date) {
    if (this.hasNativeIntl) {
      // const cachedLocale = this.properties.locale.value();
      const cachedLocale = this.locale;

      return new window.Intl.DateTimeFormat(cachedLocale, {
        weekday: 'short',
      }).format(date);
    } else {
      const getDayFromDate = date.getDay();

      return AppDatepicker
        .defaultWeekdays[getDayFromDate]
        .slice(0, 3);
    }
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
    if (typeof inputDate === 'undefined'
      || inputDate.toString() === 'Invalid Date') {
      return null;
    }

    return inputDate;
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
