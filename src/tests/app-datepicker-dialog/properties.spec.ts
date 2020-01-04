import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual,
} from '../helpers/typed-assert.js';

type ExpectedValues<T> = [T, T];

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::properties`, () => {
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
      `./src/tests/snapshots/${elementName}/properties-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.body.querySelector(a)!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';

      await el.updateComplete;

      done();
    }, elementName);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/properties-1-${browserName}.png`);
  });

  it(`renders with initial properties`, async () => {
    type A = ExpectedValues<[number, WeekNumberType, StartView]>;

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      const props: string[] = [
        'firstDayOfWeek',
        'startView',
        'weekNumberType',
      ];

      done([
        props.map(p => (n as any)[p]),
        props.map(p => (n2 as any)[p]),
      ] as A);
    }, elementName, elementName2);

    deepStrictEqual(values, [
      [0, 'calendar' as StartView, 'first-4-day-week' as WeekNumberType],
      [0, 'calendar' as StartView, 'first-4-day-week' as WeekNumberType],
    ]);
  });

  it(`renders with defined 'min'`, async () => {
    type A = ExpectedValues<string>;

    const expectedMin = '2000-01-01';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.min = c;

      await n.updateComplete;

      done([n.min, n2.min] as A);
    }, elementName, elementName2, expectedMin);

    deepStrictEqual(values, [expectedMin, expectedMin]);
  });

  it(`renders with defined 'max'`, async () => {
    type A = ExpectedValues<string>;

    const expectedMax = '2020-02-27';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.max = c;

      await n.updateComplete;

      done([n.max, n2.max] as A);
    }, elementName, elementName2, expectedMax);

    deepStrictEqual(values, [expectedMax, expectedMax]);
  });

  it(`renders with defined 'value'`, async () => {
    type A = ExpectedValues<string>;

    const expectedValue = '2020-02-20';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.value = c;

      await n.updateComplete;

      done([n.value, n2.value] as A);
    }, elementName, elementName2, expectedValue);

    deepStrictEqual(values, [expectedValue, expectedValue]);
  });

  it(`renders with defined 'startView'`, async () => {
    type A = ExpectedValues<string>;

    const expectedStartView: StartView = 'calendar';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.startView = c;

      await n.updateComplete;

      done([n.startView, n2.startView] as A);
    }, elementName, elementName2, expectedStartView);

    deepStrictEqual(values, [expectedStartView, expectedStartView] as A);
  });

  it(`renders with defined 'firstDayOfWeek'`, async () => {
    type A = ExpectedValues<number>;

    const expectedFirstDayOfWeek = 1;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.firstDayOfWeek = c;

      await n.updateComplete;

      done([n.firstDayOfWeek, n2.firstDayOfWeek] as A);
    }, elementName, elementName2, expectedFirstDayOfWeek);

    deepStrictEqual(values, [expectedFirstDayOfWeek, expectedFirstDayOfWeek] as A);
  });

  it(`renders with defined 'showWeekNumber'`, async () => {
    type A = ExpectedValues<boolean>;

    const expectedShowWeekNumber: boolean = true;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.showWeekNumber = c;

      await n.updateComplete;

      done([n.showWeekNumber, n2.showWeekNumber] as A);
    }, elementName, elementName2, expectedShowWeekNumber);

    deepStrictEqual(values, [expectedShowWeekNumber, expectedShowWeekNumber] as A);
  });

  it(`renders with defined 'weekNumberType'`, async () => {
    type A = ExpectedValues<WeekNumberType>;

    const expectedWeekNumberType: WeekNumberType = 'first-4-day-week';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.weekNumberType = c;

      await n.updateComplete;

      done([n.weekNumberType, n2.weekNumberType] as A);
    }, elementName, elementName2, expectedWeekNumberType);

    deepStrictEqual(values, [expectedWeekNumberType, expectedWeekNumberType] as A);
  });

  it(`renders with defined 'landscape'`, async () => {
    type A = ExpectedValues<boolean>;

    const expectedLandscape: boolean = true;
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.landscape = c;

      await n.updateComplete;

      done([n.landscape, n2.landscape] as A);
    }, elementName, elementName2, expectedLandscape);

    deepStrictEqual(values, [expectedLandscape, expectedLandscape] as A);
  });

  it(`renders with defined 'locale'`, async () => {
    type A = ExpectedValues<string>;

    const expectedLocale: string = 'ja-JP';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.locale = c;

      await n.updateComplete;

      done([n.locale, n2.locale] as A);
    }, elementName, elementName2, expectedLocale);

    deepStrictEqual(values, [expectedLocale, expectedLocale] as A);
  });

  it(`renders with defined 'disabledDays'`, async () => {
    type A = ExpectedValues<string>;

    const expectedDisabledDays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.disabledDays = c;

      await n.updateComplete;

      done([n.disabledDays, n2.disabledDays] as A);
    }, elementName, elementName2, expectedDisabledDays);

    deepStrictEqual(values, [expectedDisabledDays, expectedDisabledDays] as A);
  });

  it(`renders with defined 'disabledDates'`, async () => {
    type A = ExpectedValues<string>;

    const expectedDisabledDates: string = '2020-02-02,2020-02-15';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.disabledDates = c;

      await n.updateComplete;

      done([n.disabledDates, n2.disabledDates] as A);
    }, elementName, elementName2, expectedDisabledDates);

    deepStrictEqual(values, [expectedDisabledDates, expectedDisabledDates] as A);
  });

  it(`renders with defined 'weekLabel'`, async () => {
    type A = ExpectedValues<string>;

    const expectedWeekLabel: string = '周数';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.weekLabel = c;

      await n.updateComplete;

      done([n.weekLabel, n2.weekLabel] as A);
    }, elementName, elementName2, expectedWeekLabel);

    deepStrictEqual(values, [expectedWeekLabel, expectedWeekLabel] as A);
  });

  it(`renders with different 'firstDayOfWeek' and 'disabledDays'`, async () => {
    type A = ExpectedValues<[number, string]>;

    const expectedFirstDayOfWeek: number = 1;
    const expectedDisabledDays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, d, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.firstDayOfWeek = c;
      n.disabledDays = d;

      await n.updateComplete;

      done([
        [n.firstDayOfWeek, n.disabledDays],
        [n2.firstDayOfWeek, n2.disabledDays],
      ] as A);
    }, elementName, elementName2, expectedFirstDayOfWeek, expectedDisabledDays);

    deepStrictEqual(values, [
      [expectedFirstDayOfWeek, expectedDisabledDays],
      [expectedFirstDayOfWeek, expectedDisabledDays],
    ] as A);
  });

});
