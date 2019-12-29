import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { cleanText } from '../helpers/clean-text.js';
import { getProp } from '../helpers/get-prop.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { queryEl } from '../helpers/query-el.js';
import { shadowQueryAll } from '../helpers/shadow-query-all.js';
import { shadowQuery } from '../helpers/shadow-query.js';
import {
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe('initial render', () => {
  const elementName = 'app-datepicker';

  describe('calendar view', () => {
    before(async () => {
      await browser.url(APP_INDEX_URL);
    });

    beforeEach(async () => {
      await browser.executeAsync(async (a, done) => {
        const el: AppDatepicker = document.createElement(a);

        el.min = '2000-01-01';
        el.value = '2020-02-02';

        document.body.appendChild(el);

        await el.updateComplete;

        done();
      }, elementName);
    });

    afterEach(async () => {
      await browser.executeAsync((a, done) => {
        const el = document.body.querySelector(a)!;

        document.body.removeChild(el);

        done();
      }, elementName);
    });

    it(`takes snapshot`, async () => {
      const browserName = browser.capabilities.browserName;

      await browser.saveScreenshot(
        `./src/tests/snapshots/initial-render-calendar-view-${browserName}.png`
      );
    });

    it(`renders initial content`, async () => {
      const locale = await getProp(elementName, 'locale');

      strictEqual(locale, 'en-US');
    });

    it(`renders calendar view`, async () => {
      const el = await queryEl(elementName);

      const calendarLabel = await shadowQuery(el, [
        '.calendar-container:nth-of-type(2)',
        '.calendar-label',
      ]);
      const calendarLabelContent = await cleanHtml(calendarLabel);

      const calendarRows = await shadowQueryAll(el, [
        '.calendar-container:nth-of-type(2)',
        '.calendar-table td',
      ]);
      const calendarRowsContent = await Promise.all(calendarRows.map(cleanText));

      strictEqual(
        calendarLabelContent,
        prettyHtml`<div class="calendar-label">February 2020</div>`
      );
      // NOTE: Safari returns text content with unnecessary whitespaces
      deepStrictEqual(calendarRowsContent.map(n => n.trim()), [
        '', '', '', '', '', '', 1,
        2, 3, 4,  5,  6,  7, 8,
        9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26, 27, 28, 29,
        '', '', '', '', '', '', '',
      ].map(String));
    });

    it(`renders today's formatted date`, async () => {
      const el = await queryEl(elementName);

      const formattedDate = await shadowQuery(el, ['.btn__calendar-selector']);
      const formattedDateContent = await cleanHtml(formattedDate);

      strictEqual(formattedDateContent, prettyHtml`
      <button class="btn__calendar-selector selected" data-view="calendar">Sun, Feb 2</button>
      `);
    });

    it(`focuses today's date`, async () => {
      const el = await queryEl(elementName);

      const focusedDate = await shadowQuery(el, ['.day--focused']);
      const focusedDateContent = await cleanHtml(focusedDate);

      strictEqual(focusedDateContent, prettyHtml`
      <td class="full-calendar__day day--focused" aria-label="Feb 2, 2020">
        <div class="calendar-day">2</div>
      </td>
      `);
    });

  });

  describe('year list view', () => {
    before(async () => {
      await browser.url(APP_INDEX_URL);
    });

    beforeEach(async () => {
      await browser.executeAsync(async (a, done) => {
        const el: AppDatepicker = document.createElement(a);

        el.min = '2000-01-01';
        el.startView = 'yearList';
        el.value = '2020-02-02';

        document.body.appendChild(el);

        await el.updateComplete;

        done();
      }, elementName);
    });

    afterEach(async () => {
      await browser.executeAsync((a, done) => {
        const el = document.body.querySelector(a)!;

        document.body.removeChild(el);

        done();
      }, elementName);
    });

    it(`renders initial content`, async () => {
      const el = await queryEl(elementName);

      const yearListItems = await shadowQueryAll(el, ['.year-list-view__list-item']);
      const yearListItemsContents = await Promise.all(yearListItems.map(cleanText));

      deepStrictEqual(
        yearListItemsContents,
        Array.from(Array(2100 - 2000 + 1), (_, i) => `${2000 + i}`)
      );
    });

    it(`focuses this year`, async () => {
      const el = await queryEl(elementName);

      const focusedYear = await shadowQuery(el, ['.year-list-view__list-item.year--selected']);
      const focusedYearContent = await cleanHtml(focusedYear);

      strictEqual(focusedYearContent, prettyHtml`
      <button class="year-list-view__list-item year--selected">
        <div>2020</div>
      </button>
      `);
    });

  });

});
