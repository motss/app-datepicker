import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing.js';

import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  ok,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';

describe('properties', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<AppDatepicker>(a)!;

      document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`takes snapshot (properties)`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/properties-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector<AppDatepicker>(a)!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';

      await el.updateComplete;

      done();
    }, elementName);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/properties-1-${browserName}.png`);
  });

  it(`renders with defined 'min'`, async () => {
    type A = [string, string, string, string];

    const [
      prop,
      attr,
      disabledDateContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.min = '2020-01-15';
      n.value = '2020-01-17';

      await n.updateComplete;

      const disabledDates = Array.from(root.querySelectorAll<HTMLTableCellElement>(b));
      const lastDisableDate = disabledDates[disabledDates.length - 1];

      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      // Chrome requires more time to render
      await n.updateComplete;

      done([
        n.min,
        n.getAttribute('min'),
        lastDisableDate.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    '.day--disabled',
    toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-15');
    strictEqual(cleanHtml(disabledDateContent), prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 14, 2020">
      <div class="calendar-day">14</div>
    </td>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 17, 2020">
      <div class="calendar-day">17</div>
    </td>
    `);
  });

  it(`renders with defined 'max'`, async () => {
    type A = [string, string, string, string];

    const [
      prop,
      attr,
      disabledDateContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.min = '2000-01-01';
      n.max = '2020-01-17';
      n.value = '2020-01-15';

      await n.updateComplete;

      const disabledDates = Array.from(root.querySelectorAll<HTMLTableCellElement>(b));

      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      // Chrome requires more time to render
      await n.updateComplete;

      done([
        n.max,
        n.getAttribute('max'),
        disabledDates[0].outerHTML,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    '.day--disabled',
    toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-17');
    strictEqual(cleanHtml(disabledDateContent), prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 18, 2020">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'value'`, async () => {
    type A = [string, string];

    const [
      prop,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.max = '2020-12-31';
      n.setAttribute('value', '2020-01-15');

      await n.updateComplete;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    toSelector('.day--focused'));

    strictEqual(prop, '2020-01-15');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'startView'`, async () => {
    type A = [StartView, StartView, boolean];

    const [
      prop,
      attr,
      hasYearListView,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.startView = 'yearList';

      await n.updateComplete;

      const yearListView = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done([
        n.startView,
        n.getAttribute('startview'),
        yearListView != null,
      ] as A);
    }, elementName, '.datepicker-body__year-list-view');

    allStrictEqual([prop, attr], 'yearList');
    ok(hasYearListView);
  });

  it(`renders with defined 'firstDayOfWeek'`, async () => {
    type A = [number, string, string, string];

    const [
      prop,
      attr,
      firstWeekdayLabelContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.firstDayOfWeek = 2;

      await n.updateComplete;

      const firstWeekdayLabel = root.querySelector<HTMLTableHeaderCellElement>(b)!;
      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      done([
        n.firstDayOfWeek,
        n.getAttribute('firstdayofweek'),
        firstWeekdayLabel.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    toSelector('th'),
    toSelector('tbody > tr:nth-of-type(3) > td:nth-of-type(2)'));

    strictEqual(prop, 2);
    strictEqual(attr, '2');
    strictEqual(cleanHtml(firstWeekdayLabelContent), prettyHtml`
      <th aria-label="Tuesday">T</th>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'showWeekNumber'`, async () => {
    type A = [boolean, string, string, string[]];

    const [
      prop,
      attr,
      weekNumberLabelContent,
      weekNumbersContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;

      await n.updateComplete;

      const weekNumberLabel = root.querySelector<HTMLTableHeaderCellElement>(b)!;
      const weekNumbers = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(c), o => o.outerHTML);

      done([
        n.showWeekNumber,
        n.getAttribute('showweeknumber'),
        weekNumberLabel.outerHTML,
        weekNumbers,
      ] as A);
    },
    elementName,
    toSelector('th[aria-label="Week"]'),
    toSelector('tbody > tr > td:first-of-type'));

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(
      cleanHtml(weekNumberLabelContent), prettyHtml`<th aria-label="Week">Wk</th>`);
    deepStrictEqual(weekNumbersContents.map(n => cleanHtml(n)), [
      ...([1, 2, 3, 4, 5].map((n) => {
        return prettyHtml(
          `<td class="full-calendar__day weekday-label" aria-label="Week ${n}">${n}</td>`
        );
      })),
      `<td class="full-calendar__day day--empty"></td>`,
    ]);
  });

  it(`renders with defined 'weekNumberType'`, async () => {
    type A = [WeekNumberType, WeekNumberType, string[]];

    const [
      prop,
      attr,
      weekNumbersContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.weekNumberType = 'first-full-week';

      await n.updateComplete;

      const weekNumbers = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(b), o => o.outerHTML);

      done([
        n.weekNumberType,
        n.getAttribute('weeknumbertype'),
        weekNumbers,
      ] as A);
    },
    elementName,
    toSelector('tbody > tr >td:first-of-type'));

    allStrictEqual([prop, attr], 'first-full-week');
    deepStrictEqual(weekNumbersContents.map(n => cleanHtml(n)), [
      ...([52, 1, 2, 3, 4].map((n) => {
        return prettyHtml(
          `<td class="full-calendar__day weekday-label" aria-label="Week ${n}">${n}</td>`
        );
      })),
      `<td class="full-calendar__day day--empty"></td>`,
    ]);

  });

  it(`renders with defined 'landscape'`, async () => {
    type A = [boolean, string, string];

    const [
      prop,
      attr,
      cssDisplay,
    ]: A = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.landscape = true;

      await n.updateComplete;

      done([
        n.landscape,
        n.getAttribute('landscape'),
        getComputedStyle(n).display,
      ] as A);
    }, elementName);

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(cssDisplay, 'flex');
  });

  it(`renders with defined 'locale'`, async () => {
    type A = [string, string, string[]];

    const [
      prop,
      focusedDateContent,
      weekdayLabelsContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.value = '2020-01-15';
      n.locale = 'ja-JP';

      await n.updateComplete;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const weekdayLabels = Array.from(
        root.querySelectorAll<HTMLTableHeaderCellElement>(c), o => o.outerHTML);

      done([
        n.locale,
        focusedDate.outerHTML,
        weekdayLabels,
      ] as A);
    },
    elementName,
    toSelector('.day--focused'),
    toSelector('.calendar-weekdays > th'));

    strictEqual(prop, 'ja-JP');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="2020年1月15日">
      <div class="calendar-day">15日</div>
    </td>
    `);
    deepStrictEqual(weekdayLabelsContents.map(n => cleanHtml(n)), [
      '日',
      '月',
      '火',
      '水',
      '木',
      '金',
      '土',
    ].map((n) => {
      return prettyHtml(`<th aria-label="${n}曜日">${n}</th>`);
    }));
  });

  it(`renders with defined 'disabledDays'`, async () => {
    type A = [string, string[]];

    const [
      prop,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.disabledDays = '1,5';

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(b), o => o.outerHTML);

      done([
        n.disabledDays,
        disabledDates,
      ] as A);
    }, elementName, toSelector('.day--disabled'));

    strictEqual(prop, '1,5');
    deepStrictEqual(
      disabledDatesContents.map(n => cleanHtml(n)),
      [
        3,
        6,
        10,
        13,
        17,
        20,
        24,
        27,
        31,
      ].map((n) => {
        return prettyHtml(`
        <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
          <div class="calendar-day">${n}</div>
        </td>
        `);
      })
    );
  });

  it(`renders with defined 'disabledDates'`, async () => {
    type A = [string, string[]];

    const propVal = [
      '2020-01-03',
      '2020-01-09',
      '2020-01-21',
      '2020-01-27',
    ].join(',');

    const [
      prop,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.disabledDates = b;

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(c), o => o.outerHTML);

      done([
        n.disabledDates,
        disabledDates,
      ] as A);
    }, elementName, propVal, toSelector('.day--disabled'));

    strictEqual(prop, propVal);
    deepStrictEqual(disabledDatesContents.map(n => cleanHtml(n)), [
      3,
      9,
      21,
      27,
    ].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

  it(`renders with optional 'weekLabel'`, async () => {
    type A = [string, string];

    const [
      prop,
      weekNumberLabelContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.weekLabel = '周数';

      await n.updateComplete;

      const weekNumberLabel = n.shadowRoot!.querySelector<HTMLTableHeaderCellElement>(b)!;

      done([
        n.weekLabel,
        weekNumberLabel.outerHTML,
      ] as A);
    }, elementName, toSelector(`th[aria-label="周数"]`));

    strictEqual(prop, '周数');
    strictEqual(cleanHtml(weekNumberLabelContent), prettyHtml`<th aria-label="周数">周数</th>`);
  });

  it(`renders with different 'firstDayOfWeek' and 'disabledDays'`, async () => {
    type A = [number, string, string, string, string[]];

    const [
      prop,
      attr,
      prop2,
      focusedDateContent,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.firstDayOfWeek = 2;
      n.disabledDays = '1,5';

      await n.updateComplete;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const disabledDates = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(c), o => o.outerHTML);

      done([
        n.firstDayOfWeek,
        n.getAttribute('firstdayofweek'),
        n.disabledDays,
        focusedDate.outerHTML,
        disabledDates,
      ] as A);
    },
    elementName,
    toSelector('tbody > tr:nth-of-type(3) > td:nth-of-type(2)'),
    toSelector('.day--disabled'));

    strictEqual(prop, 2);
    strictEqual(attr, '2');
    strictEqual(prop2, '1,5');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
    deepStrictEqual(disabledDatesContents.map(n => cleanHtml(n)), [
      3,
      6,
      10,
      13,
      17,
      20,
      24,
      27,
      31,
    ].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

});
