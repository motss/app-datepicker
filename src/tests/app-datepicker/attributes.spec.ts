import type { WeekNumberType } from 'nodemod/dist/calendar/typings.js';

import { DATEPICKER_NAME } from '../../constants.js';
import type { StartView } from '../../custom_typings.js';
import type { Datepicker } from '../../datepicker.js';
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

describe('attributes', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: Datepicker = document.createElement(a);

      el.locale = 'en-US';
      el.min = '2000-01-01';

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, DATEPICKER_NAME);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a) as Datepicker;

      document.body.removeChild(el);

      done();
    }, DATEPICKER_NAME);
  });

  it(`takes snapshot (attributes)`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${DATEPICKER_NAME}/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector(a)!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';
      await el.updateComplete;

      done();
    }, DATEPICKER_NAME);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${DATEPICKER_NAME}/attributes-1-${browserName}.png`);
  });

  it(`renders with defined 'min'`, async () => {
    type A = [string, string, string, string];
    const [
      prop,
      attr,
      lastDisabledDateContent,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.value = '2020-01-17';
      n.setAttribute('min', '2020-01-15');
      await n.updateComplete;

      const root = n.shadowRoot!;

      const disabledDates = Array.from(root.querySelectorAll(b)) as HTMLTableCellElement[];
      const lastDisabledDate = disabledDates[disabledDates.length - 1];

      const focusedDate = root.querySelector(c);

      done([
        n.min,
        n.getAttribute('min'),
        lastDisabledDate.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.day--disabled'), toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-15');
    strictEqual(cleanHtml(lastDisabledDateContent), prettyHtml`
    <td class="full-calendar__day day--disabled" aria-disabled="true" aria-label="Jan 14, 2020" aria-selected="false">
      <div class="calendar-day">14</div>
    </td>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 17, 2020" aria-selected="true">
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
      const n = document.body.querySelector(a) as Datepicker;

      n.value = '2020-01-15';
      n.min = '2000-01-01';
      n.setAttribute('max', '2020-01-17');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const firstDisabledDate = root.querySelector(b) as HTMLTableCellElement;
      const focusedDate = root.querySelector(c) as HTMLTableCellElement;

      done([
        n.max,
        n.getAttribute('max'),
        firstDisabledDate.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.day--disabled'), toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-17');
    strictEqual(cleanHtml(firstDisabledDateContent), prettyHtml`
    <td class="full-calendar__day day--disabled" aria-disabled="true" aria-label="Jan 18, 2020" aria-selected="false">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 15, 2020" aria-selected="true">
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
      const n = document.body.querySelector(a) as Datepicker;

      n.min = '2000-01-01';
      n.max = '2020-12-31';
      n.setAttribute('value', '2020-01-15');

      await n.updateComplete;

      const focusedDate = n.shadowRoot!.querySelector(b) as HTMLTableCellElement;

      done([
        n.value,
        n.getAttribute('value'),
        focusedDate.outerHTML,
      ]);
    }, DATEPICKER_NAME, toSelector('.day--focused'));

    allStrictEqual([prop, attr], '2020-01-15');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 15, 2020" aria-selected="true">
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
      const n = document.body.querySelector(a) as Datepicker;

      n.setAttribute('startview', 'yearList' as StartView);

      await n.updateComplete;

      const yearListView = n.shadowRoot!.querySelector(b) as HTMLDivElement;

      done([
        n.startView,
        n.getAttribute('startview'),
        yearListView != null,
      ] as A);
    }, DATEPICKER_NAME, '.datepicker-body__year-list-view');

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
      const n = document.body.querySelector(a) as Datepicker;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('firstdayofweek', '2');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const firstWeekdayLabel = root.querySelector(b) as HTMLTableCellElement;
      const focusedDate = root.querySelector(c) as HTMLTableCellElement;

      done([
        n.firstDayOfWeek,
        n.getAttribute('firstdayofweek'),
        firstWeekdayLabel.outerHTML,
        focusedDate.outerHTML,
      ] as A);
    },
    DATEPICKER_NAME,
    toSelector('th'),
    toSelector('tbody > tr:nth-of-type(3) > td:nth-of-type(2)'));

    strictEqual(prop, 2);
    strictEqual(attr, '2');
    strictEqual(cleanHtml(firstWeekdayLabelContent), prettyHtml`
    <th class="calendar-weekday" aria-label="Tuesday">
      <div class="weekday">T</div>
    </th>
    `);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 15, 2020" aria-selected="true">
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
      const n = document.body.querySelector(a) as Datepicker;

      n.value = '2020-01-15';
      n.setAttribute('showweeknumber', '');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const weekNumberLabel = root.querySelector(b) as HTMLTableCellElement;
      const weekNumbers = Array.from(
        root.querySelectorAll(c), o => o.outerHTML);

      done([
        n.showWeekNumber,
        n.getAttribute('showweeknumber'),
        weekNumberLabel.outerHTML,
        weekNumbers,
      ] as A);
    },
    DATEPICKER_NAME,
    toSelector(`th[aria-label="Week"]`),
    toSelector('tbody > tr > th'));

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(
      cleanHtml(weekNumberLabelContent),
      prettyHtml`
      <th class="calendar-weekday" aria-label="Week">
        <div class="weekday">Wk</div>
      </th>
      `
    );
    deepStrictEqual(
      weekNumbersContents.map(n => cleanHtml(n)),
      [1, 2, 3, 4, 5].map((n) => {
        return prettyHtml(
        `<th class="full-calendar__day weekday-label" abbr="Wk ${n}" aria-label="Wk ${n}">${n}</th>`
        );
      })
    );
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    type A = [WeekNumberType, WeekNumberType, string[]];

    const [
      prop,
      attr,
      weekNumbersContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeknumbertype', 'first-full-week' as WeekNumberType);

      await n.updateComplete;

      const weekNumbers = Array.from(
        n.shadowRoot!.querySelectorAll(b), o => o.outerHTML);

      done([
        n.weekNumberType,
        n.getAttribute('weeknumbertype'),
        weekNumbers,
      ] as A);
    }, DATEPICKER_NAME, toSelector('tbody > tr > th'));

    allStrictEqual<WeekNumberType>([prop, attr], 'first-full-week');
    deepStrictEqual(
      weekNumbersContents.map(n => cleanHtml(n)),
      [52, 1, 2, 3, 4].map((n) => {
        return prettyHtml(
        `<th class="full-calendar__day weekday-label" abbr="Wk ${n}" aria-label="Wk ${n}">${n}</th>`
        );
      })
    );

  });

  it(`renders with defined 'landscape'`, async () => {
    type A = [boolean, string, string];

    const [
      prop,
      attr,
      cssDisplay,
    ]: A = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.setAttribute('landscape', '');

      await n.updateComplete;

      done([
        n.landscape,
        n.getAttribute('landscape'),
        getComputedStyle(n as unknown as Element).display,
      ] as A);
    }, DATEPICKER_NAME);

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
      const n = document.body.querySelector(a) as Datepicker;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('locale', 'ja-JP');

      await n.updateComplete;

      const root = n.shadowRoot!;

      const focusedDate = root.querySelector(b) as HTMLTableCellElement;
      const weekdayLabels = Array.from(
        root.querySelectorAll(c), o => o.outerHTML);

      done([
        n.locale,
        n.getAttribute('locale'),
        focusedDate.outerHTML,
        weekdayLabels,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.day--focused'), toSelector('.calendar-weekdays > th'));

    allStrictEqual([prop, attr], 'ja-JP');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="2020年1月15日" aria-selected="true">
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
      return prettyHtml(
      `<th class="calendar-weekday" aria-label="${n}曜日">
        <div class="weekday">${n}</div>
      </th>`
      );
    }));
  });

  it(`renders with defined 'disableddays'`, async () => {
    type A = [string, string, string[]];

    const [
      prop,
      attr,
      disabledDatesContents,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddays', '1,5');

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll(b), o => o.outerHTML);

      done([
        n.disabledDays,
        n.getAttribute('disableddays'),
        disabledDates,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.day--disabled'));

    allStrictEqual([prop, attr], '1,5');
    deepStrictEqual(
      disabledDatesContents.map(n => cleanHtml(n)),
      [3, 6, 10, 13, 17, 20, 24, 27, 31].map((n) => {
        return prettyHtml(`
        <td class="full-calendar__day day--disabled" aria-disabled="true" aria-label="Jan ${n}, 2020" aria-selected="false">
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
      const n = document.body.querySelector(a) as Datepicker;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddates', c);

      await n.updateComplete;

      const disabledDates = Array.from(
        n.shadowRoot!.querySelectorAll(b), o => o.outerHTML);

      done([
        n.disabledDates,
        n.getAttribute('disableddates'),
        disabledDates,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.day--disabled'), disableddates);

    allStrictEqual([prop, attr], disableddates);
    deepStrictEqual(disabledDatesContents.map(n => cleanHtml(n)), [3, 9, 21, 27].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-disabled="true" aria-label="Jan ${n}, 2020" aria-selected="false">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

  it(`renders with defined 'inline'`, async () => {
    type A = [boolean, string, HTMLElement | null];

    const [
      prop,
      attr,
      noDatepickerHeader,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.setAttribute('inline', '');

      await n.updateComplete;

      const datepickerHeader = n.shadowRoot!.querySelector(b) as HTMLDivElement | null;

      done([
        n.inline,
        n.getAttribute('inline'),
        datepickerHeader,
      ] as A);
    }, DATEPICKER_NAME, '.datepicker-header');

    strictEqual(prop, true);
    strictEqual(attr, '');
    strictEqual(noDatepickerHeader, null);
  });

  it(`renders with optional 'dragratio'`, async () => {
    type A = [number, string];

    const dragRatio = .5;
    const [
      prop,
      attr,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.setAttribute('dragratio', `${b}`);

      await n.updateComplete;

      done([
        n.dragRatio,
        n.getAttribute('dragratio'),
      ] as A);
    }, DATEPICKER_NAME, dragRatio);

    strictEqual(prop, dragRatio);
    strictEqual(attr, `${dragRatio}`);
  });

  it(`renders with defined 'weeklabel'`, async () => {
    type A = [string, string, string];

    const weekLabel  = '周数';
    const [
      prop,
      attr,
      weekNumberLabelContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeklabel', c);

      await n.updateComplete;

      const weekNumberLabel = n.shadowRoot!.querySelector(b) as HTMLTableCellElement;

      done([
        n.weekLabel,
        n.getAttribute('weeklabel'),
        weekNumberLabel.outerHTML,
      ] as A);
    }, DATEPICKER_NAME, toSelector(`th[aria-label="${weekLabel}"]`), weekLabel);

    allStrictEqual([prop, attr], weekLabel);
    strictEqual(
      cleanHtml(weekNumberLabelContent),
      prettyHtml`
      <th class="calendar-weekday" aria-label="周数">
        <div class="weekday">周数</div>
      </th>`
    );
  });

  it(`renders with different 'showweeknumber', 'firstdayofweek', and 'disableddays'`, async () => {
    type A = [number, string, string, string, boolean, string, string[]];

    const props: number[] = [];
    const attrs: string[] = [];
    const props2: string[] = [];
    const attrs2: string[] = [];
    const showWeekNumberProps: boolean[] = [];
    const focusedDateContents: string[] = [];
    const disabledDatesContents: string[][] = [];

    for (const showWeekNumber of [true, false]) {
      const [
        prop,
        attr,
        prop2,
        attr2,
        prop3,
        focusedDateContent,
        disabledDatesContent,
      ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
        const n = document.body.querySelector(a) as Datepicker;

        n.min = '2000-01-01';
        n.value = '2020-01-15';
        n.setAttribute('firstdayofweek', '2');
        n.setAttribute('disableddays', '1,5');

        if (b) {
          n.setAttribute('showweeknumber', '');
        } else {
          n.removeAttribute('showweeknumber');
        }

        await n.updateComplete;

        const root = n.shadowRoot!;

        const focusedDate = root.querySelector(c) as HTMLTableCellElement;
        const disabledDates = Array.from(
          root.querySelectorAll(d), o => o.outerHTML);

        done([
          n.firstDayOfWeek,
          n.getAttribute('firstdayofweek'),
          n.disabledDays,
          n.getAttribute('disableddays'),
          n.showWeekNumber,
          focusedDate.outerHTML,
          disabledDates,
        ] as A);
      },
      DATEPICKER_NAME,
      showWeekNumber,
      toSelector('tbody > tr:nth-of-type(3) > td:nth-of-type(2)'),
      toSelector('.day--disabled'));

      props.push(prop);
      attrs.push(attr);
      props2.push(prop2);
      attrs2.push(attr2);
      showWeekNumberProps.push(prop3);
      focusedDateContents.push(focusedDateContent);
      disabledDatesContents.push(disabledDatesContent);
    }

    allStrictEqual(props, 2);
    allStrictEqual(attrs, '2');
    allStrictEqual(props2.concat(attrs2), '1,5');
    deepStrictEqual(showWeekNumberProps, [true, false]);
    allStrictEqual(focusedDateContents.map(n => cleanHtml(n)), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 15, 2020" aria-selected="true">
      <div class="calendar-day">15</div>
    </td>
    `);

    const expectedDisabledDatesContent = [
      3, 6, 10, 13, 17, 20, 24, 27, 31,
    ].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-disabled="true" aria-label="Jan ${n}, 2020" aria-selected="false">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    });
    deepStrictEqual(disabledDatesContents[0].map(n => cleanHtml(n)), expectedDisabledDatesContent);
    deepStrictEqual(disabledDatesContents[1].map(n => cleanHtml(n)), expectedDisabledDatesContent);
  });

});
