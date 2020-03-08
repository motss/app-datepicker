import type { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing.js';
import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import type { StartView } from '../../custom_typings.js';
import type { DatepickerDialog } from '../../datepicker-dialog.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe(`${DATEPICKER_DIALOG_NAME}::properties`, () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: DatepickerDialog = document.createElement(a);

      document.body.appendChild(el);

      await el.open();
      await el.updateComplete;

      done();
    }, DATEPICKER_DIALOG_NAME);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<DatepickerDialog>(a)!;

      if (el) document.body.removeChild(el);

      done();
    }, DATEPICKER_DIALOG_NAME);
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/properties-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector<DatepickerDialog>(a)!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';

      await el.updateComplete;

      done();
    }, DATEPICKER_DIALOG_NAME);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/properties-1-${browserName}.png`);
  });

  it(`renders with initial properties`, async () => {
    type A = [
      number, number,
      WeekNumberType, WeekNumberType,
      StartView, StartView,
    ];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      done([
        n.firstDayOfWeek,
        n2.firstDayOfWeek,

        n.weekNumberType,
        n2.weekNumberType,

        n.startView,
        n2.startView,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

    deepStrictEqual(values, [
      0, 0,
      'first-4-day-week', 'first-4-day-week',
      'calendar', 'calendar',
    ] as A);
  });

  it(`renders with defined 'min'`, async () => {
    type A = [string, string];

    const expectedMin = '2000-01-01';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.min = c;

      await n.updateComplete;

      done([
        n.min,
        n2.min,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMin);

    allStrictEqual(values, expectedMin);
  });

  it(`renders with defined 'max'`, async () => {
    type A = [string, string];

    const expectedMax = '2020-02-27';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.min = '2000-01-01';
      n.max = c;

      await n.updateComplete;

      done([
        n.max,
        n2.max,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMax);

    allStrictEqual(values, expectedMax);
  });

  it(`renders with defined 'value'`, async () => {
    type A = [string, string];

    const expectedValue = '2020-02-20';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.min = '2000-01-01';
      n.max = '2020-12-31';
      n.value = c;

      await n.updateComplete;

      done([
        n.value,
        n2.value,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedValue);

    allStrictEqual(values, expectedValue);
  });

  it(`renders with defined 'startView'`, async () => {
    type A = [StartView, StartView];

    const expectedStartView: StartView = 'calendar';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.startView = c;

      await n.updateComplete;

      done([
        n.startView,
        n2.startView,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedStartView);

    allStrictEqual(values, expectedStartView);
  });

  it(`renders with defined 'firstDayOfWeek'`, async () => {
    type A = [number, number];

    const expectedFirstDayOfWeek = 1;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.firstDayOfWeek = c;

      await n.updateComplete;

      done([
        n.firstDayOfWeek,
        n2.firstDayOfWeek,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstDayOfWeek);

    allStrictEqual(values, expectedFirstDayOfWeek);
  });

  it(`renders with defined 'showWeekNumber'`, async () => {
    type A = [boolean, boolean];

    const expectedShowWeekNumber: boolean = true;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.showWeekNumber = c;

      await n.updateComplete;

      done([
        n.showWeekNumber,
        n2.showWeekNumber,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedShowWeekNumber);

    allStrictEqual(values, expectedShowWeekNumber);
  });

  it(`renders with defined 'weekNumberType'`, async () => {
    type A = [WeekNumberType, WeekNumberType];

    const expectedWeekNumberType: WeekNumberType = 'first-4-day-week';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.weekNumberType = c;

      await n.updateComplete;

      done([
        n.weekNumberType,
        n2.weekNumberType,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeekNumberType);

    allStrictEqual(values, expectedWeekNumberType);
  });

  it(`renders with defined 'landscape'`, async () => {
    type A = [boolean, boolean];

    const expectedLandscape: boolean = true;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.landscape = c;

      await n.updateComplete;

      done([
        n.landscape,
        n2.landscape,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLandscape);

    allStrictEqual(values, expectedLandscape);
  });

  it(`renders with defined 'locale'`, async () => {
    type A = [string, string];

    const expectedLocale: string = 'ja-JP';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.locale = c;

      await n.updateComplete;

      done([
        n.locale,
        n2.locale,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLocale);

    allStrictEqual(values, expectedLocale);
  });

  it(`renders with defined 'disabledDays'`, async () => {
    type A = [string, string];

    const expectedDisabledDays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.disabledDays = c;

      await n.updateComplete;

      done([
        n.disabledDays,
        n2.disabledDays,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisabledDays);

    allStrictEqual(values, expectedDisabledDays);
  });

  it(`renders with defined 'disabledDates'`, async () => {
    type A = [string, string];

    const expectedDisabledDates: string = '2020-02-02,2020-02-15';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.disabledDates = c;

      await n.updateComplete;

      done([
        n.disabledDates,
        n2.disabledDates,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisabledDates);

    allStrictEqual(values, expectedDisabledDates);
  });

  it(`renders with defined 'dragRatio'`, async () => {
    type A = [number, number];

    const dragRatio = .5;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.querySelector<DatepickerDialog>(a)!;

      n.dragRatio = c;

      await n.updateComplete;

      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      done([
        n.dragRatio,
        n2.dragRatio,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, dragRatio);

    allStrictEqual(values, dragRatio);
  });

  it(`renders with defined 'weekLabel'`, async () => {
    type A = [string, string, string];

    const expectedWeekLabel: string = '周数';
    const [
      initialLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;
      const iniialWeekLabel = n.weekLabel;

      n.weekLabel = c;

      await n.updateComplete;

      done([
        iniialWeekLabel,
        n.weekLabel,
        n2.weekLabel,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeekLabel);

    strictEqual(initialLabel, 'Wk');
    allStrictEqual(others, expectedWeekLabel);
  });

  it(`renders with defined 'clearLabel'`, async () => {
    type A = [string, string, string];

    const expectedClearLabel: string = '重設';
    const [
      initialClearLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.clearLabel;

      n.clearLabel = c;

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.clearLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="clear"]`, expectedClearLabel);

    strictEqual(initialClearLabel, 'clear');
    allStrictEqual(others, expectedClearLabel);
  });

  it(`renders with defined 'dismissLabel'`, async () => {
    type A = [string, string, string];

    const expectedDismissLabel: string = '取消';
    const [
      initialDismissLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.dismissLabel;

      n.dismissLabel = c;

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.dismissLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="dismiss"]`, expectedDismissLabel);

    strictEqual(initialDismissLabel, 'cancel');
    allStrictEqual(others, expectedDismissLabel);
  });

  it(`renders with defined 'confirmLabel'`, async () => {
    type A = [string, string, string];

    const expectedConfirmLabel: string = '取消';
    const [
      initialConfirmLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.confirmLabel;

      n.confirmLabel = c;

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.confirmLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedConfirmLabel);

    strictEqual(initialConfirmLabel, 'set');
    allStrictEqual(others, expectedConfirmLabel);
  });

  it(`renders with defined 'noFocusTrap'`, async () => {
    type A = [boolean, boolean, string];

    const expectedNoFocusTap: boolean = true;
    const [
      initialProp,
      prop,
      activeElementContent,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const getDeepActiveElement = () => {
        let $n = document.activeElement;
        while ($n?.shadowRoot) { $n = $n.shadowRoot.activeElement; }
        return $n;
      };

      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const initialNoFocusTrap = n.noFocusTrap;

      n.min = '2000-01-01';
      n.value = '2020-02-02';
      n.noFocusTrap = c;

      await n.updateComplete;

      const confirmButton = n.querySelector<HTMLElement>(b);

      confirmButton?.focus();

      const tabEvent = new CustomEvent('keyup');

      Object.defineProperty(tabEvent, 'keyCode', { value: 9 });
      n.dispatchEvent(tabEvent);

      await n.updateComplete;

      done([
        initialNoFocusTrap,
        n.noFocusTrap,

        getDeepActiveElement()?.outerHTML ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedNoFocusTap);

    strictEqual(initialProp, false);
    strictEqual(prop, expectedNoFocusTap);
    strictEqual(
      cleanHtml(activeElementContent),
      prettyHtml`<button class="btn__year-selector" data-view="yearList">2020</button>`
    );
  });

  it(`renders with defined 'alwaysResetValue'`, async () => {
    type A = [boolean, boolean, string, string, string];

    const expectedAlwaysResetValue: boolean = true;
    const [
      initialProp,
      prop,

      value,
      value2,

      focusedDateContent,
    ]: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const n2 = root.querySelector<Datepicker>(b)!;
      const initialAlwaysResetValue = n.alwaysResetValue;

      n.min = '2000-01-01';
      n.value = '2020-02-02';
      n.alwaysResetValue = d;
      n2.value = '2020-02-20';

      await n2.updateComplete;
      await n.updateComplete;

      await n.close();
      await n.open();
      await n.updateComplete;

      const focusedDate = n2.shadowRoot!.querySelector<HTMLTableCellElement>(c);

      done([
        initialAlwaysResetValue,
        n.alwaysResetValue,

        n.value,
        n2.value,
        focusedDate?.outerHTML ?? '<nil>',
      ] as A);
    },
    DATEPICKER_DIALOG_NAME,
    DATEPICKER_NAME,
    toSelector('.day--focused'),
    expectedAlwaysResetValue);

    strictEqual(initialProp, false);
    strictEqual(prop, expectedAlwaysResetValue);
    allStrictEqual([value, value2], '2020-02-02');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>`);
  });

  it(`renders with different 'firstDayOfWeek' and 'disabledDays'`, async () => {
    type A = [number, number, string, string];

    const expectedFirstDayOfWeek: number = 1;
    const expectedDisabledDays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.firstDayOfWeek = c;
      n.disabledDays = d;

      await n.updateComplete;

      done([
        n.firstDayOfWeek,
        n2.firstDayOfWeek,

        n.disabledDays,
        n2.disabledDays,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstDayOfWeek, expectedDisabledDays);

    deepStrictEqual(values, [
      expectedFirstDayOfWeek,
      expectedFirstDayOfWeek,

      expectedDisabledDays,
      expectedDisabledDays,
    ]);
  });

});
