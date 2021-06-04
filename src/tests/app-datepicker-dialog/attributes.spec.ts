import type { WeekNumberType } from 'nodemod/dist/calendar/typings.js';

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

describe(`${DATEPICKER_DIALOG_NAME}::attributes`, () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: DatepickerDialog = document.createElement(a);

      document.body.appendChild(el);

      el.locale = 'en-US';
      el.min = '2000-01-01';

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
      `./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector<DatepickerDialog>(a)!;

      el.setAttribute('min', '2020-01-15');
      el.setAttribute('value', '2020-01-17');

      await el.updateComplete;

      done();
    }, DATEPICKER_DIALOG_NAME);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/attributes-1-${browserName}.png`);
  });

  it(`renders with initial attributes`, async () => {
    type A = [
      string,
      string,
      StartView,
      StartView,
      WeekNumberType,
      WeekNumberType,
    ];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      done([
        n.getAttribute('firstdayofweek'),
        n2.getAttribute('firstdayofweek'),

        n.getAttribute('startview'),
        n2.getAttribute('startview'),

        n.getAttribute('weeknumbertype'),
        n2.getAttribute('weeknumbertype'),
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

    deepStrictEqual(values, [
      '0',
      '0',

      'calendar',
      'calendar',

      'first-4-day-week',
      'first-4-day-week',
    ] as A);
  });

  it(`renders with defined 'min'`, async () => {
    type A = [string, string];

    const expectedMin = '2000-01-01';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('min', c);

      await n.updateComplete;

      done([n.getAttribute('min'), n2.getAttribute('min')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMin);

    allStrictEqual(values, expectedMin);
  });

  it(`renders with defined 'max'`, async () => {
    type A = [string, string];

    const expectedMax = '2020-02-27';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('max', c);

      await n.updateComplete;

      done([n.getAttribute('max'), n2.getAttribute('max')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMax);

    allStrictEqual(values, expectedMax);
  });

  it(`renders with defined 'value'`, async () => {
    type A = [boolean, boolean, string, string];

    const expectedValue = '2020-02-20';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('value', c);

      await n.updateComplete;

      done([
        n.hasAttribute('value'),
        n2.hasAttribute('value'),

        n.value,
        n2.value,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedValue);

    deepStrictEqual(values, [true, false, expectedValue, expectedValue]);
  });

  it(`renders with defined 'startview'`, async () => {
    type A = [string, string];

    const expectedStartview: StartView = 'calendar';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('startview', c);

      await n.updateComplete;

      done([n.getAttribute('startview'), n2.getAttribute('startview')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedStartview);

    allStrictEqual(values, expectedStartview);
  });

  it(`renders with defined 'firstdayofweek'`, async () => {
    type A = [string, string];

    const expectedFirstdayofweek = '1';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('firstdayofweek', c);

      await n.updateComplete;

      done([n.getAttribute('firstdayofweek'), n2.getAttribute('firstdayofweek')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstdayofweek);

    allStrictEqual(values, expectedFirstdayofweek);
  });

  it(`renders with defined 'showeeknumber'`, async () => {
    type A = [boolean, boolean];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('showweeknumber', '');

      await n.updateComplete;

      done([n.hasAttribute('showweeknumber'), n2.hasAttribute('showweeknumber')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

    allStrictEqual(values, true);
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    type A = [WeekNumberType, WeekNumberType];

    const expectedWeeknumbertype: WeekNumberType = 'first-4-day-week';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('weeknumbertype', c);

      await n.updateComplete;

      done([n.getAttribute('weeknumbertype'), n2.getAttribute('weeknumbertype')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeeknumbertype);

    allStrictEqual(values, expectedWeeknumbertype);
  });

  it(`renders with defined 'landscape'`, async () => {
    type A = [boolean, boolean];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('landscape', '');

      await n.updateComplete;

      done([n.hasAttribute('landscape'), n2.hasAttribute('landscape')] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

    allStrictEqual(values, true);
  });

  it(`renders with defined 'locale'`, async () => {
    type A = [string, null, string, string];

    const expectedLocale: string = 'ja-JP';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('locale', c);

      await n.updateComplete;

      done([
        n.getAttribute('locale'),
        n2.getAttribute('locale'),

        n.locale,
        n2.locale,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLocale);

    deepStrictEqual(values, [expectedLocale, null, expectedLocale, expectedLocale] as A);
  });

  it(`renders with defined 'disableddays'`, async () => {
    type A = [string, null, string, string];

    const expectedDisableddays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('disableddays', c);

      await n.updateComplete;

      done([
        n.getAttribute('disableddays'),
        n2.getAttribute('disableddays'),

        n.disabledDays,
        n2.disabledDays,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisableddays);

    deepStrictEqual(values, [
      expectedDisableddays,
      null,
      expectedDisableddays,
      expectedDisableddays,
    ] as A);
  });

  it(`renders with defined 'disableddates'`, async () => {
    type A = [string, null, string, string];

    const expectedDisableddates: string = '2020-02-02,2020-02-15';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;

      n.setAttribute('disableddates', c);

      await n.updateComplete;

      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      done([
        n.getAttribute('disableddates'),
        n2.getAttribute('disableddates'),

        n.disabledDates,
        n2.disabledDates,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisableddates);

    deepStrictEqual(values, [
      expectedDisableddates,
      null,
      expectedDisableddates,
      expectedDisableddates,
    ] as A);
  });

  it(`renders with defined 'dragratio'`, async () => {
    type A = [number, number, string];

    const dragRatio = .5;
    const [
      prop,
      prop2,
      attr,
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('dragratio', `${c}`);

      await n.updateComplete;

      done([
        n.dragRatio,
        n2.dragRatio,
        n.getAttribute('dragratio'),
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, dragRatio);

    allStrictEqual([prop, prop2], dragRatio);
    strictEqual(attr, `${dragRatio}`);
  });

  it(`renders with defined 'weeklabel'`, async () => {
    type A = [string, string, null, string, string];

    const expectedWeeklabel: string = '周数';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;
      const initialLabel = n.weekLabel;

      n.setAttribute('weeklabel', c);

      await n.updateComplete;

      done([
        initialLabel,

        n.getAttribute('weeklabel'),
        n2.getAttribute('weeklabel'),

        n.weekLabel,
        n2.weekLabel,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeeklabel);

    deepStrictEqual(values, [
      'Wk',
      expectedWeeklabel,
      null,
      expectedWeeklabel,
      expectedWeeklabel,
    ] as A);
  });

  it(`renders with defined 'clearlabel'`, async () => {
    type A = [string, string, string, string];

    const expectedClearLabel: string = '重設';
    const [
      initialClearLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.clearLabel;

      n.setAttribute('clearlabel', c);

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.getAttribute('clearlabel'),
        n.clearLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="clear"]`, expectedClearLabel);

    strictEqual(initialClearLabel, 'clear');
    allStrictEqual(others, expectedClearLabel);
  });

  it(`renders with defined 'dismisslabel'`, async () => {
    type A = [string, string, string, string];

    const expectedDismissLabel: string = '取消';
    const [
      initialDismissLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.dismissLabel;

      n.setAttribute('dismisslabel', c);

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.getAttribute('dismisslabel'),
        n.dismissLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="dismiss"]`, expectedDismissLabel);

    strictEqual(initialDismissLabel, 'cancel');
    allStrictEqual(others, expectedDismissLabel);
  });

  it(`renders with defined 'confirmlabel'`, async () => {
    type A = [string, string, string, string];

    const expectedConfirmLabel: string = '取消';
    const [
      initialConfirmLabel,
      ...others
    ]: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const root = n.shadowRoot!;
      const initialLabel = n.confirmLabel;

      n.setAttribute('confirmlabel', c);

      await n.updateComplete;

      const clearButton = root.querySelector<HTMLElement>(b);

      done([
        initialLabel,
        n.getAttribute('confirmlabel'),
        n.confirmLabel,
        clearButton?.textContent ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedConfirmLabel);

    strictEqual(initialConfirmLabel, 'set');
    allStrictEqual(others, expectedConfirmLabel);
  });

  it(`renders with defined 'nofocustrap'`, async () => {
    type A = [boolean, boolean, boolean, string];

    const expectedNoFocusTap: boolean = true;
    const [
      initialProp,
      attr,
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
      n.setAttribute('nofocustrap', c);

      await n.updateComplete;

      const confirmButton = n.querySelector<HTMLElement>(b);

      confirmButton?.focus();

      const tabEvent = new CustomEvent('keyup');

      Object.defineProperty(tabEvent, 'keyCode', { value: 9 });
      n.dispatchEvent(tabEvent);

      await n.updateComplete;

      done([
        initialNoFocusTrap,
        n.hasAttribute('nofocustrap'),
        n.noFocusTrap,

        getDeepActiveElement()?.outerHTML ?? '',
      ] as A);
    }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedNoFocusTap);

    strictEqual(initialProp, false);
    allStrictEqual([attr, prop], expectedNoFocusTap);
    strictEqual(
      cleanHtml(activeElementContent),
      prettyHtml`<button class="btn__year-selector" data-view="yearList">2020</button>`
    );
  });

  it(`renders with defined 'alwaysresetvalue'`, async () => {
    type A = [boolean, boolean, boolean, string, string, string];

    const expectedAlwaysResetValue: boolean = true;
    const [
      initialProp,
      attr,
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
      n.setAttribute('alwaysresetvalue', d);
      n2.value = '2020-02-20';

      await n2.updateComplete;
      await n.updateComplete;

      await n.close();
      await n.open();
      await n.updateComplete;

      const focusedDate = n2.shadowRoot!.querySelector<HTMLTableCellElement>(c);

      done([
        initialAlwaysResetValue,
        n.hasAttribute('alwaysresetvalue'),
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
    allStrictEqual([prop, attr], expectedAlwaysResetValue);
    allStrictEqual([value, value2], '2020-02-02');
    strictEqual(cleanHtml(focusedDateContent), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>`);
  });

  it(`renders with different 'firstdayofweek' and 'disableddays'`, async () => {
    type A = [
      string,
      string,

      string,
      null,

      number,
      number,

      string,
      string,
    ];

    const expectedFirstdayofweek: string = '1';
    const expectedDisableddays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<DatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

      n.setAttribute('firstdayofweek', c);
      n.setAttribute('disableddays', d);

      await n.updateComplete;

      done([
        n.getAttribute('firstdayofweek'),
        n2.getAttribute('firstdayofweek'),

        n.getAttribute('disableddays'),
        n2.getAttribute('disableddays'),

        n.firstDayOfWeek,
        n2.firstDayOfWeek,

        n.disabledDays,
        n2.disabledDays,
      ] as A);
    }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstdayofweek, expectedDisableddays);

    deepStrictEqual(values, [
      expectedFirstdayofweek,
      expectedFirstdayofweek,

      expectedDisableddays,
      null,

      Number(expectedFirstdayofweek),
      Number(expectedFirstdayofweek),

      expectedDisableddays,
      expectedDisableddays,
    ] as A);
  });

});
