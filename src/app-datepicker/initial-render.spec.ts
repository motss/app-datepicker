import { AppDatepicker, START_VIEW } from '../../app-datepicker.js';

import '../../app-datepicker.js';
import {
  getResolvedDate,
  toFormattedDateString,
} from '../../datepicker-helpers.js';
import {
  dateFormatter,
  dayFormatter,
  defaultLocale,
  fullDateFormatter,
  yearFormatter,
} from '../test-config.js';
import {
  getShadowInnerHTML,
  shadowQuery,
  shadowQueryAll,
} from '../test-helpers';
import {
  getYearListViewListItemYearSelectedEl,
} from './helpers.js';

const {
  isString,
  isTrue,
  strictEqual,
  isNotNull,
  isAtLeast,
  isAtMost,
} = chai.assert;

describe('app-datepicker', () => {
  describe('initial render', () => {
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
        const btnSelectorYearEl = shadowQuery(el, '.btn__year-selector');
        const btnSelectorCalendarEl = shadowQuery(el, '.btn__calendar-selector');

        const selectedFullYear = getShadowInnerHTML(btnSelectorYearEl);
        const selectedFormattedDate = getShadowInnerHTML(btnSelectorCalendarEl);

        const now = getResolvedDate();
        const fy = now.getUTCFullYear().toString();
        const formattedDate = dateFormatter(now);

        strictEqual(
          el.value,
          toFormattedDateString(now),
          `Today's formatted date not matched`);
        strictEqual(selectedFullYear, fy, 'Selected full year not matched');
        strictEqual(selectedFormattedDate, formattedDate, 'Selected formatted date not matched');
      });

      it(`selects, highlights, and focuses today's date`, async () => {
        /**
         * NOTE: Resetting disabled days to eliminate the factor that will affect this testing.
         */
        el.disabledDays = '';
        await el.updateComplete;

        const dayTodayEl = shadowQuery(el, '.day--today');
        const dayFocusedEl = shadowQuery(el, '.day--focused');
        const highlightedCalendarDayEl =
          shadowQuery(el, '.day--today.day--focused > .calendar-day');

        const now = getResolvedDate();
        const formattedDate = fullDateFormatter(now);
        const formattedDay = dayFormatter(now);

        isTrue(dayTodayEl.isEqualNode(dayFocusedEl), `today's date != focused date`);
        strictEqual(el.value, toFormattedDateString(now));
        strictEqual(
          dayTodayEl.getAttribute('aria-label'),
          formattedDate,
          `Formatted date not matched`
        );
        strictEqual(
          getShadowInnerHTML(highlightedCalendarDayEl),
          formattedDay,
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
        isAtLeast(allYearListViewItems.length, 1, 'No year list items found');

        const formattedYear = yearFormatter(getResolvedDate());

        const firstSelectableYearEl = allYearListViewItems[0];
        const lastSelectableYearEl = allYearListViewItems[allYearListViewItems.length - 1];

        isNotNull(firstSelectableYearEl, `No first selectable year found`);
        isNotNull(lastSelectableYearEl, `No last selectable year found`);

        const firstSelectableYearLabel =
          getShadowInnerHTML(firstSelectableYearEl.querySelector('div')!);
        const lastSelectableYearLabel =
          getShadowInnerHTML(lastSelectableYearEl.querySelector('div')!);

        strictEqual(
          firstSelectableYearLabel,
          formattedYear,
          `First selectable not matched (${formattedYear})`);
        strictEqual(
          lastSelectableYearLabel,
          '2100',
          `Last selectable not matched (${lastSelectableYearLabel})`);
      });

      it(`selects, highlights this year`, async () => {
        const yearSelectedEl = shadowQuery(el, '.year-list-view__list-item.year--selected');
        const yearSelectedDivEl = getYearListViewListItemYearSelectedEl(el);

        const now = getResolvedDate();
        const fy = now.getFullYear();
        const formattedYear = yearFormatter(now);

        isNotNull(yearSelectedEl, `Selected year not found`);
        isNotNull(yearSelectedDivEl, `Selected year's 'div' not found`);
        strictEqual((yearSelectedEl as any).year, fy, `'year' property not matched`);

        const selectedYearLabel = getShadowInnerHTML(yearSelectedDivEl);
        strictEqual(
          selectedYearLabel,
          formattedYear,
          `Selected year label not matched (${selectedYearLabel})`);
      });

    });
  });

});
