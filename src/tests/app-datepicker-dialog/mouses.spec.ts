import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
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

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::mouses`, () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const clickElements = async (
    classes: string[],
    dialogOnly: boolean = false
  ): Promise<WebdriverIOAsync.Element> => {
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
        await browser.executeAsync(async (a, b, c, d, done) => {
          const n = document.body.querySelector<AppDatepickerDialog>(a)!;

          const n2 = d ? n : n.shadowRoot!.querySelector<AppDatepicker>(b)!;
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
        }, elementName, elementName2, cls, dialogOnly);
      } else {
        const el = await queryEl(elementName);
        const el2 = dialogOnly ? el : await shadowQuery(el, [elementName2]);
        const el3 = await shadowQuery(el2, [cls]);

        await el3.click();
      }
    }

    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      await n.updateComplete;

      done();
    }, elementName);

    return $(elementName);
  };
  const getProp2 = async <T>(propName: string): Promise<T> => {
    return browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done((n2 as any)[c]);
    }, elementName, elementName2, propName);
  };
  const shadowQuery2 = async (
    root: WebdriverIOAsync.Element,
    selectors: string[]
  ): Promise<WebdriverIOAsync.Element> => {
    const n = await shadowQuery(root, [elementName2]);
    const n2 = await shadowQuery(n, selectors);

    return n2;
  };
  const shadowQueryAll2 = async (
    root: WebdriverIOAsync.Element,
    selectors: string[]
  ): Promise<WebdriverIOAsync.ElementArray> => {
    const n = await shadowQuery(root, [elementName2]);
    const n2s = await shadowQueryAll(n, selectors);

    return n2s;
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
    const el = await clickElements(['.btn__year-selector']);

    const yearListView = await shadowQuery2(el, ['.datepicker-body__year-list-view']);

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

    const calendarView = await shadowQuery2(el, ['.datepicker-body__calendar-view']);

    ok(await calendarView.isExisting());
  });

  it(`selects new year`, async () => {
    const valueProp = await getProp<string>(elementName, 'value');

    const el = await clickElements([
      '.btn__year-selector',
      [
        `.year-list-view__list-item.year--selected`,
        `+ .year-list-view__list-item`,
        `+ .year-list-view__list-item`,
      ].join(' '),
    ]);

    const yearSelectorButton = await shadowQuery2(el, ['.btn__year-selector']);
    const currentCalendarLabel = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const yearSelectorButtonContent = await cleanHtml(yearSelectorButton);
    const currentCalendarLabelContent = await cleanHtml(currentCalendarLabel);
    const calendarDaysContent = await Promise.all(calendarDays.map(cleanText));

    const valueProp2 = await getProp2<string>('value');

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

  it(`navigates to next month`, async () => {
    const el = await clickElements([`.btn__month-selector[aria-label="Next month"]`]);

    const calendarLabel = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const calendarLabelContent = await cleanHtml(calendarLabel);
    const calendarDaysContents = await Promise.all(calendarDays.map(cleanText));

    strictEqual(calendarLabelContent, prettyHtml`<div class="calendar-label">March 2020</div>`);
    deepStrictEqual(calendarDaysContents.map(n => n.trim()), [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, '', '', '', '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`navigates to previous month`, async () => {
    const el = await clickElements([`.btn__month-selector[aria-label="Previous month"]`]);

    const calendarLabel = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.calendar-label`,
    ]);
    const calendarDays = await shadowQueryAll2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.full-calendar__day`,
    ]);

    const calendarLabelContent = await cleanHtml(calendarLabel);
    const calendarDaysContents = await Promise.all(calendarDays.map(cleanText));

    strictEqual(
      calendarLabelContent, prettyHtml`<div class="calendar-label">January 2020</div>`);
    deepStrictEqual(calendarDaysContents.map(n => n.trim()), [
      '', '', '', 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, '',
      '', '', '', '', '', '', '',
    ].map(String));
  });

  it(`selects new focused date`, async () => {
    const el = await clickElements([
      `.full-calendar__day[aria-label="Feb 13, 2020"]`,
    ]);

    const focusedDate = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-13');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`closes dialog when dismiss button is clicked`, async () => {
    type A = [boolean, boolean];

    const values: A = await browser.executeAsync(async (a, b, done) => {
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
        getComputedStyle(n).display === 'none',
        n.getAttribute('aria-hidden')  === 'true',
      ] as A);
    }, elementName, `.actions-container > mwc-button[dialog-dismiss]`);

    deepStrictEqual(values, [true, true]);
  });

  it(`closes dialog with new focused date when confirm button is clicked`, async () => {
    type A = [boolean, boolean, boolean];

    const el = await clickElements([
      `.full-calendar__day[aria-label="Feb 13, 2020"]`,
    ]);

    const focusedDate = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const dialogConfirmButton = n.shadowRoot!.querySelector<HTMLElement>(b)!;

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
        getComputedStyle(n).display === 'none',
        n.getAttribute('aria-hidden')  === 'true',
        n.value === '2020-02-13',
      ] as A);
    }, elementName, `.actions-container > mwc-button[dialog-confirm]`);

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-13');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);

    deepStrictEqual(values, [true, true, true]);
  });

});
