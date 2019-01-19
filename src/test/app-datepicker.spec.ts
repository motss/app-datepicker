import { AppDatepicker } from '../app-datepicker.js';

import '../app-datepicker.js';
import {
  stripLTRMark,
  toFormattedDateString,
} from '../datepicker-helpers.js';
import {
  getShadowInnerHTML,
  shadowQuery,
  stripExpressionDelimiters,
} from './test-helpers';

const {
  isString,
  isTrue,
  strictEqual,
} = chai.assert;

describe('app-datepicker', () => {
  describe('initial render (calendar view)', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it('renders initial content', () => {
      const elHTML = stripExpressionDelimiters(el.shadowRoot!.innerHTML);

      isString(elHTML, 'HTML content is not string');
      isTrue(elHTML.length > 99, 'HTML content is < 15 characters');
    });

    it(`renders today's formatted date`, () => {
      const btnSelectorYearEl = shadowQuery(el, '.btn__selector-year');
      const btnSelectorCalendarEl = shadowQuery(el, '.btn__selector-calendar');

      const selectedFullYear = getShadowInnerHTML(btnSelectorYearEl);
      const selectedFormattedDate = getShadowInnerHTML(btnSelectorCalendarEl);

      const now = new Date();
      const fy = now.getUTCFullYear().toString();
      const formattedDate = Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }).format(now);

      strictEqual(el.value, toFormattedDateString(now));
      strictEqual(selectedFullYear, fy, 'Selected full year not matched');
      strictEqual(selectedFormattedDate, formattedDate, 'Selected formatted date not matched');
    });

    it(`selects, highlights, and focuses today's date`, () => {
      const dayTodayEl = shadowQuery(el, '.day--today');
      const dayFocusedEL = shadowQuery(el, '.day--focused');
      const highlightedCalendarDayEl = shadowQuery(el, '.day--today.day--focused > .calendar-day');

      const now = new Date();
      const formattedDate = Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(now);
      const formattedDay = Intl.DateTimeFormat('en-US', {
        day: 'numeric',
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

  // describe('initial render (year list view)', () => {});
  // describe('keyboard support', () => {});
  // describe('updates via attributes', () => {});
  // describe('updates via properties', () => {});

});
