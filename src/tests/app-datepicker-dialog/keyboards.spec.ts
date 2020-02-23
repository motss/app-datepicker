import type { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import type { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
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

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::keyboards`, () => {
  const focusElement = async (selector: string, inDialog: boolean = false) => {
    return browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
      const n3 = (d ? n : n2).shadowRoot!.querySelector<HTMLElement>(c)!;

      n3.focus();

      await n.updateComplete;
      await new Promise(y => setTimeout(() => y(n3.focus())));
      await n.updateComplete;

      done();
    }, elementName, elementName2, selector, inDialog);
  };
  const tapElements = async (
    selectors: string[],
    keys: string[]
  ): Promise<void> => {
    for (const s of selectors) {
      await focusElement(s);
      await browser.keys(keys);
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
    await tapElements(['.btn__year-selector'], ['Space']);

    const hasYearListView: boolean = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const yearListView = n2.shadowRoot!.querySelector<HTMLDivElement>(c)!;

      done(yearListView != null);
    }, elementName, elementName2, '.datepicker-body__year-list-view');

    ok(hasYearListView);
  });

  it(`switches to calendar view`, async () => {
    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      n.startView = 'yearList';

      await n.updateComplete;

      done();
    }, elementName);

    await tapElements(['.btn__calendar-selector'], ['Space']);

    const hasCalendarView: boolean = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const yearListView = n2.shadowRoot!.querySelector<HTMLDivElement>(c)!;

      done(yearListView != null);
    }, elementName, elementName2, '.datepicker-body__calendar-view');

    ok(hasCalendarView);
  });

  it(`focuses date after navigating away when switching to calendar view`, async () => {
    type A = [boolean, string];

    await tapElements([
      `.btn__month-selector[aria-label="Next month"]`,
      `.btn__year-selector`,
    ], ['Space']);

    const hasYearListView: boolean = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const yearListView = n2.shadowRoot!.querySelector<HTMLDivElement>(c)!;

      done(yearListView != null);
    }, elementName, elementName2, '.datepicker-body__year-list-view');

    await tapElements([`.btn__calendar-selector`], ['Space']);

    const [
      hasCalendarView,
      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const root = n2.shadowRoot!;

      const yearListView = root.querySelector<HTMLDivElement>(c)!;
      const focusedDate = root.querySelector<HTMLTableCellElement>(d)!;

      done([
        yearListView != null,
        focusedDate.outerHTML,
      ] as A);
    },
    elementName,
    elementName2,
    '.datepicker-body__calendar-view',
    toSelector('.day--focused'));

    allStrictEqual([hasCalendarView, hasYearListView], true);
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`switches back to calendar view when new year is selected`, async () => {
    type A = [string, string];
    type B = [string, string, string, string, string[]];

    const [
      prop,
      prop2,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done([
        n.value,
        n2.value,
      ] as A);
    }, elementName, elementName2);

    await tapElements([
      '.btn__year-selector',
      [
        `.year-list-view__list-item.year--selected`,
        `+ .year-list-view__list-item`,
        `+ .year-list-view__list-item`,
      ].join(' '),
    ], ['Space']);

    const [
      prop3,
      prop4,
      yearSelectorButtonContent,
      calendarLabelContent,
      calendarDaysContents,
    ]: B = await browser.executeAsync(async (a, b, c, d, e, done) => {
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
      ] as B);
    },
    elementName,
    elementName2,
    '.btn__year-selector',
    toSelector('.calendar-label'),
    toSelector('.full-calendar__day'));

    allStrictEqual([prop, prop2, prop3], '2020-02-20');
    strictEqual(prop4, '2022-02-20');

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

  it(`closes dialog when dismiss button is tapped`, async () => {
    type A = [string, string];

    await focusElement(`.actions-container > mwc-button[dialog-dismiss]`, true);

    await browser.keys(['Space']);

    // Wait for dialog closes
    await (await $(elementName)).waitForDisplayed(undefined, true);

    const [
      cssDisplay,
      ariaHiddenAttr,
    ]: A = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      await n.updateComplete;

      done([
        getComputedStyle(n).display,
        n.getAttribute('aria-hidden'),
      ] as A);
    }, elementName);

    strictEqual(cssDisplay, 'none');
    strictEqual(ariaHiddenAttr, 'true');
  });

  it(`closes dialog with new focused date when confirm button is tapped`, async () => {
    type A = [string, string, string];
    type B = [string, string, string];

    // FIXME: Using keyboard to select new focused date is tedious and inconsistent.
    // Here updates via `value` property.
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n2.value = '2020-02-13';

      await n2.updateComplete;

      const focusedDate = n2.shadowRoot!.querySelector<HTMLTableCellElement>(c)!;

      done([
        n.value,
        n2.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, elementName2, toSelector('.day--focused'));

    await focusElement(`.actions-container > mwc-button[dialog-confirm]`, true);

    await browser.keys(['Space']);

    await (await $(elementName)).waitForDisplayed(undefined, true);

    const [
      prop3,
      cssDisplay,
      ariaHiddenAttr,
    ]: B = await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      await n.updateComplete;

      done([
        n.value,
        getComputedStyle(n).display,
        n.getAttribute('aria-hidden'),
        // === '2020-02-13'
      ] as B);
    }, elementName);

    strictEqual(prop, '2020-02-20');
    allStrictEqual([prop2, prop3], '2020-02-13');
    strictEqual(cssDisplay, 'none');
    strictEqual(ariaHiddenAttr, 'true');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 13, 2020" aria-selected="true">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`reset value when clear button is tapped`, async () => {
    type A = [string, string];
    type B = string;

    const [
      initialVal,
      todayValue,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const padStart = (v: number) => `0${v}`.slice(-2);
      const today = new Date();
      const fy = today.getFullYear();
      const m = today.getMonth();
      const d = today.getDate();
      const todayVal = [`${fy}`].concat([1 + m, d].map(padStart)).join('-');

      n.min = `${fy - 10}-01-01`;
      n2.value = `${fy - 1}-01-01`;
      n.max = `${fy + 10}-01-01`;

      await n2.updateComplete;
      await n.updateComplete;

      done([n2.value, todayVal] as A);
    }, elementName, elementName2);

    await focusElement('mwc-button.clear', true);
    await browser.keys(['Space']);

    const prop: B = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done(n2.value as B);
    }, elementName, elementName2);

    strictEqual(initialVal, `${Number(todayValue.slice(0, 4)) - 1}-01-01`);
    strictEqual(prop, todayValue);
  });

  // region helpers
  type C = [string, string, string];

  const focusCalendarsContainer = async (): Promise<string> => {
    return await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
      const n3 = n2.shadowRoot!.querySelector<HTMLElement>(c)!;

      n3.focus();

      await n.updateComplete;
      await new Promise(y => setTimeout(() => y(n3.focus())));
      await n.updateComplete;

      let activeElement = document.activeElement;

      while (activeElement?.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }

      done(
        `.${Array.from(activeElement?.classList.values() ?? []).join('.')}`
      );
    }, elementName, elementName2, '.calendars-container');
  };
  // FIXME: Helper as a workaround until `browser.keys()` supports Alt
  // on all browsers on local and CI.
  const browserKeys = async (keyCode: number, altKey: boolean = false) => {
    await focusCalendarsContainer();

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
  const getValuesAfterKeys = async (
    key: number,
    altKey: boolean = false
  ): Promise<C> => {
    await focusCalendarsContainer();

    await browserKeys(key, altKey);

    const [prop, prop2, content]: C = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const focusedDate = n2.shadowRoot!.querySelector<HTMLTableCellElement>(c)!;

      done([
        n.value,
        n2.value,
        focusedDate.outerHTML,
      ] as C);
    }, elementName, elementName2, toSelector('.day--focused'));

    return [prop, prop2, cleanHtml(content)];
  };
  // #endregion helpers

  it(`focuses date (ArrowLeft)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.ARROW_LEFT);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-19');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 19, 2020" aria-selected="true">
      <div class="calendar-day">19</div>
    </td>
    `);
  });

  it(`focuses date (ArrowRight)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.ARROW_RIGHT);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-21');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 21, 2020" aria-selected="true">
      <div class="calendar-day">21</div>
    </td>
    `);
  });

  it(`focuses date (ArrowUp)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.ARROW_UP);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, `2020-02-13`);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 13, 2020" aria-selected="true">
      <div class="calendar-day">13</div>
    </td>
    `);
  });

  it(`focuses date (ArrowDown)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.ARROW_DOWN);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
      <div class="calendar-day">27</div>
    </td>
    `);
  });

  it(`focuses date (PageUp)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.PAGE_UP);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-01-20');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`focuses date (PageDown)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.PAGE_DOWN);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-03-20');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Mar 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`focuses date (Home)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.HOME);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-01');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
  });

  it(`focuses date (End)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.END);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2020-02-29');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 29, 2020" aria-selected="true">
      <div class="calendar-day">29</div>
    </td>
    `);
  });

  it(`focuses date (Alt + PageUp)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.PAGE_UP, true);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2019-02-20');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2019" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

  it(`focuses date (Alt + PageDown)`, async () => {
    const [
      prop,
      prop2,
      focusedDateContent,
    ]: C = await getValuesAfterKeys(KEY_CODES_MAP.PAGE_DOWN, true);

    strictEqual(prop, '2020-02-20');
    strictEqual(prop2, '2021-02-20');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2021" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
  });

});
