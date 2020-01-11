import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { PrepareOptions } from '../custom_typings.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { sanitizeText } from '../helpers/sanitize-text.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  ok,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';
const cleanHtml =
  (s: string, showToday: boolean = false) => prettyHtml(sanitizeText(s, showToday));

describe('mouses', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';

  const clickElements = async (classes: string[], prepareOptions?: PrepareOptions) => {
    if (prepareOptions) {
      await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<AppDatepicker>(a)!;

        const { props, attrs }: PrepareOptions = b;

        if (props) {
          Object.keys(props).forEach((o) => {
            (n as any)[o] = (props as any)[o];
          });
        }

        if (attrs) {
          Object.keys(attrs).forEach((o) => {
            n.setAttribute(o.toLowerCase(), String((attrs as any)[o]));
          });
        }

        await n.updateComplete;

        done();
      }, elementName, prepareOptions);
    }

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
          const n = document.body.querySelector<AppDatepicker>(a)!;
          const n2: HTMLElement = n.shadowRoot!.querySelector(b)!;

          if (n2 instanceof HTMLButtonElement || n2.tagName === 'MWC-BUTTON') {
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
        const el = await $(elementName);
        const el2 = (await el.shadow$(cls)) as unknown as WebdriverIOAsync.Element;

        await el2.click();
      }
    }
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
    await clickElements(['.btn__year-selector']);

    const hasYearListView: boolean = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const yearListView = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done(yearListView != null);
    }, elementName, '.datepicker-body__year-list-view');

    ok(hasYearListView);
  });

  it(`switches to calendar view`, async () => {
    await clickElements(['.btn__calendar-selector'], {
      props: {
        startView: 'yearList',
      },
    });

    const hasCalendarView: boolean = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const calendarView = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done(calendarView != null);
    }, elementName, '.datepicker-body__calendar-view');

    ok(hasCalendarView);
  });

  it(`focuses date after navigating away when switching to calendar view`, async () => {
    type A = [boolean, string];

    await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
      `.btn__year-selector`,
    ]);

    const hasYearListView: boolean = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const yearListView = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done(yearListView != null);
    }, elementName, '.datepicker-body__year-list-view');

    await clickElements([`.btn__calendar-selector`]);

    const [
      hasCalendarView,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const calendarView = root.querySelector<HTMLDivElement>(b)!;
      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      done([
        calendarView != null,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    '.datepicker-body__calendar-view',
    toSelector('.day--focused'));

    allStrictEqual([hasYearListView, hasCalendarView], true);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2020">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`switches back to calendar view when new year is selected`, async () => {
    type A = [string, string, string, string[]];

    await clickElements([
      '.btn__year-selector',
      [
        `.year-list-view__list-item.year--selected`,
        `+ .year-list-view__list-item`,
        `+ .year-list-view__list-item`,
      ].join(' '),
    ]);

    const [
      prop,
      yearSelectorButtonContent,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const yearSelectorButton = root.querySelector<HTMLButtonElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        n.value,
        yearSelectorButton.outerHTML,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    '.btn__year-selector',
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    strictEqual(prop, '2022-02-20');
    strictEqual(cleanHtml(yearSelectorButtonContent), prettyHtml`
    <button class="btn__year-selector" data-view="yearList">2022</button>
    `);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">February 2022</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '', '', 1, 2, 3, 4, 5,
      6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26,
      27, 28, '', '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date in current month`, async () => {
    type A = [string, string];

    await clickElements([toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`)]);

    const [
      prop,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'));

    strictEqual(prop, '2020-02-13');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`selects new focused date in new month`, async () => {
    type A = [string, string];

    await clickElements([
      '.btn__month-selector[aria-label="Next month"]',
      toSelector(`.full-calendar__day[aria-label="Mar 18, 2020"]`),
    ]);

    const [
      focusedDateContent,
      calendarLabelContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const root = n.shadowRoot!;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;

      done([
        focusedDate.outerHTML,
        calendarLabel.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'), toSelector('.calendar-label'));

    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Mar 18, 2020">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
  });

  it(`does not show months before 'min'`, async () => {
    type A = [boolean, string, string[]];

    await clickElements([
      `.btn__month-selector[aria-label="Previous month"]`,
    ], {
      props: {
        min: '2020-01-01',
        value: '2020-02-02',
      },
    });

    const [
      noPrevMonthSelector,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const prevMonthSelector = root.querySelector<HTMLButtonElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        prevMonthSelector == null,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    `.btn__month-selector[aria-label="Previous month"]`,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day')
    );

    ok(noPrevMonthSelector);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">January 2020</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`does not show months after 'max'`, async () => {
    type A = [boolean, string, string[]];

    await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
    ], {
      props: {
        max: '2020-03-31',
        value: '2020-02-02',
      },
    });

    const [
      noNextMonthSelector,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const nextMonthSelector = root.querySelector<HTMLButtonElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        nextMonthSelector == null,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    `.btn__month-selector[aria-label="Next month"]`,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    ok(noNextMonthSelector);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`shows correct 'min' month when spam clicking previous month button`, async () => {
    type A = [boolean, string, string[]];

    await clickElements(Array.from('1234', () => (
      `.btn__month-selector[aria-label="Previous month"]`
    )), {
      props: {
        min: '2020-01-01',
        value: '2020-05-02',
      },
    });

    const [
      noPrevMonthSelector,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const prevMonthSelector = root.querySelector<HTMLButtonElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        prevMonthSelector == null,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    `.btn__month-selector[aria-label="Previous month"]`,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    ok(noPrevMonthSelector);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">January 2020</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`shows correct 'max' month when spam clicking next month button`, async () => {
    type A = [boolean, string, string[]];

    await clickElements(Array.from('1234', () => (
      `.btn__month-selector[aria-label="Next month"]`
    )), {
      props: {
        max: '2020-03-31',
        value: '2019-11-02',
      },
    });

    const [
      noNextMonthSelector,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const nextMonthSelector = root.querySelector<HTMLButtonElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        nextMonthSelector == null,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    `.btn__month-selector[aria-label="Next month"]`,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    ok(noNextMonthSelector);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  const updateYear = async (newYear: string, prepareOptions?: PrepareOptions) => {
    await clickElements([`.btn__year-selector`], prepareOptions);

    const yearIdx: number = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const allYears = Array.from(
        n.shadowRoot!.querySelectorAll<HTMLButtonElement>(b), o => o.textContent!);

      done(allYears.findIndex(o => o.trim() === c));
    }, elementName, `.year-list-view__list-item`, newYear);

    await clickElements([
      `.year-list-view__list-item${!yearIdx ? '' : `:nth-of-type(${1 + yearIdx})`}`,
    ]);
  };

  it(`focuses 'min' when focused date is before 'min' after updating the years`, async () => {
    type A = [string, string];

    await updateYear('2021', {
      props: {
        min: '2020-04-13',
        value: '2020-04-25',
      },
    });

    await clickElements([
      ...Array.from('123', () => `.btn__month-selector[aria-label="Previous month"]`),
      toSelector(`.full-calendar__day[aria-label="Jan 15, 2021"]`),
    ]);

    await updateYear('2020');

    const [
      prop,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'));

    strictEqual(prop, '2020-04-13');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`focuses 'max' when focused date is after 'max' after updating the years`, async () => {
    type A = [string, string];

    await updateYear('2019', {
      props: {
        max: '2020-04-25',
        value: '2020-04-13',
      },
    });

    await clickElements([
      ...Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`),
      toSelector(`.full-calendar__day[aria-label="Jul 15, 2019"]`),
    ]);

    await updateYear('2020');

    const [
      prop,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'));

    strictEqual(prop, '2020-04-25');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 25, 2020">
      <div class="calendar-day">25</div>
    </td>
    `);
  });

  it(`updates focused date in landscape mode after navigating months`, async () => {
    type A = [string, string];

    await clickElements([
      `.btn__month-selector[aria-label="Next month"]`,
      ...Array.from('12', () => `.btn__month-selector[aria-label="Previous month"]`),
      toSelector(`.full-calendar__day[aria-label="Jan 15, 2020"]`),
    ]);

    const [
      prop,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'));

    strictEqual(prop, '2020-01-15');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  const queryCalendarLabel = async () => {
    const label: string = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const n2 = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done(n2.textContent);
    }, elementName, toSelector('.calendar-label'));

    return sanitizeText(label);
  };

  it(`resets month after updating 'value' and 'firstDayOfWeek'`, async () => {
    type A = [string, string[]];

    await clickElements(
      Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const calendarLabelContent = await queryCalendarLabel();

    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.firstDayOfWeek = 2;
      n.value = '2020-02-13';

      await n.updateComplete;

      done();
    }, elementName);

    const calendarLabelContent2 = await queryCalendarLabel();

    await clickElements(
      Array.from('12', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const [
      calendarLabelContent3,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const calendarLabel3 = root.querySelector<HTMLDivElement>(b)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(c), o => o.textContent);

      done([
        calendarLabel3.textContent,
        calendarDays,
      ] as A);
    }, elementName, toSelector('.calendar-label'), toSelector('.full-calendar__day'));

    strictEqual(calendarLabelContent, `May 2020`);
    strictEqual(calendarLabelContent2, `February 2020`);
    strictEqual(calendarLabelContent3, `April 2020`);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '',  1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`resets month after setting 'value' and 'firstdayofweek' attributes`, async () => {
    type A = [string, string[]];

    await clickElements(
      Array.from('123', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const calendarLabelContent = await queryCalendarLabel();

    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.setAttribute('firstdayofweek', '2');
      n.setAttribute('value', '2020-02-13');

      await n.updateComplete;

      done();
    }, elementName);

    const calendarLabelContent2 = await queryCalendarLabel();

    await clickElements(
      Array.from('12', () => `.btn__month-selector[aria-label="Next month"]`)
    );

    const [
      calendarLabelContent3,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const calendarLabel3 = root.querySelector<HTMLDivElement>(b)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(c), o => o.textContent);

      done([
        calendarLabel3.textContent,
        calendarDays,
      ] as A);
    }, elementName, toSelector('.calendar-label'), toSelector('.full-calendar__day'));

    strictEqual(calendarLabelContent, `May 2020`);
    strictEqual(calendarLabelContent2, `February 2020`);
    strictEqual(calendarLabelContent3, `April 2020`);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '',  1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date with optional 'locale'`, async () => {
    type A = [string, string, string, string[]];

    await clickElements([
      toSelector(`.full-calendar__day[aria-label="2020年2月13日"]`),
    ], {
      props: {
        locale: 'ja-JP',
      },
    });

    const [
      prop,
      focusedDateContent,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const root = n.shadowRoot!;

      const focusedDate = root.querySelector<HTMLTableCellElement>(b)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        n.value,
        focusedDate.outerHTML,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    toSelector('.day--focused'),
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    strictEqual(prop, '2020-02-13');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="2020年2月13日">
      <div class="calendar-day">13日</div>
    </td>
    `);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">2020年2月</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => sanitizeText(n.trim())), [
      '', '', '', '', '', '', 1,
      2, 3, 4, 5, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29,
      '', '', '', '', '', '', '',
    ].map(n => n && `${n}日`));
  });

});
