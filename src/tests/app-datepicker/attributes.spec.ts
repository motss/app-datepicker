import {
  deepStrictEqual,
  ok,
  strictEqual,
} from 'assert';

import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { getAttr } from '../helpers/get-attr.js';
import { getProp } from '../helpers/get-prop.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { queryEl } from '../helpers/query-el.js';

describe('attributes', () => {
  before(async () => {
    await browser.url(`http://localhost:4343/src/tests/index.html`);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (done) => {
      const el: AppDatepicker = document.createElement('app-datepicker');

      document.body.appendChild(el);
      await el.updateComplete;

      done();
    });
  });

  afterEach(async () => {
    await browser.executeAsync((done) => {
      const el = document.body.querySelector('app-datepicker')!;

      document.body.removeChild(el);

      done();
    });
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(`./src/tests/snapshots/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (done) => {
      const el = document.body.querySelector('app-datepicker')!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';
      await el.updateComplete;

      done();
    });

    $('app-datepicker');

    await browser.saveScreenshot(`./src/tests/snapshots/attributes-1-${browserName}.png`);
  });

  it(`renders with defined 'min'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-17';
      n.setAttribute('min', '2020-01-15');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$('.day--disabled');
    const lastDisabledDate = disabledDates[disabledDates.length - 1];
    const lastDisabledDateContent = await cleanHtml(lastDisabledDate);

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);
    const minVal = await getProp<string>('app-datepicker', 'min');

    strictEqual(minVal, '2020-01-15');
    strictEqual(await el.getAttribute('min'), '2020-01-15');
    strictEqual(lastDisabledDateContent, prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 14, 2020">
      <div class="calendar-day">14</div>
    </td>
    `);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 17, 2020">
      <div class="calendar-day">17</div>
    </td>
    `);
  });

  it(`renders with defined 'max'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.min = '2000-01-01';
      n.setAttribute('max', '2020-01-17');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$('.day--disabled');
    const firstDisabledDate = disabledDates[0];
    const firstDisabledDateContent = await cleanHtml(firstDisabledDate);

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);
    const maxVal = await getProp<string>('app-datepicker', 'max');

    strictEqual(maxVal, '2020-01-17');
    strictEqual(await el.getAttribute('max'), '2020-01-17');
    strictEqual(firstDisabledDateContent, prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 18, 2020">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'value'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.max = '2020-12-31';
      n.setAttribute('value', '2020-01-15');
      await n.updateComplete;

      done();
    });

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);
    const valueVal = await getProp<string>('app-datepicker', 'value');
    const valueAttr = await el.getAttribute('value');

    strictEqual(valueVal, '2020-01-15');
    strictEqual(valueAttr, '2020-01-15');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'startview'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.setAttribute('startview', 'yearList' as StartView);
      await n.updateComplete;

      done();
    });
    const startViewVal = await getProp<string>('app-datepicker', 'startView');

    const startViewAttr = await el.getAttribute('startview');
    const yearListView = await el.shadow$('.datepicker-body__year-list-view');

    strictEqual(startViewVal, 'yearList' as StartView);
    strictEqual(startViewAttr, 'yearList' as StartView);
    ok(yearListView);
  });

  it(`renders with defined 'firstdayofweek'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('firstdayofweek', '2');
      await n.updateComplete;

      done();
    });

    const firstWeekdayLabel = await el.shadow$('.calendar-container:nth-of-type(2) th');
    const firstWeekdayLabelContent = await cleanHtml(firstWeekdayLabel);
    const focusedDate = await el.shadow$([
      '.calendar-container:nth-of-type(2)',
      'tbody > tr:nth-of-type(3) > td:nth-of-type(2)',
    ].join(' '));
    const focusedDateContent = await cleanHtml(focusedDate);
    const firstDayOfWeekVal = await getProp<number>('app-datepicker', 'firstDayOfWeek');
    const firstDayOfWeekAttr = await el.getAttribute('firstdayofweek');

    strictEqual(firstDayOfWeekVal, 2);
    strictEqual(firstDayOfWeekAttr, '2');
    strictEqual(firstWeekdayLabelContent, prettyHtml`
      <th aria-label="Tuesday">T</th>
    `);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'showweeknumber'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.setAttribute('showweeknumber', '');
      await n.updateComplete;

      done();
    });

    const weekNumberLabel = await el.shadow$([
      '.calendar-container:nth-of-type(2)',
      'th[aria-label="Week"]',
    ].join(' '));
    const weekNumberLabelContent = await cleanHtml(weekNumberLabel);

    const weekNumbers = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      'tbody > tr > td:first-of-type',
    ].join(' '));
    const weekNumbersContents = await Promise.all(weekNumbers.map(cleanHtml));

    const showWeekNumberVal = await getProp<boolean>('app-datepicker', 'showWeekNumber');
    const showWeekNumberAttr = await el.getAttribute('showweeknumber');

    strictEqual(showWeekNumberVal, true);
    strictEqual(showWeekNumberAttr, '');
    strictEqual(weekNumberLabelContent, prettyHtml`<th aria-label="Week">Wk</th>`);
    deepStrictEqual(weekNumbersContents, [
      ...([1, 2, 3, 4, 5].map((n) => {
        return prettyHtml(
          `<td class="full-calendar__day weekday-label" aria-label="Week ${n}">${n}</td>`
        );
      })),
      `<td class="full-calendar__day day--empty"></td>`,
    ]);
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeknumbertype', 'first-full-week' as WeekNumberType);
      await n.updateComplete;

      done();
    });

    const weekNumbers = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      'tbody > tr >td:first-of-type',
    ].join(' '));
    const weekNumbersContents = await Promise.all(weekNumbers.map(cleanHtml));

    const weekNumberTypeVal = await getProp<string>('app-datepicker', 'weekNumberType');
    const weekNumberTypeAttr = await el.getAttribute('weeknumbertype');

    strictEqual(weekNumberTypeVal, 'first-full-week' as WeekNumberType);
    strictEqual(weekNumberTypeAttr, 'first-full-week' as WeekNumberType);
    deepStrictEqual(weekNumbersContents, [
      ...([52, 1, 2, 3, 4].map((n) => {
        return prettyHtml(
          `<td class="full-calendar__day weekday-label" aria-label="Week ${n}">${n}</td>`
        );
      })),
      `<td class="full-calendar__day day--empty"></td>`,
    ]);

  });

  it(`renders with defined 'landscape'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.setAttribute('landscape', '');
      await n.updateComplete;

      done();
    });

    const landscapeVal = await getProp<boolean>('app-datepicker', 'landscape');
    const landscapeAttr = await getAttr<string>('app-datepicker', 'landscape');
    // FIXME: For unknown reason, expecting 'landscape' to be '' but received 'true'.
    // const landscapeAttr = await el.getAttribute('landscape');
    const cssDisplay = await el.getCSSProperty('display');

    strictEqual(landscapeVal, true);
    strictEqual(landscapeAttr, '');
    strictEqual(cssDisplay.value, 'flex');
  });

  it(`renders with defined 'locale'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.setAttribute('locale', 'ja-JP');
      await n.updateComplete;

      done();
    });

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);

    const weekdayLabels = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      '.calendar-weekdays > th',
    ].join(' '));
    const weekdayLabelsContents = await Promise.all(weekdayLabels.map(cleanHtml));

    const localeVal = await getProp<string>('app-datepicker', 'locale');
    const localeAttr = await el.getAttribute('locale');

    strictEqual(localeVal, 'ja-JP');
    strictEqual(localeAttr, 'ja-JP');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="2020年1月15日">
      <div class="calendar-day">15日</div>
    </td>
    `);
    deepStrictEqual(weekdayLabelsContents, [
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
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddays', '1,5');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      '.day--disabled',
    ].join(' '));
    const disabledDateContents = await Promise.all(disabledDates.map(cleanHtml));

    const disabledDaysVal = await getProp<string>('app-datepicker', 'disabledDays');
    const disabledDaysAttr = await el.getAttribute('disableddays');

    strictEqual(disabledDaysVal, '1,5');
    strictEqual(disabledDaysAttr, '1,5');
    deepStrictEqual(disabledDateContents, [3, 6, 10, 13, 17, 20, 24, 27, 31].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

  it(`renders with defined 'disableddates'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('disableddates', [
        '2020-01-03',
        '2020-01-09',
        '2020-01-21',
        '2020-01-27',
      ].join(','));
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      '.day--disabled',
    ].join(' '));
    const disabledDateContents = await Promise.all(disabledDates.map(cleanHtml));

    const disabledDatesVal = await getProp<string>('app-datepicker', 'disabledDates');
    const disabledDatesAttr = await el.getAttribute('disableddates');

    strictEqual(disabledDatesVal, [
      '2020-01-03',
      '2020-01-09',
      '2020-01-21',
      '2020-01-27',
    ].join(','));
    strictEqual(disabledDatesAttr, [
      '2020-01-03',
      '2020-01-09',
      '2020-01-21',
      '2020-01-27',
    ].join(','));
    deepStrictEqual(disabledDateContents, [3, 9, 21, 27].map((n) => {
      return prettyHtml(`
      <td class="full-calendar__day day--disabled" aria-label="Jan ${n}, 2020">
        <div class="calendar-day">${n}</div>
      </td>
      `);
    }));
  });

  it(`renders with optional 'weeklabel'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.showWeekNumber = true;
      n.setAttribute('weeklabel', '周数');
      await n.updateComplete;

      done();
    });

    const weekNumberLabel = await el.shadow$([
      `.calendar-container:nth-of-type(2)`,
      `th[aria-label="周数"]`,
    ].join(' '));
    const weekNumberLabelContent = await cleanHtml(weekNumberLabel);

    const weekLabelVal = await getProp<string>('app-datepicker', 'weekLabel');
    const weekLabelAttr = await el.getAttribute('weeklabel');

    strictEqual(weekLabelVal, '周数');
    strictEqual(weekLabelAttr, '周数');
    strictEqual(weekNumberLabelContent, prettyHtml`<th aria-label="周数">周数</th>`);
  });

  it(`renders with different 'firstdayofweek' and 'disableddays'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.value = '2020-01-15';
      n.setAttribute('firstdayofweek', '2');
      n.setAttribute('disableddays', '1,5');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$([
      '.calendar-container:nth-of-type(2)',
      '.day--disabled',
    ].join(' '));
    const disabledDateContents = await Promise.all(disabledDates.map(cleanHtml));

    const focusedDate = await el.shadow$([
      '.calendar-container:nth-of-type(2)',
      'tbody > tr:nth-of-type(3) > td:nth-of-type(2)',
    ].join(' '));
    const focusedDateContent = await cleanHtml(focusedDate);

    const firstDayOfWeekVal = await getProp<number>('app-datepicker', 'firstDayOfWeek');
    const firstDayOfWeekAttr = await el.getAttribute('firstdayofweek');
    const disabledDaysVal = await getProp<string>('app-datepicker', 'disabledDays');
    const disabledDaysAttr = await el.getAttribute('disableddays');

    strictEqual(firstDayOfWeekVal, 2);
    strictEqual(firstDayOfWeekAttr, '2');
    strictEqual(disabledDaysVal, '1,5');
    strictEqual(disabledDaysAttr, '1,5');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
    deepStrictEqual(disabledDateContents, [
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
