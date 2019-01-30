import { AppDatepicker, START_VIEW } from '../app-datepicker.js';
import { WEEK_NUMBER_TYPE } from '../calendar.js';

import '../app-datepicker.js';
import {
  getResolvedDate,
  stripLTRMark,
  toFormattedDateString,
} from '../datepicker-helpers.js';
import {
  getComputedStylePropertyValue,
  getShadowInnerHTML,
  shadowQuery,
  shadowQueryAll,
} from './test-helpers';

const {
  isString,
  isTrue,
  strictEqual,
  isNotNull,
  isAtLeast,
  isAtMost,
} = chai.assert;
/**
 * NOTE: Set a default locale instead of reading default locale locally from the browser for
 * testings due to the fact that SauceLabs might run certain browsers that returns different locale.
 * That breaks tests obviously and this is unpredictable unfortunately to see tests broken because
 * of SauceLabs's configurations.
 */
const defaultLocale = 'en-US';
/**
 * NOTE: This is not a random/ magic date selected for the testing. It's been selected for a reason
 * which has explained in detail at https://github.com/motss/app-datepicker/issues/128.
 */
const date13 = '2020-01-13';
const date15 = '2020-01-15';

describe('app-datepicker', () => {
  describe('initial render (calendar view)', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`renders with 'en-US' locale (calendar)`, () => {
      const locale = el.locale;

      strictEqual(locale, 'en-US', `Locale not matched`);
    });

    it('renders initial content (calendar)', () => {
      const elHTML = getShadowInnerHTML(el);
      const calendarView = shadowQuery(el, '.datepicker-body__calendar-view');
      const allCalendarTables = shadowQueryAll(el, '.calendar-table');

      isString(elHTML, 'HTML content is not string');
      isNotNull(calendarView, 'Calendar view not found');
      isAtLeast(allCalendarTables.length, 1, 'Calender tables not found');
      isAtMost(allCalendarTables.length, 3, 'Calender tables not found');
    });

    it(`renders today's formatted date`, () => {
      const btnSelectorYearEl = shadowQuery(el, '.btn__selector-year');
      const btnSelectorCalendarEl = shadowQuery(el, '.btn__selector-calendar');

      const selectedFullYear = getShadowInnerHTML(btnSelectorYearEl);
      const selectedFormattedDate = getShadowInnerHTML(btnSelectorCalendarEl);

      const now = getResolvedDate();
      const fy = now.getUTCFullYear().toString();
      const formattedDate = stripLTRMark(Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now));

      strictEqual(
        el.value,
        toFormattedDateString(now),
        `Today's formatted date not matched`);
      strictEqual(selectedFullYear, fy, 'Selected full year not matched');
      strictEqual(selectedFormattedDate, formattedDate, 'Selected formatted date not matched');
    });

    it(`selects, highlights, and focuses today's date`, () => {
      const dayTodayEl = shadowQuery(el, '.day--today');
      const dayFocusedEL = shadowQuery(el, '.day--focused');
      const highlightedCalendarDayEl =
        shadowQuery(el, '.day--today.day--focused > .calendar-day');

      const now = getResolvedDate();
      const formattedDate = stripLTRMark(Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now));
      const formattedDay = stripLTRMark(Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now));

      isTrue(dayTodayEl.isEqualNode(dayFocusedEL), `today's date != focused date`);
      strictEqual(el.value, toFormattedDateString(now));
      strictEqual(
        dayTodayEl.getAttribute('aria-label'),
        formattedDate,
        `Formatted date not matched`
      );
      strictEqual(
        getShadowInnerHTML(highlightedCalendarDayEl),
        stripLTRMark(formattedDay),
        'Highlighted day not matched'
      );
    });
  });

  describe('initial render (year list view)', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      el.startView = START_VIEW.YEAR_LIST;

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`renders with 'en-US' locale (year list)`, async () => {
      const locale = el.locale;

      strictEqual(locale, 'en-US', `Locale not matched`);
    });

    it(`renders initial content (year list)`, async () => {
      const elHTML = getShadowInnerHTML(el);
      const yearListView = shadowQuery(el, '.datepicker-body__year-list-view');
      const allYearListViewItems = shadowQueryAll(el, '.year-list-view__list-item');

      isString(elHTML, 'HTML content is not string');
      isNotNull(yearListView, 'Year list view not found');
      isAtLeast(allYearListViewItems.length, 1, 'year list items not found');
    });

    it(`selects, highlights this year`, async () => {
      const yearSelectedEl = shadowQuery(el, '.year-list-view__list-item.year--selected');
      const yearSelectedDivEl = shadowQuery(el, '.year-list-view__list-item.year--selected > div');

      const now = getResolvedDate();
      const fy = now.getFullYear();
      const formattedYear = stripLTRMark(Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        timeZone: 'UTC',
      }).format(now));

      isNotNull(yearSelectedEl, `Selected year not found`);
      isNotNull(yearSelectedDivEl, `Selected year's 'div' not found`);
      strictEqual(
        (yearSelectedEl as any).year,
        fy,
        `'year' property not matched`
      );
      strictEqual(
        getShadowInnerHTML(yearSelectedDivEl),
        formattedYear,
        'Formatted year not matched'
      );
    });

  });

  describe('updates via properties', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`renders with correct 'min'`, async () => {
      const minVal = date13;
      const valueVal = date15;

      el.min = minVal;
      el.value = valueVal;
      await el.updateComplete;

      const firstSelectableDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="Jan 13, 2020"]');
      const allDisabledDates =
        shadowQueryAll(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      const lastDayBeforeMinDate = allDisabledDates[allDisabledDates.length - 1];

      isNotNull(firstSelectableDate, 'First selectable date not found');
      isNotNull(lastDayBeforeMinDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(
        !firstSelectableDate.classList.contains('day--disabled'),
        'First selectable is disabled day');
      strictEqual(
        lastDayBeforeMinDate.getAttribute('aria-label'),
        'Jan 12, 2020',
        `Last day before 'min' not matched`);
      strictEqual(
        focusedDate.getAttribute('aria-label'),
        'Jan 15, 2020',
        'Focused date not matched');

      strictEqual(el.min, minVal, `'min' property not matched`);
      strictEqual(el.value, valueVal, `'value' property not matched`);

      strictEqual(el.getAttribute('min'), minVal, `'min' attribute not matched`);
      strictEqual(el.getAttribute('value'), valueVal, `'value' attribute not matched`);
    });

    it(`renders with correct 'max'`, async () => {
      const maxVal = date15;
      const valueVal = date13;

      el.max = maxVal;
      el.value = valueVal;
      await el.updateComplete;

      const lastSelectableDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="Jan 15, 2020"]');
      const firstDayAfterMaxDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');

      isNotNull(lastSelectableDate, 'Last selectable date not found');
      isNotNull(firstDayAfterMaxDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(
        !lastSelectableDate.classList.contains('day--disabled'),
        'Last selectable is disabled day');
      strictEqual(
        firstDayAfterMaxDate.getAttribute('aria-label'),
        'Jan 16, 2020',
        `First day after 'max' not matched`);
      strictEqual(
        focusedDate.getAttribute('aria-label'),
        'Jan 13, 2020',
        'Focused date not matched');

      strictEqual(el.max, maxVal, `'max' property not matched`);
      strictEqual(el.value, valueVal, `'value' property not matched`);

      strictEqual(el.getAttribute('max'), maxVal, `'max' attribute not matched`);
      strictEqual(el.getAttribute('value'), valueVal, `'value' attribute not matched`);
    });

    it(`renders with correct 'value'`, async () => {
      const todayDate = getResolvedDate();

      strictEqual(
        el.value,
        toFormattedDateString(todayDate),
        `'value' does not match with today's date`);

      const val = date15;

      /** NOTE: To ensure 'min' is lesser than 'val' */
      el.min = date13;
      el.value = val;
      await el.updateComplete;

      strictEqual(
        el.value,
        val,
        `'val' does not match with 'val'`);
    });

    it(`renders with correct 'startView'`, async () => {
      /**
       * NOTE: Not testing initial `startView="yearList"`, assuming that works if this test passes.
       */
      strictEqual(el.startView, START_VIEW.CALENDAR, `Incorrect initial 'startView'`);

      el.startView = START_VIEW.YEAR_LIST;
      await el.updateComplete;

      const yearListView = shadowQuery(el, '.datepicker-body__year-list-view');

      strictEqual(el.startView, START_VIEW.YEAR_LIST, `Incorrect 'startView' after updated`);
      isNotNull(yearListView, `Year list view not found`);
    });

    it(`renders with correct 'firstDayOfWeek'`, async () => {
      strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);

      /** NOTE: Ensure dates are not disabled during testings */
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      const expectedFirstDayInMonthIdx = [
        4,
        3,
        2,
        1,
        0,
        6,
        5,
        4,
        3,
        2,
      ];

      for (let i = -1; i < 9; i += 1) {
        el.firstDayOfWeek = i;
        await el.updateComplete;

        const fullCalendarDays =
          shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day');
        const firstDayInMonthIdx =
          fullCalendarDays.findIndex(n => !n.classList.contains('day--empty'));

        strictEqual(el.firstDayOfWeek, i, `'firstDayOfWeek' (${i}) not matched after updated`);
        strictEqual(
          el.getAttribute('firstdayofweek'),
          `${i}`,
          `'firstdayofweek' attribute (${i}) not matched after updated`);
        strictEqual(
          firstDayInMonthIdx,
          expectedFirstDayInMonthIdx[1 + i],
          `Incorrect week index after 'firstDayOfWeek' updated`);
      }
    });

    it(`renders with 'showWeekNumber'`, async () => {
      isTrue(!el.showWeekNumber, `'showWeekNumber' is true`);
      isTrue(!el.hasAttribute('showweeknumbe'), `'showweeknumber' attribute is set`);

      el.showWeekNumber = true;
      await el.updateComplete;

      const weekdays = shadowQueryAll(el, 'tr.calendar-weekdays > th');
      const weekNumberLabel = weekdays && weekdays[0] && getShadowInnerHTML(weekdays[0]);

      strictEqual(weekNumberLabel, 'Wk', `Week number label not found`);
      isTrue(el.showWeekNumber, `'showWeekNumber' is false`);
      isTrue(el.hasAttribute('showweeknumber'), `'showweeknumber' attribute is not set`);
    });

    it(`renders with correct 'weekNumberType'`, async () => {
      el.min = date13;
      el.value = date15;
      el.showWeekNumber = true;
      await el.updateComplete;

      strictEqual(
        el.weekNumberType,
        WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
        `'weekNumberType' not matched`);

      const allWeekNumberTypes = [
        WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
        WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR,
        WEEK_NUMBER_TYPE.FIRST_FULL_WEEK,
      ];
      const expectedWeekdayLabels = [1, 1, 52];

      for (let i = 0; i < 3; i += 1) {
        const weekNumberType = allWeekNumberTypes[i];

        el.weekNumberType = weekNumberType;
        await el.updateComplete;

        const firstWeekdayLabel =
          getShadowInnerHTML(shadowQuery(el, '.calendar-container:nth-of-type(2) .weekday-label'));

        strictEqual(
          el.weekNumberType,
          weekNumberType,
          `'weekNumberType' not matched ('${weekNumberType}')`);
        strictEqual(
          firstWeekdayLabel,
          `${expectedWeekdayLabels[i]}`,
          `First weekday label not matched after updated ('${weekNumberType}')`);
      }
    });

    it(`renders with correct 'landscape'`, async () => {
      strictEqual(el.landscape, false, `'landscape' not matched`);
      strictEqual(
        getComputedStylePropertyValue(el, 'display'),
        'block',
        `Element has no 'display: block'`);

      el.landscape = true;
      await el.updateComplete;

      isTrue(el.hasAttribute('landscape'), `Element has no 'landscape' attribute`);
      strictEqual(
        getComputedStylePropertyValue(el, 'display'),
        'flex',
        `Element has no 'display: flex`);
    });

    it(`renders with different 'locale'`, async () => {
      const getBtnSelectorCalendarInnerHTML =
        () => getShadowInnerHTML(shadowQuery(el, '.btn__selector-calendar'));
      const getCalendarWeekdaysInnerHTML =
        () => shadowQueryAll(el, '.calendar-container:nth-of-type(2) .calendar-weekdays > th')
                .map(n => getShadowInnerHTML(n)).join(', ');

      el.min = date13;
      el.value = date15;
      el.showWeekNumber = false;
      el.firstDayOfWeek = 0;
      await el.updateComplete;

      strictEqual(el.locale, defaultLocale, `'locale' not matched`);
      strictEqual(
        getBtnSelectorCalendarInnerHTML(),
        'Wed, Jan 15',
        `Formatted date in '${defaultLocale}' not matched`);
      isTrue(
        [
          /** Safari 9 with Intl.js polyfill (andyearnshaw/Intl.js#326) */
          'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
          'Su, Mo, Tu, We, Th, Fr, Sa', /** IE11 */
          'S, M, T, W, T, F, S', /** Other browsers */
        ].some(n => n === getCalendarWeekdaysInnerHTML()),
        `Formatted weekdays in '${defaultLocale}' not matched`);

      const jaJpLocale = 'ja-JP';
      el.locale = jaJpLocale;
      await el.updateComplete;

      strictEqual(el.locale, jaJpLocale, `'locale' not matched with '${jaJpLocale}'`);
      /**
       * NOTE: In IE11, there is a whitespace in between. This checks for 2 different kinds of
       * formatting on different browsers.
       */
      isTrue(
        [
          '水, 1月15日', /** IE11 on Win7 */
          '1月15日 (水)', /** IE11 on Win10 */
          '1月15日(水)', /** Other browsers */
        ].some(n => n === getBtnSelectorCalendarInnerHTML()),
        `Formatted date in '${jaJpLocale}' not matched`);
      strictEqual(
        getCalendarWeekdaysInnerHTML(),
        '日, 月, 火, 水, 木, 金, 土',
        `Formatted weekdays in '${jaJpLocale}' not matched`);
    });

  });

  // describe('updates via attributes', () => {});
  // describe('keyboard support', () => {});

});
