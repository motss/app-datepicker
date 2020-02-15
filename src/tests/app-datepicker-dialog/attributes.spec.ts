import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::attributes`, () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.createElement(a);

      el.min = '2000-01-01';

      document.body.appendChild(el);

      await el.open();
      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<AppDatepickerDialog>(a)!;

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (a, done) => {
      const el = document.body.querySelector<AppDatepickerDialog>(a)!;

      el.setAttribute('min', '2020-01-15');
      el.setAttribute('value', '2020-01-17');

      await el.updateComplete;

      done();
    }, elementName);

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/attributes-1-${browserName}.png`);
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
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done([
        n.getAttribute('firstdayofweek'),
        n2.getAttribute('firstdayofweek'),

        n.getAttribute('startview'),
        n2.getAttribute('startview'),

        n.getAttribute('weeknumbertype'),
        n2.getAttribute('weeknumbertype'),
      ] as A);
    }, elementName, elementName2);

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
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('min', c);

      await n.updateComplete;

      done([n.getAttribute('min'), n2.getAttribute('min')] as A);
    }, elementName, elementName2, expectedMin);

    allStrictEqual(values, expectedMin);
  });

  it(`renders with defined 'max'`, async () => {
    type A = [string, string];

    const expectedMax = '2020-02-27';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('max', c);

      await n.updateComplete;

      done([n.getAttribute('max'), n2.getAttribute('max')] as A);
    }, elementName, elementName2, expectedMax);

    allStrictEqual(values, expectedMax);
  });

  it(`renders with defined 'value'`, async () => {
    type A = [boolean, boolean, string, string];

    const expectedValue = '2020-02-20';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

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
    type A = [string, string];

    const expectedStartview: StartView = 'calendar';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('startview', c);

      await n.updateComplete;

      done([n.getAttribute('startview'), n2.getAttribute('startview')] as A);
    }, elementName, elementName2, expectedStartview);

    allStrictEqual(values, expectedStartview);
  });

  it(`renders with defined 'firstdayofweek'`, async () => {
    type A = [string, string];

    const expectedFirstdayofweek = '1';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('firstdayofweek', c);

      await n.updateComplete;

      done([n.getAttribute('firstdayofweek'), n2.getAttribute('firstdayofweek')] as A);
    }, elementName, elementName2, expectedFirstdayofweek);

    allStrictEqual(values, expectedFirstdayofweek);
  });

  it(`renders with defined 'showeeknumber'`, async () => {
    type A = [boolean, boolean];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('showweeknumber', '');

      await n.updateComplete;

      done([n.hasAttribute('showweeknumber'), n2.hasAttribute('showweeknumber')] as A);
    }, elementName, elementName2);

    allStrictEqual(values, true);
  });

  it(`renders with defined 'weeknumbertype'`, async () => {
    type A = [WeekNumberType, WeekNumberType];

    const expectedWeeknumbertype: WeekNumberType = 'first-4-day-week';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('weeknumbertype', c);

      await n.updateComplete;

      done([n.getAttribute('weeknumbertype'), n2.getAttribute('weeknumbertype')] as A);
    }, elementName, elementName2, expectedWeeknumbertype);

    allStrictEqual(values, expectedWeeknumbertype);
  });

  it(`renders with defined 'landscape'`, async () => {
    type A = [boolean, boolean];

    const values: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('landscape', '');

      await n.updateComplete;

      done([n.hasAttribute('landscape'), n2.hasAttribute('landscape')] as A);
    }, elementName, elementName2);

    allStrictEqual(values, true);
  });

  it(`renders with defined 'locale'`, async () => {
    type A = [string, null, string, string];

    const expectedLocale: string = 'ja-JP';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

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
    type A = [string, null, string, string];

    const expectedDisableddays: string = '3,5';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

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
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;

      n.setAttribute('disableddates', c);

      await n.updateComplete;

      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      done([
        n.getAttribute('disableddates'),
        n2.getAttribute('disableddates'),

        n.disabledDates,
        n2.disabledDates,
      ] as A);
    }, elementName, elementName2, expectedDisableddates);

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
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

      n.setAttribute('dragratio', `${c}`);

      await n.updateComplete;

      done([
        n.dragRatio,
        n2.dragRatio,
        n.getAttribute('dragratio'),
      ] as A);
    }, elementName, elementName2, dragRatio);

    allStrictEqual([prop, prop2], dragRatio);
    strictEqual(attr, `${dragRatio}`);
  });

  it(`renders with defined 'weekLabel'`, async () => {
    type A = [string, null, string, string];

    const expectedWeeklabel: string = '周数';
    const values: A = await browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

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
      expectedWeeklabel,
      null,
      expectedWeeklabel,
      expectedWeeklabel,
    ] as A);
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
      const n = document.body.querySelector<AppDatepickerDialog>(a)!;
      const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

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
    }, elementName, elementName2, expectedFirstdayofweek, expectedDisableddays);

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
