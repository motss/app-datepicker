import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
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

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';
const cleanHtml =
  (s: string, showToday: boolean = false) => prettyHtml(sanitizeText(s, showToday));

describe(`${elementName}::mouses`, () => {
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
        await browser.executeAsync(async (a, b, c, done) => {
          const n = document.body.querySelector<AppDatepickerDialog>(a)!;
          const n2 = document.body.querySelector<AppDatepicker>(b)!;
          const n3 = n2.shadowRoot!.querySelector<HTMLElement>(c)!;

          if (n3 instanceof HTMLButtonElement || n3.tagName === 'MWC-BUTTON') {
            n3.click();
          } else {
            // Simulate click event on non natively focusable elements.
            // This is for selecting new focused date in the table.
            ['touchstart', 'touchend'].forEach((o) => {
              n3.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
            });
          }

          await n.updateComplete;

          done();
        }, elementName, elementName2, cls);
      } else {
        const el = await $(elementName);
        const el2 = (await el.shadow$(elementName2)) as unknown as WebdriverIOAsync.Element;
        const el3 = (await el2.shadow$(cls)) as unknown as WebdriverIOAsync.Element;

        await el3.click();
      }
    }
  };

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-02-20';

      document.body.appendChild(el);

      await el.open();
      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<AppDatepickerDialog>(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`switches to year list view`, async () => {
    await clickElements(['.btn__year-selector']);

    const hasYearListView: boolean = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const yearListView = n2.shadowRoot!.querySelector<HTMLDivElement>(c);

      done(yearListView != null);
    }, elementName, elementName2, '.datepicker-body__year-list-view');

    ok(hasYearListView);
  });

  it(`switches to calendar view`, async () => {
    await clickElements(['.btn__calendar-selector'], {
      props: {
        startView: 'yearList',
      },
    });

    const hasCalendarView: boolean = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const calendarView = n2.shadowRoot!.querySelector<HTMLDivElement>(c);

      done(calendarView != null);
    }, elementName, elementName2, '.datepicker-body__calendar-view');

    ok(hasCalendarView);
  });

  it(`selects new year`, async () => {
    type A = [string, string, string, string, string[]];

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
      prop2,
      yearSelectorButtonContent,
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, e, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const root = n2.shadowRoot!;

      const yearSelectorButton = root.querySelector<HTMLButtonElement>(c)!;
      const calendarLabel = root.querySelector<HTMLDivElement>(d)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(e), o => o.textContent);

      done([
        n.value,
        n2.value,
        yearSelectorButton.outerHTML,
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    elementName2,
    '.btn__year-selector',
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2022-02-20');

    strictEqual(cleanHtml(yearSelectorButtonContent), prettyHtml`
    <button class="btn__year-selector" data-view="yearList">2022</button>
    `);
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">February 2022</div>
    `);
    deepStrictEqual(calendarDaysContents.map(n => cleanHtml(n.trim())), [
      '', '', 1, 2, 3, 4, 5,
      6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26,
      27, 28, '', '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`navigates to next month`, async () => {
    type A = [string, string[]];

    await clickElements([`.btn__month-selector[aria-label="Next month"]`]);

    const [
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const root = n2.shadowRoot!;

      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    elementName2,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    strictEqual(
      cleanHtml(calendarLabelContent),
      prettyHtml`<div class="calendar-label">March 2020</div>`
    );
    deepStrictEqual(calendarDaysContents.map(n => cleanHtml(n.trim())), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`navigates to previous month`, async () => {
    type A = [string, string[]];

    await clickElements([`.btn__month-selector[aria-label="Previous month"]`]);

    const [
      calendarLabelContent,
      calendarDaysContents,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const root = n2.shadowRoot!;

      const calendarLabel = root.querySelector<HTMLDivElement>(c)!;
      const calendarDays = Array.from(
        root.querySelectorAll<HTMLTableCellElement>(d), o => o.textContent);

      done([
        calendarLabel.outerHTML,
        calendarDays,
      ] as A);
    },
    elementName,
    elementName2,
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    strictEqual(
      cleanHtml(calendarLabelContent),
      prettyHtml`<div class="calendar-label">January 2020</div>`
    );
    deepStrictEqual(calendarDaysContents.map(n => cleanHtml(n.trim())), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date`, async () => {
    type A = [string, string, string];

    await clickElements([
      toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`),
    ]);

    const [
      prop,
      prop2,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const root = n2.shadowRoot!;

      const focusedDate = root.querySelector<HTMLTableCellElement>(c)!;

      done([
        n.value,
        n2.value,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    elementName2,
    toSelector('.day--focused'));

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-13');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`closes dialog when dismiss button is clicked`, async () => {
    type A = [string, string];

    const [
      cssDisplay,
      ariaHiddenAttr,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      const dialogDismissButton = n.shadowRoot!.querySelector<HTMLElement>(b)!;

      const dialogClosed = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-dialog-closed', handler);
        }
        n.addEventListener('datepicker-dialog-closed', handler);

        timer = window.setTimeout(() => yay(false), 15e3);
      });

      dialogDismissButton.click();

      await n.updateComplete;
      await dialogClosed;

      done([
        getComputedStyle(n).display,
        n.getAttribute('aria-hidden'),
      ] as A);
    }, elementName, `.actions-container > mwc-button[dialog-dismiss]`);

    strictEqual(cssDisplay, 'none');
    strictEqual(ariaHiddenAttr, 'true');
  });

  it(`closes dialog with new focused date when confirm button is clicked`, async () => {
    type A = [string, string, string, string, string, string];

    await clickElements([
      toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`),
    ]);

    const [
      prop,
      prop2,
      prop3,
      cssDisplay,
      ariaHiddenAttr,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const root = n.shadowRoot!;

      const dialogConfirmButton = root.querySelector<HTMLElement>(c)!;
      const n2 = root.querySelector<AppDatepicker>(b)!;

      const focusedDate = n2.shadowRoot!.querySelector<HTMLTableCellElement>(d)!;

      const propVal = n.value;
      const propVal2 = n2.value;
      const focusedDateVal = focusedDate.outerHTML;

      const dialogClosed = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-dialog-closed', handler);
        }
        n.addEventListener('datepicker-dialog-closed', handler);

        timer = window.setTimeout(() => yay(false), 15e3);
      });

      dialogConfirmButton.click();

      await n.updateComplete;
      await dialogClosed;

      done([
        propVal,
        propVal2,
        n.value,

        getComputedStyle(n).display,
        n.getAttribute('aria-hidden'),
        focusedDateVal,
      ] as A);
    },
    elementName,
    elementName2,
    `.actions-container > mwc-button[dialog-confirm]`,
    toSelector('.day--focused'));

    strictEqual(prop, '2020-02-20');
    allStrictEqual([prop2, prop3], '2020-02-13');
    strictEqual(cssDisplay, 'none');
    strictEqual(ariaHiddenAttr, 'true');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

});
