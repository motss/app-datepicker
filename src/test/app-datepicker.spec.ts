type DragDirection = 'left' | 'right';

import { AppDatepicker, START_VIEW } from '../app-datepicker.js';
import { WEEK_NUMBER_TYPE } from '../calendar.js';
import { KEYCODES_MAP } from '../datepicker-helpers.js';
import { KeyboardEventOptions, OptionsDragTo } from './test-helpers';

import '../app-datepicker.js';
import {
  getResolvedDate,
  hasClass,
  toFormattedDateString,
  updateFormatters,
} from '../datepicker-helpers.js';
import {
  dragTo,
  getComputedStylePropertyValue,
  getinnerHTML,
  getShadowInnerHTML,
  shadowQuery,
  shadowQueryAll,
  triggerEvent,
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
const date17 = '2020-01-17';
const {
  dateFormatter,
  dayFormatter,
  fullDateFormatter,
  yearFormatter,
} = updateFormatters(defaultLocale);

describe('app-datepicker', () => {
  const getBtnNextMonthSelector =
    (n: AppDatepicker) => shadowQuery(n, '.btn__month-selector[aria-label="Next month"]');
  const getBtnPrevMonthSelector =
    (n: AppDatepicker) => shadowQuery(n, '.btn__month-selector[aria-label="Previous month"]');
  const getBtnYearSelectorEl =
    (n: AppDatepicker) => shadowQuery(n, '.btn__year-selector');
  const getBtnCalendarSelectorEl =
    (n: AppDatepicker) => shadowQuery(n, '.btn__calendar-selector');
  const getCalendarLabelEl =
    (n: AppDatepicker) => shadowQuery(n, '.calendar-container:nth-of-type(2) .calendar-label');
  const waitForDragAnimationFinished =
    (n: AppDatepicker) => new Promise(yay =>
      requestAnimationFrame(() => setTimeout(() => yay(n.updateComplete), 1e3)));
  const getYearListViewFullListEl =
    (n: AppDatepicker) => shadowQuery(n, '.year-list-view__full-list');
  const getYearListViewListItemYearSelectedEl =
    (n: AppDatepicker) => shadowQuery(n, '.year-list-view__list-item.year--selected > div');
  const getDatepickerBodyCalendarViewEl =
    (n: AppDatepicker) => shadowQuery(n, '.datepicker-body__calendar-view[tabindex="0"]');
  const getDatepickerBodyCalendarViewDayFocusedEl =
    (n: AppDatepicker) => shadowQuery(n, '.calendar-container:nth-of-type(2)')
      .querySelector('.full-calendar__day:not(.day--disabled).day--focused > div');

  const selectNewYearFromYearListView =
    (n: AppDatepicker, y: string) => {
      const allSelectableYearItems =
        shadowQueryAll(n, '.year-list-view__list-item:not(.year--selected)');
      const matched =
        allSelectableYearItems.find(o => y === getShadowInnerHTML(o.querySelector('div')!));

      triggerEvent(matched!, 'click');
    };
  const setupDragPoint = (direction: DragDirection, el: HTMLElement) => {
    const datepickerRect = el.getBoundingClientRect();
    const calendarRect = shadowQuery(el, '.calendar-view__full-calendar').getBoundingClientRect();

    const lFactor = 'left' === direction ? .78 : .22;
    const left = datepickerRect.left + (datepickerRect.width * lFactor);
    const top = calendarRect.top + (calendarRect.height * .22);

    return { x: left, y: top };
  };

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
      const minVal = date15;
      const valueVal = date17;

      el.min = minVal;
      el.value = valueVal;
      await el.updateComplete;

      const firstSelectableDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="Jan 15, 2020"]');
      const allDisabledDates =
        shadowQueryAll(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      const lastDayBeforeMinDate = allDisabledDates.reduce((p, n) => {
        const pDay = +(p as any).day;
        const nDay = +(n as any).day;

        /**
         * NOTE: `15` means day of `date15`.
         */
        return nDay > pDay && nDay < 15 ? n : p;
      });

      isNotNull(firstSelectableDate, 'First selectable date not found');
      isNotNull(lastDayBeforeMinDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(!hasClass(firstSelectableDate, 'day--disabled'), 'First selectable is disabled day');
      strictEqual(
        lastDayBeforeMinDate.getAttribute('aria-label'),
        'Jan 14, 2020',
        `Last day before 'min' not matched`);
      strictEqual(
        focusedDate.getAttribute('aria-label'),
        'Jan 17, 2020',
        'Focused date not matched');

      strictEqual(el.min, minVal, `'min' property not matched`);
      strictEqual(el.value, valueVal, `'value' property not matched`);
      strictEqual(el.getAttribute('min'), minVal, `'min' attribute not matched`);

      el.value = date13;
      await el.updateComplete;

      isTrue(
        !hasClass(focusedDate, 'day--focused'),
        `Focused date not matched ('value' < 'min')`);
      strictEqual(el.value, date13, `New 'value' not matched ('value' < 'min')`);

      el.min = ''; /** Any falsy value, but here only tests empty string */
      await el.updateComplete;

      const newFocusedDateWithoutMin =
        shadowQuery(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      isNotNull(newFocusedDateWithoutMin, `New focused date not found`);
      strictEqual(el.min, '', `New 'min' not matched`);
      strictEqual(el.getAttribute('min'), '', `New 'min' attribute not matched`);
      strictEqual(
        newFocusedDateWithoutMin.getAttribute('aria-label'),
        'Jan 13, 2020',
        `New focused date not matched with no 'min'`);
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
      const allDisabledDates =
        shadowQueryAll(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      const firstDayAfterMaxDate = allDisabledDates.reduceRight((p, n) => {
        const pDay = +(p as any).day;
        const nDay = +(n as any).day;

        /**
         * NOTE: `15` means day of `date15`.
         */
        return nDay < pDay && nDay > 15 ? n : p;
      });

      isNotNull(lastSelectableDate, 'Last selectable date not found');
      isNotNull(firstDayAfterMaxDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(!hasClass(lastSelectableDate, 'day--disabled'), 'Last selectable is disabled day');
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

      el.value = date17;
      await el.updateComplete;

      isTrue(!hasClass(focusedDate, 'day--focused'), `Focused date not matched ('value' > 'max')`);
      strictEqual(el.value, date17, `New 'value' not matched ('value' > 'max')`);

      el.max = ''; /** Any falsy value, but here only tests empty string */
      await el.updateComplete;

      const newFocusedDateWithoutMax =
        shadowQuery(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');

      isNotNull(newFocusedDateWithoutMax, `New focused date not found`);
      strictEqual(el.max, '', `New 'max' not matched`);
      strictEqual(
        newFocusedDateWithoutMax.getAttribute('aria-label'),
        'Jan 17, 2020',
        `New focused date not matched with no 'max'`);
    });

    it(`renders with correct 'value'`, async () => {
      const todayDate = getResolvedDate();

      strictEqual(
        el.value,
        toFormattedDateString(todayDate),
        `'value' not matched with today's date`);

      const val = date15;

      /** NOTE: To ensure 'min' is lesser than 'val' */
      el.min = date13;
      el.value = val;
      await el.updateComplete;

      strictEqual(el.value, val, `New 'value' not matched`);
    });

    it(`renders with correct 'startView'`, async () => {
      /**
       * NOTE: Not testing initial `startView="yearList"`, assuming that works if this test passes.
       */
      strictEqual(el.startView, START_VIEW.CALENDAR, `Incorrect initial 'startView'`);
      strictEqual(
        el.getAttribute('startview'),
        START_VIEW.CALENDAR,
        `Incorrect initial 'startview' attribute`);

      el.startView = START_VIEW.YEAR_LIST;
      await el.updateComplete;

      const yearListView = shadowQuery(el, '.datepicker-body__year-list-view');

      strictEqual(el.startView, START_VIEW.YEAR_LIST, `New 'startView' not matched`);
      strictEqual(
        el.getAttribute('startview'),
        START_VIEW.YEAR_LIST,
        `New 'startview' attribute not matched`);
      isNotNull(yearListView, `Year list view not found`);
    });

    it(`renders with correct 'firstDayOfWeek'`, async () => {
      strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);
      strictEqual(
        el.getAttribute('firstdayofweek'),
        '0',
        `'firstdayofweek' attribute not matched`);

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
        const firstDayInMonthIdx = fullCalendarDays.findIndex(n => !hasClass(n, 'day--empty'));

        strictEqual(el.firstDayOfWeek, i, `New 'firstDayOfWeek' (${i}) not matched`);
        strictEqual(
          el.getAttribute('firstdayofweek'),
          `${i}`,
          `New 'firstdayofweek' attribute (${i}) not matched`);
        strictEqual(
          firstDayInMonthIdx,
          expectedFirstDayInMonthIdx[1 + i],
          `Week index not matched with new 'firstDayOfWeek' (${i})`);
      }
    });

    it(`renders with 'showWeekNumber'`, async () => {
      isTrue(!el.showWeekNumber, `'showWeekNumber' is true`);
      isTrue(!el.hasAttribute('showweeknumber'), `'showweeknumber' attribute is set`);

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
      strictEqual(
        el.getAttribute('weeknumbertype'),
        WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
        `'weeknumbertype' attribute not matched`);

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
          el.getAttribute('weeknumbertype'),
          weekNumberType,
          `'weeknumbertype' attribute not matched ('${weekNumberType}')`);
        strictEqual(
          firstWeekdayLabel,
          `${expectedWeekdayLabels[i]}`,
          `First weekday label not matched ('${weekNumberType}')`);
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

      isTrue(el.landscape, `'landscape' not matched`);
      isTrue(el.hasAttribute('landscape'), `No 'landscape' attribute set`);
      strictEqual(
        getComputedStylePropertyValue(el, 'display'),
        'flex',
        `Element has no 'display: flex`);
    });

    it(`renders with different 'locale'`, async () => {
      const getBtnSelectorCalendarInnerHTML =
        () => getShadowInnerHTML(shadowQuery(el, '.btn__calendar-selector'));
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

      strictEqual(el.locale, jaJpLocale, `'locale' not matched ('${jaJpLocale}')`);
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
        `Formatted date in '${jaJpLocale}' not matched ('${jaJpLocale}')`);
      strictEqual(
        getCalendarWeekdaysInnerHTML(),
        '日, 月, 火, 水, 木, 金, 土',
        `Formatted weekdays in '${jaJpLocale}' not matched ('${jaJpLocale}')`);
    });

    it(`renders with different 'disabledDays'`, async () => {
      const getAllDisabledDays = () =>
        shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled')
          .map(n => n.getAttribute('aria-label')!);

      el.value = date13;
      await el.updateComplete;

      const allDisabledDays = getAllDisabledDays();

      isTrue(
        [
          ['Jan 4, 2020', 'Jan 04, 2020'],
          ['Jan 5, 2020', 'Jan 05, 2020'],
          ['Jan 11, 2020'],
          ['Jan 12, 2020'],
          ['Jan 18, 2020'],
          ['Jan 19, 2020'],
          ['Jan 25, 2020'],
          ['Jan 26, 2020'],
        ].every((n, i) => n.some(o => o === allDisabledDays[i])),
        `All disabled days not matched`);

      /**
       * NOTE: Simple testing here instead of a full suite tests with a comprehensive combination of
       * disabled days.
       */
      el.disabledDays = '1,3,5';
      await el.updateComplete;

      const allNewDisabledDays = getAllDisabledDays();

      strictEqual(el.disabledDays, '1,3,5', `'disabledDays' not matched`);
      isTrue(
        [
          ['Jan 1, 2020', 'Jan 01, 2020'],
          ['Jan 3, 2020', 'Jan 03, 2020'],
          ['Jan 6, 2020', 'Jan 06, 2020'],
          ['Jan 8, 2020', 'Jan 08, 2020'],
          ['Jan 10, 2020'],
          ['Jan 13, 2020'],
          ['Jan 15, 2020'],
          ['Jan 17, 2020'],
          ['Jan 20, 2020'],
          ['Jan 22, 2020'],
          ['Jan 24, 2020'],
          ['Jan 27, 2020'],
          ['Jan 29, 2020'],
          ['Jan 31, 2020'],
        ].every((n, i) => n.some(o => o === allNewDisabledDays[i])),
        `All new disabled days not matched (disabledDays=1,3,5)`);

      el.disabledDays = '';
      await el.updateComplete;

      strictEqual(el.disabledDays, '', `'disabledDays' not reset`);
      isTrue(
        getAllDisabledDays().length === 0,
        `All disabled days not reset`);
    });

    it(`renders with different 'disabledDates'`, async () => {
      const getAllDisabledDays = () =>
        shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled')
          .map(n => n.getAttribute('aria-label')!);

      /**
       * NOTE: It is to ensure not other disabled days on the calendar of the datepicker.
       */
      el.value = date13;
      el.disabledDays = '';
      await el.updateComplete;

      strictEqual(el.disabledDays, '', `'disabledDays' not reset`);
      isTrue(getAllDisabledDays().length === 0, `Disabled days not reset`);

      /**
       * NOTE: Simple testing here instead of a full suite tests with a comprehensive combination of
       * disabled dates.
       */
      el.disabledDates = '2020-01-06, 2020-01-16, 2020-01-23';
      await el.updateComplete;

      const allNewDisabledDays = getAllDisabledDays();

      strictEqual(
        el.disabledDates,
        '2020-01-06, 2020-01-16, 2020-01-23',
        `New 'disabledDays' not matched`);
      isTrue(
        [
          ['Jan 6, 2020', 'Jan 06, 2020'],
          ['Jan 16, 2020'],
          ['Jan 23, 2020'],
        ].every((n, i) => n.some(o => o === allNewDisabledDays[i])),
        `New disabled dates not matched`);

      el.disabledDates = '';
      await el.updateComplete;

      strictEqual(el.disabledDates, '', `'disabledDates' not reset`);
      isTrue(getAllDisabledDays().length === 0, `All disabled dates not reset`);
    });

    it(`renders with optional 'weekLabel'`, async () => {
      el.locale = defaultLocale;
      el.showWeekNumber = true;
      await el.updateComplete;

      const weekLabelEl = shadowQuery(el, 'th[aria-label="Week"]');

      strictEqual(el.weekLabel, '', `'weekLabel' not matched`);
      strictEqual(getShadowInnerHTML(weekLabelEl), 'Wk', `Week label not matched`);

      const newWeekLabel = '周数';
      el.weekLabel = newWeekLabel;
      await el.updateComplete;

      strictEqual(el.weekLabel, newWeekLabel, `New 'weekLabel' not matched`);
      strictEqual(getShadowInnerHTML(weekLabelEl), newWeekLabel, `New week label not matched`);

      el.weekLabel = '';
      await el.updateComplete;

      strictEqual(el.weekLabel, '', `'weekLabel' not reset`);
      strictEqual(getShadowInnerHTML(weekLabelEl), 'Wk', `Week label not reset`);
    });

    it(`renders with optional 'dragRatio'`, async () => {
      strictEqual(el.dragRatio, .15, `Initial 'dragRatio' not matched`);

      el.min = date13;
      el.value = date15;
      el.dragRatio = .5;
      await el.updateComplete;

      strictEqual(el.dragRatio, .5, `'dragRatio' not matched`);

      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `First year selector text not matched`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `First calendar selector text not matched`);

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
        `First calendar label not matched (${calendarLabel})`);

      const oldStartingPoint = setupDragPoint('left', el);
      const oldDragOptions: OptionsDragTo = { ...oldStartingPoint, dx: -50 };
      await dragTo(calendarViewFullCalendarEl, oldDragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `Calendar selector text should not change`);

      const oldCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => oldCalendarLabel === n),
        `Calendar label should not update (${oldCalendarLabel})`);

      const startingPoint = setupDragPoint('left', el);
      const dragOptions: OptionsDragTo = { ...startingPoint, dx: -160 };
      await dragTo(calendarViewFullCalendarEl, dragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `Calendar selector text should not change`);

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
        `New calendar label not updated (${newCalendarLabel})`);
    });

  });

  describe('updates via attributes', () => {
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
      const minVal = date15;
      const valueVal = date17;

      el.setAttribute('min', minVal);
      el.value = valueVal;
      await el.updateComplete;

      const firstSelectableDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="Jan 15, 2020"]');
      const allDisabledDates =
        shadowQueryAll(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      const lastDayBeforeMinDate = allDisabledDates.reduce((p, n) => {
        const pDay = +(p as any).day;
        const nDay = +(n as any).day;

        /**
         * NOTE: `15` means day of `date15`.
         */
        return nDay > pDay && nDay < 15 ? n : p;
      });

      isNotNull(firstSelectableDate, 'First selectable date not found');
      isNotNull(lastDayBeforeMinDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(!hasClass(firstSelectableDate, 'day--disabled'), 'First selectable is disabled day');
      strictEqual(
        lastDayBeforeMinDate.getAttribute('aria-label'),
        'Jan 14, 2020',
        `Last day before 'min' not matched`);
      strictEqual(
        focusedDate.getAttribute('aria-label'),
        'Jan 17, 2020',
        'Focused date not matched');

      strictEqual(el.min, minVal, `'min' property not matched`);
      strictEqual(el.value, valueVal, `'value' property not matched`);
      strictEqual(el.getAttribute('min'), minVal, `'min' attribute not matched`);

      el.value = date13;
      await el.updateComplete;

      isTrue(
        !hasClass(focusedDate, 'day--focused'),
        `Focused date not matched ('value' < 'min')`);
      strictEqual(el.value, date13, `New 'value' not matched ('value' < 'min')`);

      el.setAttribute('min', ''); /** Any falsy value, but here only tests empty string */
      await el.updateComplete;

      const newFocusedDateWithoutMin =
        shadowQuery(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      isNotNull(newFocusedDateWithoutMin, `New focused date not found`);
      strictEqual(el.min, '', `New 'min' not matched`);
      strictEqual(el.getAttribute('min'), '', `New 'min' attribute not matched`);
      strictEqual(
        newFocusedDateWithoutMin.getAttribute('aria-label'),
        'Jan 13, 2020',
        `New focused date not matched with no 'min'`);
    });

    it(`renders with correct 'max'`, async () => {
      const maxVal = date15;
      const valueVal = date13;

      el.setAttribute('max', maxVal);
      el.value = valueVal;
      await el.updateComplete;

      const lastSelectableDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="Jan 15, 2020"]');
      const allDisabledDates =
        shadowQueryAll(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
      const focusedDate =
        shadowQuery(
          el,
          '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
      const firstDayAfterMaxDate = allDisabledDates.reduceRight((p, n) => {
        const pDay = +(p as any).day;
        const nDay = +(n as any).day;

        /**
         * NOTE: `15` means day of `date15`.
         */
        return nDay < pDay && nDay > 15 ? n : p;
      });

      isNotNull(lastSelectableDate, 'Last selectable date not found');
      isNotNull(firstDayAfterMaxDate, `Last day before 'min' not found`);
      isNotNull(focusedDate, 'Focused date not found');

      isTrue(!hasClass(lastSelectableDate, 'day--disabled'), 'Last selectable is disabled day');
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

      el.value = date17;
      await el.updateComplete;

      isTrue(
        !hasClass(focusedDate, 'day--focused'),
        `Focused date not matched ('value' > 'max')`);
      strictEqual(el.value, date17, `New 'value' not matched ('value' > 'max')`);

      el.setAttribute('max', ''); /** Any falsy value, but here only tests empty string */
      await el.updateComplete;

      const newFocusedDateWithoutMax =
        shadowQuery(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');

      isNotNull(newFocusedDateWithoutMax, `New focused date not found`);
      strictEqual(el.max, '', `New 'max' not matched`);
      strictEqual(el.getAttribute('max'), '', `New 'max' not matched`);
      strictEqual(
        newFocusedDateWithoutMax.getAttribute('aria-label'),
        'Jan 17, 2020',
        `New focused date not matched with no 'max'`);
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
      el.setAttribute('value', val);
      await el.updateComplete;

      strictEqual(el.value, val, `New 'value' not matched`);
      strictEqual(el.getAttribute('value'), val, `New 'value' attribute not matched`);
    });

    it(`renders with correct 'startView'`, async () => {
      /**
       * NOTE: Not testing initial `startView="yearList"`, assuming that works if this test passes.
       */
      strictEqual(el.startView, START_VIEW.CALENDAR, `Incorrect initial 'startView'`);
      strictEqual(
        el.getAttribute('startview'),
        START_VIEW.CALENDAR,
        `Incorrect initial 'startview' attribute`);

      /** FIXME: Shady DOM only supports all attributs in lowercase */
      el.setAttribute('startview', START_VIEW.YEAR_LIST);
      await el.updateComplete;

      const yearListView = shadowQuery(el, '.datepicker-body__year-list-view');

      strictEqual(el.startView, START_VIEW.YEAR_LIST, `New 'startView' not matched`);
      strictEqual(
        el.getAttribute('startview'),
        START_VIEW.YEAR_LIST,
        `New 'startview' attribute not matched`);
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
        el.setAttribute('firstdayofweek', `${i}`);
        await el.updateComplete;

        const fullCalendarDays =
          shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day');
        const firstDayInMonthIdx = fullCalendarDays.findIndex(n => !hasClass(n, 'day--empty'));

        strictEqual(el.firstDayOfWeek, i, `New 'firstDayOfWeek' (${i}) not matched`);
        strictEqual(
          el.getAttribute('firstdayofweek'),
          `${i}`,
          `New 'firstdayofweek' attribute (${i}) not matched`);
        strictEqual(
          firstDayInMonthIdx,
          expectedFirstDayInMonthIdx[1 + i],
          `Week index not matched with new 'firstDayOfWeek' (${i})`);
      }
    });

    it(`renders with 'showWeekNumber'`, async () => {
      isTrue(!el.showWeekNumber, `'showWeekNumber' is true`);
      isTrue(!el.hasAttribute('showweeknumber'), `'showweeknumber' attribute is set`);

      el.setAttribute('showweeknumber', '');
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
      strictEqual(
        el.getAttribute('weeknumbertype'),
        WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
        `'weeknumbertype' attribute not matched`);

      const allWeekNumberTypes = [
        WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK,
        WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR,
        WEEK_NUMBER_TYPE.FIRST_FULL_WEEK,
      ];
      const expectedWeekdayLabels = [1, 1, 52];

      for (let i = 0; i < 3; i += 1) {
        const weekNumberType = allWeekNumberTypes[i];

        el.setAttribute('weeknumbertype', weekNumberType);
        await el.updateComplete;

        const firstWeekdayLabel =
          getShadowInnerHTML(shadowQuery(el, '.calendar-container:nth-of-type(2) .weekday-label'));

        strictEqual(
          el.weekNumberType,
          weekNumberType,
          `'weekNumberType' not matched ('${weekNumberType}')`);
        strictEqual(
          el.getAttribute('weeknumbertype'),
          weekNumberType,
          `'weeknumbertype' attribute not matched ('${weekNumberType}')`);
        strictEqual(
          firstWeekdayLabel,
          `${expectedWeekdayLabels[i]}`,
          `First weekday label not matched ('${weekNumberType}')`);
      }
    });

    it(`renders with correct 'landscape'`, async () => {
      strictEqual(el.landscape, false, `'landscape' not matched`);
      strictEqual(
        getComputedStylePropertyValue(el, 'display'),
        'block',
        `Element has no 'display: block'`);

      el.setAttribute('landscape', '');
      await el.updateComplete;

      isTrue(el.landscape, `'landscape' not matched`);
      isTrue(el.hasAttribute('landscape'), `No 'landscape' attribute set`);
      strictEqual(
        getComputedStylePropertyValue(el, 'display'),
        'flex',
        `Element has no 'display: flex`);
    });

    it(`renders with different 'locale'`, async () => {
      const getBtnSelectorCalendarInnerHTML =
        () => getShadowInnerHTML(shadowQuery(el, '.btn__calendar-selector'));
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
      el.setAttribute('locale', jaJpLocale);
      await el.updateComplete;

      strictEqual(el.locale, jaJpLocale, `'locale' not matched ('${jaJpLocale}')`);
      strictEqual(
        el.getAttribute('locale'),
        jaJpLocale,
        `'locale' attribute not matched ('${jaJpLocale}')`);
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
        `Formatted date in '${jaJpLocale}' not matched ('${jaJpLocale}')`);
      strictEqual(
        getCalendarWeekdaysInnerHTML(),
        '日, 月, 火, 水, 木, 金, 土',
        `Formatted weekdays in '${jaJpLocale}' not matched ('${jaJpLocale}')`);
    });

    it(`renders with different 'disabledDays'`, async () => {
      const getAllDisabledDays = () =>
        shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled')
          .map(n => n.getAttribute('aria-label')!);

      el.value = date13;
      await el.updateComplete;

      const allDisabledDays = getAllDisabledDays();

      isTrue(
        [
          ['Jan 4, 2020', 'Jan 04, 2020'],
          ['Jan 5, 2020', 'Jan 05, 2020'],
          ['Jan 11, 2020'],
          ['Jan 12, 2020'],
          ['Jan 18, 2020'],
          ['Jan 19, 2020'],
          ['Jan 25, 2020'],
          ['Jan 26, 2020'],
        ].every((n, i) => n.some(o => o === allDisabledDays[i])),
        `All disabled days not matched`);

      /**
       * NOTE: Simple testing here instead of a full suite tests with a comprehensive combination
       * of disabled days.
       */
      el.setAttribute('disableddays', '1,3,5');
      await el.updateComplete;

      const allNewDisabledDays = getAllDisabledDays();

      strictEqual(el.disabledDays, '1,3,5', `'disabledDays' not matched`);
      strictEqual(
        el.getAttribute('disableddays'),
        '1,3,5',
        `'disableddays' attribute not matched`);
      isTrue(
        [
          ['Jan 1, 2020', 'Jan 01, 2020'],
          ['Jan 3, 2020', 'Jan 03, 2020'],
          ['Jan 6, 2020', 'Jan 06, 2020'],
          ['Jan 8, 2020', 'Jan 08, 2020'],
          ['Jan 10, 2020'],
          ['Jan 13, 2020'],
          ['Jan 15, 2020'],
          ['Jan 17, 2020'],
          ['Jan 20, 2020'],
          ['Jan 22, 2020'],
          ['Jan 24, 2020'],
          ['Jan 27, 2020'],
          ['Jan 29, 2020'],
          ['Jan 31, 2020'],
        ].every((n, i) => n.some(o => o === allNewDisabledDays[i])),
        `All new disabled days not matched (disabledDays=1,3,5)`);

      el.setAttribute('disableddays', '');
      await el.updateComplete;

      strictEqual(el.disabledDays, '', `'disabledDays' not reset`);
      strictEqual(el.getAttribute('disableddays'), '', `'disableddays' attribute not reset`);
      isTrue(
        getAllDisabledDays().length === 0,
        `All disabled days not reset`);
    });

    it(`renders with different 'disabledDates'`, async () => {
      const getAllDisabledDays = () =>
        shadowQueryAll(el, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled')
          .map(n => n.getAttribute('aria-label')!);

      /**
       * NOTE: It is to ensure not other disabled days on the calendar of the datepicker.
       */
      el.value = date13;
      el.disabledDays = '';
      await el.updateComplete;

      strictEqual(el.disabledDays, '', `'disabledDays' not reset`);
      isTrue(getAllDisabledDays().length === 0, `Disabled days not reset`);

      /**
       * NOTE: Simple testing here instead of a full suite tests with a comprehensive combination
       * of disabled dates.
       */
      el.setAttribute('disableddates', '2020-01-06, 2020-01-16, 2020-01-23');
      await el.updateComplete;

      const allNewDisabledDays = getAllDisabledDays();

      strictEqual(
        el.disabledDates,
        '2020-01-06, 2020-01-16, 2020-01-23',
        `New 'disabledDates' not matched`);
      strictEqual(
        el.getAttribute('disableddates'),
        '2020-01-06, 2020-01-16, 2020-01-23',
        `New 'disableddates' attribute not matched`);
      isTrue(
        [
          ['Jan 6, 2020', 'Jan 06, 2020'],
          ['Jan 16, 2020'],
          ['Jan 23, 2020'],
        ].every((n, i) => n.some(o => o === allNewDisabledDays[i])),
        `New disabled dates not matched`);

      el.setAttribute('disableddates', '');
      await el.updateComplete;

      strictEqual(el.disabledDates, '', `'disabledDates' not reset`);
      strictEqual(el.getAttribute('disableddates'), '', `'disableddates' attribute not reset`);
      isTrue(getAllDisabledDays().length === 0, `All disabled dates not reset`);
    });

    it(`renders with optional 'weekLabel'`, async () => {
      el.locale = defaultLocale;
      el.showWeekNumber = true;
      await el.updateComplete;

      const weekLabelEl = shadowQuery(el, 'th[aria-label="Week"]');

      strictEqual(el.weekLabel, '', `'weekLabel' not matched`);
      strictEqual(getShadowInnerHTML(weekLabelEl), 'Wk', `Week label not matched`);

      const newWeekLabel = '周数';
      el.setAttribute('weeklabel', newWeekLabel);
      await el.updateComplete;

      strictEqual(el.weekLabel, newWeekLabel, `New 'weekLabel' not matched`);
      strictEqual(
        el.getAttribute('weeklabel'),
        newWeekLabel,
        `New 'weeklabel' attribute not matched`);
      strictEqual(getShadowInnerHTML(weekLabelEl), newWeekLabel, `New week label not matched`);

      el.setAttribute('weeklabel', '');
      await el.updateComplete;

      strictEqual(el.weekLabel, '', `'weekLabel' not reset`);
      strictEqual(
        el.getAttribute('weeklabel'),
        '',
        `'weeklabel' attribute not reset`);
      strictEqual(getShadowInnerHTML(weekLabelEl), 'Wk', `Week label not reset`);
    });

    it(`renders with optional 'dragRatio'`, async () => {
      strictEqual(el.dragRatio, .15, `Initial 'dragRatio' not matched`);
      isTrue(!el.hasAttribute('dragratio'), `Initial 'dragratio' attribute set`);

      el.min = date13;
      el.value = date15;
      el.setAttribute('dragratio', '.5');
      await el.updateComplete;

      strictEqual(el.dragRatio, .5, `'dragRatio' not matched`);
      strictEqual(el.getAttribute('dragratio'), '.5', `'dragratio' attribute not matched`);

      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `First year selector text not matched`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `First calendar selector text not matched`);

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
        `First calendar label not matched (${calendarLabel})`);

      const oldStartingPoint = setupDragPoint('left', el);
      const oldDragOptions: OptionsDragTo = { ...oldStartingPoint, dx: -50 };
      await dragTo(calendarViewFullCalendarEl, oldDragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `Calendar selector text should not change`);

      const oldCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => oldCalendarLabel === n),
        `Calendar label should not update (${oldCalendarLabel})`);

      const startingPoint = setupDragPoint('left', el);
      const dragOptions: OptionsDragTo = { ...startingPoint, dx: -160 };
      await dragTo(calendarViewFullCalendarEl, dragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `Calendar selector text should not change`);

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
        `New calendar label not updated (${newCalendarLabel})`);
    });

  });

  describe('navigating calendar by button/ gesture', () => {
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

    it(`goes to next month`, async () => {
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      const nextBtnMonthSelectorEl = getBtnNextMonthSelector(el);
      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);

      strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
      strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));

      triggerEvent(nextBtnMonthSelectorEl, 'click');
      await waitForDragAnimationFinished(el);

      strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
      strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n));
    });

    it(`goes to previous month`, async () => {
      el.min = date13;
      el.value = '2020-05-13';
      await el.updateComplete;

      const prevBtnMonthSelectorEl = getBtnPrevMonthSelector(el);
      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);

      strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
      strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      isTrue(['May, 2020', 'May 2020'].some(n => calendarLabel === n));

      triggerEvent(prevBtnMonthSelectorEl, 'click');
      await waitForDragAnimationFinished(el);

      strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
      strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n));
    });

    it(`switches to ${START_VIEW.YEAR_LIST} view`, async () => {
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      const btnYearSelectorEl = getBtnYearSelectorEl(el);

      strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');

      triggerEvent(btnYearSelectorEl, 'click');
      await el.updateComplete;

      isNotNull(getYearListViewFullListEl(el));
      strictEqual(
        getShadowInnerHTML(getYearListViewListItemYearSelectedEl(el)), '2020');

      triggerEvent(getBtnCalendarSelectorEl(el), 'click');
      await el.updateComplete;

      strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2020');
      strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Wed, Jan 15');

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));
    });

    it(`restores to focused date when switches back to calendar view`, async () => {
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      let runClick = 3;
      while (runClick) {
        triggerEvent(getBtnNextMonthSelector(el), 'click');
        await waitForDragAnimationFinished(el);
        runClick -= 1;
      }

      triggerEvent(getBtnYearSelectorEl(el), 'click');
      await el.updateComplete;

      triggerEvent(getBtnCalendarSelectorEl(el), 'click');
      await el.updateComplete;

      strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2020');
      strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Wed, Jan 15');

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));
    });

    it(`switches back to calendar view with new selected year`, async () => {
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      let runClick = 3;
      while (runClick) {
        triggerEvent(getBtnNextMonthSelector(el), 'click');
        await waitForDragAnimationFinished(el);
        runClick -= 1;
      }

      triggerEvent(getBtnYearSelectorEl(el), 'click');
      await el.updateComplete;

      selectNewYearFromYearListView(el, '2025');
      await el.updateComplete;

      strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2025');
      strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Tue, Apr 15');

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(['Apr 2025', 'April, 2025', 'April 2025'].some(n => calendarLabel === n));
    });

    it(`goes to next month by dragging/ swiping calendar`, async () => {
      el.min = date13;
      el.value = date15;
      await el.updateComplete;

      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `First year selector text not matched`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `First calendar selector text not matched`);

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
        `First calendar label not matched (${calendarLabel})`);

      const startingPoint = setupDragPoint('left', el);
      const dragOptions: OptionsDragTo = { ...startingPoint, dx: -50 };
      await dragTo(calendarViewFullCalendarEl, dragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, Jan 15',
        `Calendar selector text should not change`);

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
        `New calendar label not updated (${newCalendarLabel})`);
    });

    it(`goes to previous month by dragging/ swiping calendar`, async () => {
      el.min = date13;
      el.value = '2020-05-13';
      await el.updateComplete;

      const btnYearSelectorEl = getBtnYearSelectorEl(el);
      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `First year selector text not matched`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, May 13',
        `First calendar selector text not matched`);

      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      isTrue(
        ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
        `First calendar label not matched (${calendarLabel})`);

      const startingPoint = setupDragPoint('right', el);
      const dragOptions: OptionsDragTo = { ...startingPoint, dx: 50 };
      await dragTo(calendarViewFullCalendarEl, dragOptions);
      await waitForDragAnimationFinished(el);

      strictEqual(
        getShadowInnerHTML(btnYearSelectorEl),
        '2020',
        `Year selector text should not change`);
      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        'Wed, May 13',
        `Calendar selector text should not change`);

      const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
        `New calendar label not updated (${newCalendarLabel})`);
    });

  });

  describe('navigating year list by button', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`navigates to year list by button`, async () => {
      const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
      const btnYearSelectorLabel = getShadowInnerHTML(getBtnYearSelectorEl(el));

      strictEqual(
        el.startView,
        START_VIEW.CALENDAR,
        `Initial 'startView' is not ${START_VIEW.CALENDAR}`);
      strictEqual(
        btnYearSelectorLabel,
        '2020',
        `Initial year selector label not matched (${btnYearSelectorLabel})`);
      /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      isTrue(
        ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
        `Initial calendar label not matched (${calendarLabel})`);

      const btnYearSelectorEl = getBtnYearSelectorEl(el);

      triggerEvent(btnYearSelectorEl, 'click');
      await el.updateComplete;

      strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
      isTrue(getCalendarLabelEl(el) == null, `No calendar should render`);
      isNotNull(getYearListViewFullListEl(el), `Year list view should render`);

      const selectedYearEl = getYearListViewListItemYearSelectedEl(el);
      isNotNull(selectedYearEl, `Selected year not found`);
      strictEqual(getShadowInnerHTML(selectedYearEl), '2020', `Selected year label not matched`);
    });

    it(`selects new year by button`, async () => {
      const btnYearSelectorEl = getBtnYearSelectorEl(el);

      triggerEvent(btnYearSelectorEl, 'click');
      await el.updateComplete;

      strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
      isTrue(getCalendarLabelEl(el) == null, `No calendar should render`);
      isNotNull(getYearListViewFullListEl(el), `Year list view should render`);

      selectNewYearFromYearListView(el, '2025');
      await el.updateComplete;

      const newBtnYearSelectorEl = getBtnYearSelectorEl(el);

      isNotNull(newBtnYearSelectorEl, `Year selector button not found`);
      strictEqual(el.startView, START_VIEW.CALENDAR, `Calendar should render`);
      strictEqual(
        getShadowInnerHTML(newBtnYearSelectorEl),
        '2025',
        `New selected year not matched`);
    });

  });

  describe('focusing new date with button/ gesture/ keyboard', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`focuses correct date by gesture`, async () => {
      strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

      const newFocusedDateEl =
        shadowQuery(el, '.calendar-container:nth-of-type(2)')
          .querySelector('.full-calendar__day:not(.day--disabled)[aria-label="Jan 22, 2020"]');
      triggerEvent(newFocusedDateEl as HTMLElement, 'click');
      await el.updateComplete;

      strictEqual(el.value, '2020-01-22', `New focused date not updated (${el.value})`);

      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

      const calendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
      strictEqual(
        calendarSelectorLabel,
        'Wed, Jan 22',
        `Calendar selector label not matched (${calendarSelectorLabel})`);

      const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '22',
        `New focused date label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date on new month by button and gesture`, async () => {
      strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

      const nextBtnMonthSelectorEl = getBtnNextMonthSelector(el);
      isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

      triggerEvent(nextBtnMonthSelectorEl, 'click');
      await waitForDragAnimationFinished(el);

      const newFocusedDateEl =
        shadowQuery(el, '.calendar-container:nth-of-type(2)')
          .querySelector('.full-calendar__day:not(.day--disabled)[aria-label="Feb 25, 2020"]');
      triggerEvent(newFocusedDateEl as HTMLElement, 'click');
      await el.updateComplete;

      strictEqual(el.value, '2020-02-25', `New focused date not updated (${el.value})`);

      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

      const calendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
      strictEqual(
        calendarSelectorLabel,
        'Tue, Feb 25',
        `Calendar selector label not matched (${calendarSelectorLabel})`);

      const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
      isNotNull(newFocusedDateLabelEl, 'New focused date not found');

      const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '25',
        `New focused date label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Left)`, async () => {
      const datepickerBodyCalendarViewEl = getDatepickerBodyCalendarViewEl(el);
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_LEFT,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await el.updateComplete;

      strictEqual(el.value, '2020-01-14', `New focused date not matched (${el.value})`);

      const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      const btnCalendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
      strictEqual(
        btnCalendarSelectorLabel,
        `Tue, Jan 14`,
        `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

      const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
      strictEqual(
        newFocusedDateLabel,
        '14',
        `New focused label not matched (${newFocusedDateLabel})`);
    });

    it(`focuses date by keyboard (Left + first focusable date)`, async () => {
      const tasks = [
        async () => { el.value = date13; await el.updateComplete; return 0; },
        async () => { el.disabledDates = '2020-01-14'; await el.updateComplete; return 1; },
      ];

      for (const fn of tasks) {
        const val = await fn();
        if (!val) strictEqual(el.value, '2020-01-13', `'value' not updated`);
        if (val === 1) strictEqual(el.disabledDates, '2020-01-14', `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = getDatepickerBodyCalendarViewEl(el);
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_LEFT,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await el.updateComplete;

        strictEqual(el.value, '2020-01-13', `New focused date not matched (${el.value})`);

        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        const btnCalendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
        strictEqual(
          btnCalendarSelectorLabel,
          `Mon, Jan 13`,
          `Updated calendar selector label not matched (${btnCalendarSelectorLabel})`);

        const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '13',
          `New focused label not matched (${newFocusedDateLabel})`);
      }
    });

  });

  // describe('timezones', () => {});

});
