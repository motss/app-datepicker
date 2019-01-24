import { AppDatepicker } from '../app-datepicker.js';

import '../app-datepicker.js';
import {
  getResolvedDate,
  stripLTRMark,
  toFormattedDateString,
} from '../datepicker-helpers.js';
import {
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

    it('reads locale', () => {
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
      const formattedDate = Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now);

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
      const formattedDate = Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now);
      const formattedDay = Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        /** NOTE: Internally, the datepicker defaults to datetime to UTC */
        timeZone: 'UTC',
      }).format(now);

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
      el.startView = 'yearList';

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`reads locale`, async () => {
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
      const formattedYear = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        timeZone: 'UTC',
      }).format(now);

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

  // describe('keyboard support', () => {});
  // describe('updates via attributes', () => {});
  // describe('updates via properties', () => {});

});
