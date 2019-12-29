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
  deepStrictEqual, ok, strictEqual
} from '../helpers/typed-assert.js';

describe('mouses', () => {
  const elementName = 'app-datepicker';
  const isSafari = browser.capabilities.browserName === 'Safari';
  const clickElements = async (classes: string[]) => {
    /**
     * NOTE: [20191229] Due to a bug in Safari 13, Safari is not able
     * to recognize any clicks but it has yet to release the patch to
     * stable Safari and any older versions of Safari. As of writing,
     * only Safari TP has it fixed.
     *
     * Therefore, this helper is here to imperatively calling `.click()`
     * in the browser the tests run when it detects a Safari browser.
     *
     * @see https://bugs.webkit.org/show_bug.cgi?id=202589
     */
    for (const cls of classes) {
      if (isSafari) {
        await browser.executeAsync(async (a, b, done) => {
          const n: AppDatepicker = document.body.querySelector(a)!;
          const n2: HTMLElement = n.shadowRoot!.querySelector(b)!;

          if (n2 instanceof HTMLButtonElement) {
            n2.click();
          } else {
            // Simulate click event on non natively focusable elements.
            // This is for selecting new focused date in the table.
            ['touchstart', 'touchend'].forEach((o) => {
              n2.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
            });
          }

          await n.updateComplete;

          done();
        }, elementName, cls);
      } else {
        const el = await queryEl(elementName);
        const el2 = await shadowQuery(el, [cls]);

        await el2.click();
      }
    }

    return queryEl(elementName, async (done) => {
      const n: AppDatepicker = document.body.querySelector('app-datepicker')!;

      await n.updateComplete;

      done();
    });
  };

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-02-20';

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`switches to year list view`, async () => {
    const el = await clickElements(['.btn__year-selector']);

    const yearListView = await shadowQuery(el, ['.datepicker-body__year-list-view']);

    ok(await yearListView.isExisting());
  });

  it(`switches to calendar view`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.startView = 'yearList';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements(['.btn__calendar-selector']);

    const calendarView = await shadowQuery(el, ['.datepicker-body__calendar-view']);

    ok(await calendarView.isExisting());
  });

  it(`focuses date after navigating away when switching to calendar view`, async () => {
    let el = await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
      `.btn__year-selector`,
    ]);

    const yearListView = await shadowQuery(el, ['.datepicker-body__year-list-view']);

    ok(await yearListView.isExisting());

    el = await clickElements([`.btn__calendar-selector`]);

    const calendarView = await shadowQuery(el, ['.datepicker-body__calendar-view']);
    const focusedDate = await shadowQuery(el, [
      '.calendar-container:nth-of-type(2)',
      '.day--focused',
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    ok(await calendarView.isExisting());
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2020">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`switches back to calendar view when new year is selected`, async () => {
    const valueProp = await getProp<string>(elementName, 'value');

    const el = await clickElements([
      '.btn__year-selector',
      [
        `.year-list-view__list-item.year--selected`,
        `+ .year-list-view__list-item`,
        `+ .year-list-view__list-item`,
      ].join(' '),
    ]);

    const yearSelectorButton = await shadowQuery(el, ['.btn__year-selector']);
    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const yearSelectorButtonContent = await cleanHtml(yearSelectorButton);
    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    const valueProp2 = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2022-02-20');

    strictEqual(yearSelectorButtonContent, prettyHtml`
    <button class="btn__year-selector" data-view="yearList">2022</button>
    `);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">February 2022</div>
    `);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      '', '', 1, 2, 3, 4, 5,
      6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26,
      27, 28, '', '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date in current month`, async () => {
    const el = await clickElements([
      [
        `.calendar-container:nth-of-type(2)`,
        `.full-calendar__day[aria-label="Feb 13, 2020"]`,
      ].join(' '),
    ]);

    const newFocusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const newFocusedDateContent = await cleanHtml(newFocusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-13');
    strictEqual(newFocusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`selects new focused date in new month`, async () => {
    const el = await clickElements([
      '.btn__month-selector[aria-label="Next month"]',
      [
        `.calendar-container:nth-of-type(2)`,
        `.full-calendar__day[aria-label="Mar 18, 2020"]`,
      ].join(' '),
    ]);

    const newFocusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);
    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);

    const newFocusedDateContent = await cleanHtml(newFocusedDate);
    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);

    strictEqual(newFocusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Mar 18, 2020">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
  });

  it(`does not show months before 'min'`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.min = '2020-01-01';
      n.value = '2020-02-02';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements([
      `.btn__month-selector[aria-label="Previous month"]`,
    ]);

    const hasPrevMonthSelector = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;
      const n2: HTMLButtonElement = n.shadowRoot!.querySelector(b);

      done(n2?.nodeType === Node.ELEMENT_NODE);
    }, elementName, `.btn__month-selector[aria-label="Previous month"]`);

    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    strictEqual(hasPrevMonthSelector, false);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">January 2020</div>
    `);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`does not show months after 'max'`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.max = '2020-03-31';
      n.value = '2020-02-02';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
    ]);

    const hasNextMonthSelector = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;
      const n2: HTMLButtonElement = n.shadowRoot!.querySelector(b);

      done(n2?.nodeType === Node.ELEMENT_NODE);
    }, elementName, `.btn__month-selector[aria-label="Next month"]`);

    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    strictEqual(hasNextMonthSelector, false);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`shows correct 'min' month when spam clicking previous month button`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.min = '2020-01-01';
      n.value = '2020-05-02';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements(Array.from('1234', () => (
      `.btn__month-selector[aria-label="Previous month"]`
    )));

    const hasPrevMonthSelector = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;
      const n2: HTMLButtonElement = n.shadowRoot!.querySelector(b);

      done(n2?.nodeType === Node.ELEMENT_NODE);
    }, elementName, `.btn__month-selector[aria-label="Previous month"]`);

    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    strictEqual(hasPrevMonthSelector, false);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">January 2020</div>
    `);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`shows correct 'max' month when spam clicking next month button`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.max = '2020-03-31';
      n.value = '2019-11-02';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements(Array.from('1234', () => (
      `.btn__month-selector[aria-label="Next month"]`
    )));

    const hasNextMonthSelector = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;
      const n2: HTMLButtonElement = n.shadowRoot!.querySelector(b);

      done(n2?.nodeType === Node.ELEMENT_NODE);
    }, elementName, `.btn__month-selector[aria-label="Next month"]`);

    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    strictEqual(hasNextMonthSelector, false);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`focuses 'min' when focused date is before 'min' after updating the years`, async () => {
    const updateYear = async (a: string) => {
      const n = await clickElements([`.btn__year-selector`]);

      const allYears = await shadowQueryAll(n, [`.year-list-view__list-item`]);
      const allYearsContents = await Promise.all(allYears.map(cleanText));
      const yearIdx = allYearsContents.findIndex(o => o.trim() === a);

      return clickElements([
        `.year-list-view__list-item${!yearIdx ? '' : `:nth-of-type(${1 + yearIdx})`}`,
      ]);
    };

    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.min = '2020-04-13';
      n.value = '2020-04-25';

      await n.updateComplete;

      done();
    }, elementName);

    await updateYear('2021');

    await clickElements([
      ...Array.from('123', () => `.btn__month-selector[aria-label="Previous month"]`),
      [
        `.calendar-container:nth-of-type(2)`,
        `.full-calendar__day[aria-label="Jan 15, 2021"]`,
      ].join(' '),
    ]);

    const el = await updateYear('2020');

    const focusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-04-13');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`focuses 'max' when focused date is after 'max' after updating the years`, async () => {
    const updateYear = async (a: string) => {
      const n = await clickElements([`.btn__year-selector`]);

      const allYears = await shadowQueryAll(n, [`.year-list-view__list-item`]);
      const allYearsContents = await Promise.all(allYears.map(cleanText));
      const yearIdx = allYearsContents.findIndex(o => o.trim() === a);

      return clickElements([
        `.year-list-view__list-item${!yearIdx ? '' : `:nth-of-type(${1 + yearIdx})`}`,
      ]);
    };

    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.max = '2020-04-25';
      n.value = '2020-04-13';

      await n.updateComplete;

      done();
    }, elementName);

    await updateYear('2019');

    await clickElements([
      ...Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`),
      [
        `.calendar-container:nth-of-type(2)`,
        `.full-calendar__day[aria-label="Jul 15, 2019"]`,
      ].join(' '),
    ]);

    const el = await updateYear('2020');

    const focusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-04-25');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 25, 2020">
      <div class="calendar-day">25</div>
    </td>
    `);
  });

  it(`updates focused date in landscape mode after navigating months`, async () => {
    const el = await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
      ...Array.from('12', () => `.btn__month-selector[aria-label="Previous month"]`),
      [
        `.calendar-container:nth-of-type(2)`,
        `.full-calendar__day[aria-label="Jan 15, 2020"]`,
      ].join(' '),
    ]);

    const focusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-01-15');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`resets month after updating 'value' and 'firstDayOfWeek'`, async () => {
    const queryCalendarLabel = async (a: WebdriverIOAsync.Element) => {
      return shadowQuery(a, [
        `.calendar-container:nth-of-type(2)`,
        `.calendar-label`,
      ]);
    };

    let el = await clickElements(
      Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const currentCalendarLabel = await queryCalendarLabel(el);
    const currentCalendarLabelContent = await cleanText(currentCalendarLabel);

    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.firstDayOfWeek = 2;
      n.value = '2020-02-13';

      await n.updateComplete;

      done();
    }, elementName);

    const currentCalendarLabel2 = await queryCalendarLabel(el);
    const currentCalendarLabel2Content = await cleanText(currentCalendarLabel2);

    el = await clickElements(
      Array.from('12', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const currentCalendarLabel3 = await queryCalendarLabel(el);
    const currentCalendarLabel3Content = await cleanText(currentCalendarLabel3);

    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    strictEqual(currentCalendarLabelContent, `May 2020`);
    strictEqual(currentCalendarLabel2Content, `February 2020`);
    strictEqual(currentCalendarLabel3Content, `April 2020`);
    deepStrictEqual(calendarDaysContent.map(n => n.trim()), [
      '',  1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`resets month after setting 'value' and 'firstdayofweek' attributes`, async () => {
    const queryCalendarLabel = async (a: WebdriverIOAsync.Element) => {
      return shadowQuery(a, [
        `.calendar-container:nth-of-type(2)`,
        `.calendar-label`,
      ]);
    };

    let el = await clickElements(
      Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const currentCalendarLabel = await queryCalendarLabel(el);
    const currentCalendarLabelContent = await cleanText(currentCalendarLabel);

    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.setAttribute('firstdayofweek', '2');
      n.setAttribute('value', '2020-02-13');

      await n.updateComplete;

      done();
    }, elementName);

    const currentCalendarLabel2 = await queryCalendarLabel(el);
    const currentCalendarLabel2Content = await cleanText(currentCalendarLabel2);

    el = await clickElements(
      Array.from('12', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const currentCalendarLabel3 = await queryCalendarLabel(el);
    const currentCalendarLabel3Content = await cleanText(currentCalendarLabel3);

    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);
    const calendarDaysContents = await Promise.all(calendarDays.map(cleanText));

    strictEqual(currentCalendarLabelContent, `May 2020`);
    strictEqual(currentCalendarLabel2Content, `February 2020`);
    strictEqual(currentCalendarLabel3Content, `April 2020`);
    deepStrictEqual(calendarDaysContents.map(n => n.trim()), [
      '',  1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date with optional 'locale'`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.body.querySelector(a)!;

      n.locale = 'ja-JP';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await clickElements([
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day[aria-label="2020年2月13日"]`,
    ]);

    const focusedDate = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);
    const currentCalendarLabel = await shadowQuery(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);
    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContents = await Promise.all(calendarDays.map(cleanText));

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-13');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="2020年2月13日">
      <div class="calendar-day">13日</div>
    </td>
    `);
    strictEqual(currentCalendarLabelContent, prettyHtml`
    <div class="calendar-label">2020年2月</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => n.trim()), [
      '', '', '', '', '', '', 1,
      2, 3, 4, 5, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29,
      '', '', '', '', '', '', '',
    ].map(n => n && `${n}日`));
  });

});
