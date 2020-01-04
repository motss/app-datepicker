import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { cleanText } from '../helpers/clean-text.js';
import { getProp } from '../helpers/get-prop.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { shadowQueryAll } from '../helpers/shadow-query-all.js';
import { shadowQuery } from '../helpers/shadow-query.js';
import {
  deepStrictEqual,
  ok,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::keyboards`, () => {
  const isMicrosoftEdge = 'MicrosoftEdge' === browser.capabilities.browserName;

  const tapElements = async (
    selectors: string[],
    keys: string[]
  ): Promise<WebdriverIOAsync.Element> => {
    for (const s of selectors) {
      await browser.executeAsync(async (a, b, c, done) => {
        const n = document.body.querySelector<AppDatepickerDialog>(a)!;
        const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
        const n3 = n2.shadowRoot!.querySelector<HTMLElement>(c)!;

        n3.focus();

        done();
      }, elementName, elementName2, s);

      await browser.keys(keys);
    }

    return $(elementName);
  };
  const focusCalendarsContainer = async (): Promise<string> => {
    return await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
      const n3 = n2.shadowRoot!.querySelector<HTMLElement>(c)!;

      n3.focus();

      let activeElement = document.activeElement;

      while (activeElement?.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }

      done(
        `.${Array.from(activeElement?.classList.values() ?? []).join('.')}`
      );
    }, elementName, elementName2, '.calendars-container');
  };
  const shadowQuery2 = async (
    el: WebdriverIOAsync.Element,
    selector: string[]
  ): Promise<WebdriverIOAsync.Element> => {
    const n = await shadowQuery(el, [elementName2]);
    const n2 = await shadowQuery(n, selector);

    return n2;
  };
  const shadowQueryAll2 = async (
    el: WebdriverIOAsync.Element,
    selector: string[]
  ): Promise<WebdriverIOAsync.ElementArray> => {
    const n = await shadowQuery(el, [elementName2]);
    const n2s = await shadowQueryAll(n, selector);

    return n2s;
  };
  const getProp2 = async <T>(propName: string): Promise<T> => {
    const value: T = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done((n2 as any)[c]);
    }, elementName, elementName2, propName);

    return value;
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
      const el = document.body.querySelector(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`switches to year list view`, async () => {
    await new Promise(y => setTimeout(y, 3e3));

    const el = await tapElements(['.btn__year-selector'], ['Space']);

    await new Promise(y => setTimeout(y, 3e3));

    const yearListView = await shadowQuery2(el, ['.datepicker-body__year-list-view']);

    ok(await yearListView.isExisting());
  });

  it(`switches to calendar view`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.startView = 'yearList';

      await n.updateComplete;

      done();
    }, elementName);

    const el = await tapElements(['.btn__calendar-selector'], ['Space']);

    const calendarView = await shadowQuery2(el, ['.datepicker-body__calendar-view']);

    ok(await calendarView.isExisting());
  });

  it(`focuses date after navigating away when switching to calendar view`, async () => {
    let el = await tapElements([
      `.btn__month-selector[aria-label="Next month"]`,
      `.btn__year-selector`,
    ], ['Space']);

    const yearListView = await shadowQuery2(el, ['.datepicker-body__year-list-view']);

    ok(await yearListView.isExisting());

    el = await tapElements([`.btn__calendar-selector`], ['Space']);

    const calendarView = await shadowQuery2(el, ['.datepicker-body__calendar-view']);
    const focusedDate = await shadowQuery2(el, [
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
    const valueProp2 = await getProp2<string>('value');

    const el = await tapElements([
      '.btn__year-selector',
      [
        `.year-list-view__list-item.year--selected`,
        `+ .year-list-view__list-item`,
        `+ .year-list-view__list-item`,
      ].join(' '),
    ], ['Space']);

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

    const valueProp3 = await getProp<string>(elementName, 'value');
    const valueProp4 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-20');

    strictEqual(valueProp3, '2020-02-20');
    strictEqual(valueProp4, '2022-02-20');

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

  it(`closes dialog when dismiss button is tapped`, async () => {
    type A = [boolean, boolean];

    await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const dialogDismissButton = n.shadowRoot!.querySelector<HTMLElement>(b)!;

      dialogDismissButton.focus();

      await n.updateComplete;

      await new Promise(y => setTimeout(() => y(dialogDismissButton.focus())));

      await n.updateComplete;

      done();
    }, elementName, `.actions-container > mwc-button[dialog-dismiss]`);

    await browser.keys(['Space']);

    const el = await $(elementName);

    await el.waitForDisplayed(undefined, true);

    const values: A = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      await n.updateComplete;

      done([
        getComputedStyle(n).display === 'none',
        n.getAttribute('aria-hidden') === 'true',
      ]);
    }, elementName);

    deepStrictEqual(values, [true, true]);
  });

  it(`closes dialog with new focused date when confirm button is tapped`, async () => {
    type A = [boolean, boolean, boolean];

    // FIXME: Using keyboard to select new focused date is tedious and inconsistent.
    // Here updates via `value` property.
    await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n2.value = '2020-02-13';

      await n2.updateComplete;

      done();
    }, elementName, elementName2);

    let el = await $(elementName);

    const focusedDate = await shadowQuery2(el, [
      `.calendar-container:nth-of-type(2)`,
      `.day--focused`,
    ]);

    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const dialogConfirmButton = n.shadowRoot!.querySelector<HTMLElement>(b)!;

      dialogConfirmButton.focus();

      await n.updateComplete;

      await new Promise(y => setTimeout(() => y(dialogConfirmButton.focus())));

      await n.updateComplete;

      done();
    }, elementName, `.actions-container > mwc-button[dialog-confirm]`);

    await browser.keys(['Space']);

    el = await $(elementName);

    await el.waitForDisplayed(undefined, true);

    const values: A = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      await n.updateComplete;

      done([
        getComputedStyle(n).display === 'none',
        n.getAttribute('aria-hidden')  === 'true',
        n.value === '2020-02-13',
      ] as A);
    }, elementName);

    const valueProp3 = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-13');
    strictEqual(valueProp3, '2020-02-13');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 13, 2020">
      <div class="calendar-day">13</div>
    </td>
    `);

    deepStrictEqual(values, [true, true, true]);
  });

  it(`focuses date (ArrowLeft)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowLeft']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    const expected = isMicrosoftEdge ? '18' : '19';

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowRight)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowRight']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    const expected = isMicrosoftEdge ? '22' : '21';

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowUp)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    const expected = isMicrosoftEdge ? '6' : '13';

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, `2020-02-${expected.padStart(2, '0')}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowDown)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, isMicrosoftEdge ? '2020-03-05' : '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Mar 5' : 'Feb 27'
    }, 2020">
      <div class="calendar-day">${isMicrosoftEdge ? '5' : '27'}</div>
    </td>
    `));
  });

  it(`focuses date (PageUp)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['PageUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, isMicrosoftEdge ? '2019-12-20' : '2020-01-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Dec 20, 2019' : 'Jan 20, 2020'
    }">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (PageDown)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['PageDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, isMicrosoftEdge ? '2020-04-20' : '2020-03-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Apr' : 'Mar'
    } 20, 2020">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (Home)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['Home']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-01');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 1, 2020">
      <div class="calendar-day">1</div>
    </td>
    `));
  });

  it(`focuses date (End)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['End']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2020-02-29');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 29, 2020">
      <div class="calendar-day">29</div>
    </td>
    `));
  });

  // FIXME: Helper as a workaround until `browser.keys()` supports Alt
  // on all browsers on local and CI.
  const browserKeysWithAltKey = async (keyCode: number, altKey: boolean = true) => {
    return browser.executeAsync(async (a, b, c, d, e, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
      const n3 = n2.shadowRoot!.querySelector<HTMLDivElement>(c)!;

      const opt: any = { keyCode: d, altKey: e };
      const ev = new CustomEvent('keyup', opt);

      Object.keys(opt).forEach((o) => {
        Object.defineProperty(ev, o, { value: opt[o] });
      });

      n3.dispatchEvent(ev);

      done();
    }, elementName, elementName2, '.calendars-container', keyCode, altKey);
  };

  it(`focuses date (Alt + PageUp)`, async () => {
    await browserKeysWithAltKey(KEY_CODES_MAP.PAGE_UP);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2019-02-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2019">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (Alt + PageDown)`, async () => {
    await browserKeysWithAltKey(KEY_CODES_MAP.PAGE_DOWN);

    const el = await $(elementName);

    const focusedDate = await shadowQuery2(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');
    const valueProp2 = await getProp2<string>('value');

    strictEqual(valueProp, '2020-02-20');
    strictEqual(valueProp2, '2021-02-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2021">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

});
