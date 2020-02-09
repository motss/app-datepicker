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

describe('attributes', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      el.min = '2000-01-01';

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

  it(`takes snapshot (attributes)`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector(a)!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';
      await el.updateComplete;

      done();
    }, elementName);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-1-${browserName}.png`);
  });

  it(`renders with defined 'min'`, async () => {
    type A = [string, string, string, string];
    const [
      prop,
      attr,
      lastDisabledDateContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-17';
      n.setAttribute('min', '2020-01-15');
      await n.updateComplete;

      const root = n.shadowRoot!;

      const disabledDates = Array.from(root.querySelectorAll<HTMLTableCellElement>(b));
      const lastDisabledDate = disabledDates[disabledDates.length - 1];

      const focusedDate = root.querySelector(c);

      done([
        n.min,
        n.getAttribute('min'),
        lastDisabledDate.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--disabled'), toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-15');
    strictEqual(cleanHtml(lastDisabledDateContent), prettyHtml`
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
      firstDisabledDateContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.min = '2000-01-01';
      n.setAttribute('max', '2020-01-17');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const firstDisabledDate = root.querySelector<HTMLTableCellElement>(b)!;
      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      done([
        n.max,
        n.getAttribute('max'),
        firstDisabledDate.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--disabled'), toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-17');
    strictEqual(cleanHtml(firstDisabledDateContent), prettyHtml`
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
    type A = [string, string, string, string];

    const [
      prop,
      attr,
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
        n.getAttribute('value'),
        focusedDate.outerHTML,
      ]);
    }, elementName, toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-15');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'startview'`, async () => {
    type A = [StartView, StartView, boolean];

    const [
      prop,
      attr,
      hasYearListView,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.setAttribute('startview', 'yearList' as StartView);

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

  it(`renders with defined 'firstdayofweek'`, async () => {
    type A = [number, string, string, string];

    const [
      prop,
      attr,
      firstWeekdayLabelContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('firstdayofweek', '2');

      await n.updateComplete;

      const root = n.shadowRoot!;

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

  it(`renders with defined 'showweeknumber'`, async () => {
    type A = [boolean, string, string, string[]];

    const [
      prop,
      attr,
      weekNumberLabelContent,
      weekNumbersContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.setAttribute('showweeknumber', '');

      await n.updateComplete;

      const root = n.shadowRoot!;

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
    toSelector(`th[aria-label="Week"]`),
    toSelector('tbody > tr > td:first-of-type'));

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(cleanHtml(weekNumberLabelContent), prettyHtml`<th aria-label="Week">Wk</th>`);
    deepStrictEqual(weekNumbersContents.map(n => cleanHtml(n)), [
      ...([1, 2, 3, 4, 5].map((n) => {
        return prettyHtml(
          `<td class="full-calendar__day weekday-label" aria-label="Week ${n}">${n}</td>`
        );
      })),
      `<td class="full-calendar__day day--empty"></td>`,
    ]);
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    type A = [WeekNumberType, WeekNumberType, string[]];

    const [
      prop,
      attr,
      weekNumbersContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeknumbertype', 'first-full-week' as WeekNumberType);

      await n.updateComplete;

      const weekNumbers = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(b), o => o.outerHTML);

      done([
        n.weekNumberType,
        n.getAttribute('weeknumbertype'),
        weekNumbers,
      ] as A);
    }, elementName, toSelector('tbody > tr >td:first-of-type'));

    allStrictEqual<WeekNumberType>([prop, attr], 'first-full-week');
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

      n.setAttribute('landscape', '');

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
    type A = [string, string, string, string[]];

    const [
      prop,
      attr,
      focusedDateContent,
      weekdayLabelsContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('locale', 'ja-JP');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const weekdayLabels = Array.from(
        root.querySelectorAll<HTMLTableHeaderCellElement>(c), o => o.outerHTML);

      done([
        n.locale,
        n.getAttribute('locale'),
        focusedDate.outerHTML,
        weekdayLabels,
      ] as A);
    }, elementName, toSelector('.day--focused'), toSelector('.calendar-weekdays > th'));

    allStrictEqual([prop, attr], 'ja-JP');
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

  it(`renders with defined 'disableddays'`, async () => {
    type A = [string, string, string[]];

    const [
      prop,
      attr,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddays', '1,5');

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(b), o => o.outerHTML);

      done([
        n.disabledDays,
        n.getAttribute('disableddays'),
        disabledDates,
      ] as A);
    }, elementName, toSelector('.day--disabled'));

    allStrictEqual([prop, attr], '1,5');
    deepStrictEqual(
      disabledDatesContents.map(n => cleanHtml(n)),
      [3, 6, 10, 13, 17, 20, 24, 27, 31].map((n) => {
        return prettyHtml(`
        <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
          <div class="calendar-day">${n}</div>
        </td>
        `);
      })
    );
  });

  it(`renders with defined 'disableddates'`, async () => {
    type A = [string, string, string[]];

    const disableddates = [
      '2020-01-03',
      '2020-01-09',
      '2020-01-21',
      '2020-01-27',
    ].join(',');
    const [
      prop,
      attr,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddates', c);

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLTableCellElement>(b), o => o.outerHTML);

      done([
        n.disabledDates,
        n.getAttribute('disableddates'),
        disabledDates,
      ] as A);
    }, elementName, toSelector('.day--disabled'), disableddates);

    allStrictEqual([prop, attr], disableddates);
    deepStrictEqual(disabledDatesContents.map(n => cleanHtml(n)), [3, 9, 21, 27].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

  it(`renders with defined 'inline'`, async () => {
    type A = [boolean, string, null];

    const [
      prop,
      attr,
      noDatepickerHeader,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.setAttribute('inline', '');

      await n.updateComplete;

      const datepickerHeader = n.shadowRoot!.querySelector<HTMLDivElement>(b);

      done([
        n.inline,
        n.getAttribute('inline'),
        datepickerHeader,
      ] as A);
    }, elementName, '.datepicker-header');

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(noDatepickerHeader, null);
  });

  it(`renders with optional 'weeklabel'`, async () => {
    type A = [string, string, string];

    const weekLabel  = '周数';
    const [
      prop,
      attr,
      weekNumberLabelContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeklabel', c);

      await n.updateComplete;

      const weekNumberLabel = n.shadowRoot!.querySelector<HTMLTableHeaderCellElement>(b)!;

      done([
        n.weekLabel,
        n.getAttribute('weeklabel'),
        weekNumberLabel.outerHTML,
      ] as A);
    }, elementName, toSelector(`th[aria-label="${weekLabel}"]`), weekLabel);

    allStrictEqual([prop, attr], weekLabel);
    strictEqual(cleanHtml(weekNumberLabelContent), prettyHtml`<th aria-label="周数">周数</th>`);
  });

  it(`renders with different 'firstdayofweek' and 'disableddays'`, async () => {
    type A = [number, string, string, string, string, string[]];

    const [
      prop,
      attr,
      prop2,
      attr2,
      focusedDateContent,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('firstdayofweek', '2');
      n.setAttribute('disableddays', '1,5');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const disabledDates = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(c), o => o.outerHTML);

      done([
        n.firstDayOfWeek,
        n.getAttribute('firstdayofweek'),
        n.disabledDays,
        n.getAttribute('disableddays'),
        focusedDate.outerHTML,
        disabledDates,
      ] as A);
    },
    elementName,
    toSelector('tbody > tr:nth-of-type(3) > td:nth-of-type(2)'),
    toSelector('.day--disabled'));

    strictEqual(prop, 2);
    strictEqual(attr, '2');
    allStrictEqual([prop2, attr2], '1,5');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
    deepStrictEqual(disabledDatesContents.map(n => cleanHtml(n)), [
      3, 6, 10, 13, 17, 20, 24, 27, 31,
    ].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

});
