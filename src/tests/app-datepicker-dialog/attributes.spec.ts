import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual,
} from '../helpers/typed-assert.js';

type ExpectedValues<T, U = undefined> = U extends undefined ? [T, T] : [T, T, U, U];

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::attributes`, () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.createElement(a);

      document.body.appendChild(el);

      await el.open();
      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el: AppDatepickerDialog = document.body.querySelector(a)!;

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.body.querySelector(a)!;

      el.setAttribute('min', '2020-01-15');
      el.setAttribute('value', '2020-01-17');

      await el.updateComplete;

      done();
    }, elementName);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-1-${browserName}.png`);
  });

  it(`renders with initial attributes`, async () => {
    type A = ExpectedValues<[string, StartView, WeekNumberType]>;

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      const props: string[] = [
        'firstdayofweek',
        'startview',
        'weeknumbertype',
      ];

      done([
        props.map(p => n.getAttribute(p)),
        props.map(p => n2.getAttribute(p)),
      ] as A);
    }, elementName, elementName2);

    deepStrictEqual(values, [
      ['0', 'calendar' as StartView, 'first-4-day-week' as WeekNumberType],
      ['0', 'calendar' as StartView, 'first-4-day-week' as WeekNumberType],
    ]);
  });

  it(`renders with defined 'min'`, async () => {
    type A = ExpectedValues<string>;

    const expectedMin = '2000-01-01';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('min', c);

      await n.updateComplete;

      done([n.getAttribute('min'), n2.getAttribute('min')] as A);
    }, elementName, elementName2, expectedMin);

    deepStrictEqual(values, [expectedMin, expectedMin]);
  });

  it(`renders with defined 'max'`, async () => {
    type A = ExpectedValues<string>;

    const expectedMax = '2020-02-27';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('max', c);

      await n.updateComplete;

      done([n.getAttribute('max'), n2.getAttribute('max')] as A);
    }, elementName, elementName2, expectedMax);

    deepStrictEqual(values, [expectedMax, expectedMax]);
  });

  it(`renders with defined 'value'`, async () => {
    type A = ExpectedValues<boolean, string>;

    const expectedValue = '2020-02-20';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('value', c);

      await n.updateComplete;

      done([
        n.hasAttribute('value'),
        n2.hasAttribute('value'),

        n.value,
        n2.value,
      ] as A);
    }, elementName, elementName2, expectedValue);

    deepStrictEqual(values, [true, false, expectedValue, expectedValue]);
  });

  it(`renders with defined 'startview'`, async () => {
    type A = ExpectedValues<string>;

    const expectedStartview: StartView = 'calendar';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('startview', c);

      await n.updateComplete;

      done([n.getAttribute('startview'), n2.getAttribute('startview')] as A);
    }, elementName, elementName2, expectedStartview);

    deepStrictEqual(values, [expectedStartview, expectedStartview] as A);
  });

  it(`renders with defined 'firstdayofweek'`, async () => {
    type A = ExpectedValues<string>;

    const expectedFirstdayofweek = '1';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('firstdayofweek', c);

      await n.updateComplete;

      done([n.getAttribute('firstdayofweek'), n2.getAttribute('firstdayofweek')] as A);
    }, elementName, elementName2, expectedFirstdayofweek);

    deepStrictEqual(values, [expectedFirstdayofweek, expectedFirstdayofweek] as A);
  });

  it(`renders with defined 'showeeknumber'`, async () => {
    type A = ExpectedValues<boolean>;

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('showweeknumber', '');

      await n.updateComplete;

      done([n.hasAttribute('showweeknumber'), n2.hasAttribute('showweeknumber')] as A);
    }, elementName, elementName2);

    deepStrictEqual(values, [true, true] as A);
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    type A = ExpectedValues<WeekNumberType>;

    const expectedWeeknumbertype: WeekNumberType = 'first-4-day-week';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('weeknumbertype', c);

      await n.updateComplete;

      done([n.getAttribute('weeknumbertype'), n2.getAttribute('weeknumbertype')] as A);
    }, elementName, elementName2, expectedWeeknumbertype);

    deepStrictEqual(values, [expectedWeeknumbertype, expectedWeeknumbertype] as A);
  });

  it(`renders with defined 'landscape'`, async () => {
    type A = ExpectedValues<boolean>;

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('landscape', '');

      await n.updateComplete;

      done([n.hasAttribute('landscape'), n2.hasAttribute('landscape')] as A);
    }, elementName, elementName2);

    deepStrictEqual(values, [true, true] as A);
  });

  it(`renders with defined 'locale'`, async () => {
    type A = ExpectedValues<string | null, string>;

    const expectedLocale: string = 'ja-JP';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('locale', c);

      await n.updateComplete;

      done([
        n.getAttribute('locale'),
        n2.getAttribute('locale'),

        n.locale,
        n2.locale,
      ] as A);
    }, elementName, elementName2, expectedLocale);

    deepStrictEqual(values, [expectedLocale, null, expectedLocale, expectedLocale] as A);
  });

  it(`renders with defined 'disableddays'`, async () => {
    type A = ExpectedValues<string | null, string>;

    const expectedDisableddays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('disableddays', c);

      await n.updateComplete;

      done([
        n.getAttribute('disableddays'),
        n2.getAttribute('disableddays'),

        n.disabledDays,
        n2.disabledDays,
      ] as A);
    }, elementName, elementName2, expectedDisableddays);

    deepStrictEqual(values, [
      expectedDisableddays, null, expectedDisableddays, expectedDisableddays] as A);
  });

  it(`renders with defined 'disableddates'`, async () => {
    type A = ExpectedValues<string | null, string>;

    const expectedDisableddates: string = '2020-02-02,2020-02-15';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('disableddates', c);

      await n.updateComplete;

      done([
        n.getAttribute('disableddates'),
        n2.getAttribute('disableddates'),

        n.disabledDates,
        n2.disabledDates,
      ] as A);
    }, elementName, elementName2, expectedDisableddates);

    deepStrictEqual(values, [
      expectedDisableddates, null, expectedDisableddates, expectedDisableddates] as A);
  });

  it(`renders with defined 'weekLabel'`, async () => {
    type A = ExpectedValues<string | null, string>;

    const expectedWeeklabel: string = '周数';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('weeklabel', c);

      await n.updateComplete;

      done([
        n.getAttribute('weeklabel'),
        n2.getAttribute('weeklabel'),

        n.weekLabel,
        n2.weekLabel,
      ] as A);
    }, elementName, elementName2, expectedWeeklabel);

    deepStrictEqual(values, [
      expectedWeeklabel, null, expectedWeeklabel, expectedWeeklabel] as A);
  });

  it(`renders with different 'firstdayofweek' and 'disableddays'`, async () => {
    type A = ExpectedValues<[string, string | null], [number, string]>;

    const expectedFirstdayofweek: string = '1';
    const expectedDisableddays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n: AppDatepickerDialog = document.body.querySelector(a)!;
      const n2: AppDatepicker = n.shadowRoot!.querySelector(b)!;

      n.setAttribute('firstdayofweek', c);
      n.setAttribute('disableddays', d);

      await n.updateComplete;

      done([
        [n.getAttribute('firstdayofweek'), n.getAttribute('disableddays')],
        [n2.getAttribute('firstdayofweek'), n2.getAttribute('disableddays')],

        [n.firstDayOfWeek, n.disabledDays],
        [n2.firstDayOfWeek, n2.disabledDays],
      ] as A);
    }, elementName, elementName2, expectedFirstdayofweek, expectedDisableddays);

    deepStrictEqual(values, [
      [expectedFirstdayofweek, expectedDisableddays],
      [expectedFirstdayofweek, null],

      [Number(expectedFirstdayofweek), expectedDisableddays],
      [Number(expectedFirstdayofweek), expectedDisableddays],
    ] as A);
  });

});
