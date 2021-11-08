import { DATEPICKER_NAME } from '../../constants.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import type { PrepareOptions } from '../custom_typings.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { interaction } from '../helpers/interaction.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe('edge cases', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const {
    browserKeys,
    clickElements,
    focusCalendarsContainer,
  } = interaction({ isSafari, elementName: DATEPICKER_NAME });

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: Datepicker = document.createElement(a);

      el.locale = 'en-US';
      el.min = '2000-01-01';
      el.value = '2020-02-02';

      document.body.appendChild(el);
      await el.updateComplete;

      done();
    }, DATEPICKER_NAME);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a) as Datepicker;

      document.body.removeChild(el);

      done();
    }, DATEPICKER_NAME);
  });

  it(`updates month after navigating with keyboard and mouse`, async () => {
    type A = [string, string];

    const getValues = () => browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      const calendarLabel = n.shadowRoot!.querySelector(b) as HTMLDivElement;

      done([
        n.value,
        calendarLabel.outerHTML,
      ] as A);
    }, DATEPICKER_NAME, toSelector('.calendar-label'));

    await focusCalendarsContainer();
    await browserKeys(KEY_CODES_MAP.PAGE_DOWN);
    await browserKeys(KEY_CODES_MAP.PAGE_DOWN);

    const [prop, calendarLabelContent] = await getValues();

    await clickElements([
      `.btn__month-selector[aria-label="Previous month"]`,
    ]);

    const [prop2, calendarLabelContent2] = await getValues();

    allStrictEqual([prop, prop2], '2020-04-02');
    strictEqual(cleanHtml(calendarLabelContent), prettyHtml`
    <div class="calendar-label">April 2020</div>
    `);
    strictEqual(cleanHtml(calendarLabelContent2), prettyHtml`
    <div class="calendar-label">March 2020</div>
    `);
  });

  // #region helper
  type B = [string, string];
  const getValuesAfterKeys = async (
    key: number,
    altKey: boolean = false,
    prepareOptions?: PrepareOptions
  ): Promise<B> => {
    await browser.executeAsync(async (a, b: PrepareOptions, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      if (b) {
        const attrs = b.attrs ?? {};
        const props = b.props ?? {};

        Object.keys(attrs ?? {}).forEach((k) => {
          (n as any)[k] = (attrs as any)[k];
        });

        Object.keys(props ?? {}).forEach((k) => {
          (n as any)[k] = (props as any)[k];
        });
      } else {
        n.min = '2000-01-01';
        n.value = '2020-02-29';
      }

      await n.updateComplete;

      done();
    }, DATEPICKER_NAME, prepareOptions);

    await clickElements(Array.from('123', () => (
      `.btn__month-selector[aria-label="Next month"]`
    )));

    await focusCalendarsContainer();
    await browserKeys(key, altKey);

    const [prop, content]: B = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector(a) as Datepicker;

      const focusedDate = n.shadowRoot!.querySelector(b) as HTMLTableCellElement;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as B);
    }, DATEPICKER_NAME, toSelector('.day--focused'));

    return [prop, cleanHtml(content)];
  };
  // #endregion helper

  it(`focuses first day of month when focused date does not exist (Arrows)`, async () => {
    const arrowKeys: KEY_CODES_MAP[] = [
      KEY_CODES_MAP.ARROW_DOWN,
      KEY_CODES_MAP.ARROW_LEFT,
      KEY_CODES_MAP.ARROW_RIGHT,
      KEY_CODES_MAP.ARROW_UP,
    ];
    const props: string[] = [];
    const focusedDateContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedDateContents.push(focusedDateContent);
    }

    allStrictEqual(props, '2020-05-01');
    allStrictEqual(focusedDateContents, prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
  });

  it(`focuses first day of month when focused date does not exist (Home, End)`, async () => {
    const arrowKeys: KEY_CODES_MAP[] = [
      KEY_CODES_MAP.HOME,
      KEY_CODES_MAP.END,
    ];
    const props: string[] = [];
    const focusedDateContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedDateContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2020-05-01', '2020-05-31']);
    deepStrictEqual(focusedDateContents, [1, 31].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May ${n}, 2020" aria-selected="true">
      <div class="calendar-day">${n}</div>
    </td>
    `)));
  });

  it(`focuses first day of month when focused date does not exist (PageDown, PageUp)`,
  async () => {
    const arrowKeys: KEY_CODES_MAP[] = [
      KEY_CODES_MAP.PAGE_DOWN,
      KEY_CODES_MAP.PAGE_UP,
    ];
    const props: string[] = [];
    const focusedDateContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedDateContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2020-06-01', '2020-04-01']);
    deepStrictEqual(focusedDateContents, ['Jun', 'Apr'].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="${n} 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `)));
  });

  it(`focuses first day of month when focused date does not exist (Alt + {PageDown, PageUp})`,
  async () => {
    const arrowKeys: KEY_CODES_MAP[] = [
      KEY_CODES_MAP.PAGE_DOWN,
      KEY_CODES_MAP.PAGE_UP,
    ];
    const props: string[] = [];
    const focusedDateContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey, true);

      props.push(prop);
      focusedDateContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2021-05-01', '2019-05-01']);
    deepStrictEqual(focusedDateContents, [2021, 2019].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May 1, ${n}" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `)));
  });

  it(`focuses first focusable day of month (Enter, Space)`, async () => {
    const keys: KEY_CODES_MAP[] = [KEY_CODES_MAP.ENTER, KEY_CODES_MAP.SPACE];
    const props: string[] = [];
    const focusedDateContents: string[] = [];

    for (const key of keys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(key, false, {
        props: {
          min: '2000-01-01',
          value: '2019-11-30',
        },
      });

      props.push(prop);
      focusedDateContents.push(focusedDateContent);
    }

    allStrictEqual(props, '2020-02-01');
    allStrictEqual(focusedDateContents.map(n => cleanHtml(n)), prettyHtml`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
  });

  it(`reset invalid 'value' to 'min' or 'max'`, async () => {
    type A = [string, string, string, string];

    const inputs: [string, string, undefined | string][] = [
      // Reset to 'min'
      ['2020-02-02', '2020-02-27', '2020-01-01'],

      // Reset to 'max'
      ['2020-02-02', '2020-02-27', '2020-03-01'],
      ['2020-02-02', '2020-02-27', ''],
      ['2020-02-02', '2020-02-27', 'lol'],
      ['2020-02-02', '2020-02-27', undefined],
    ];
    const maxValues: string[] = [];
    const minValues: string[] = [];
    const values: string[] = [];
    const focusedDateContents: string[] = [];

    for (const input of inputs) {
      const [
        minProp,
        maxProp,
        valueProp,
        focusedDateContent,
      ]: A = await browser.executeAsync(async (a, b, c, d, e, done) => {
        const n = document.body.querySelector(a) as Datepicker;

        n.min = b;
        n.max = c;
        n.value = d;

        while (!(await n.updateComplete)) {
          /** Loop until all renders complete (Chrome needs this but not FF) */
        }

        const focusedDate = n.shadowRoot!.querySelector(e) as HTMLTableCellElement;

        done([
          n.min,
          n.max,
          n.value,
          focusedDate?.outerHTML || '<empty>',
        ] as A);
      }, DATEPICKER_NAME, ...input, toSelector('.day--focused'));

      minValues.push(minProp);
      maxValues.push(maxProp);
      values.push(valueProp);
      focusedDateContents.push(focusedDateContent);
    }

    allStrictEqual(maxValues, '2020-02-27');
    allStrictEqual(minValues, '2020-02-02');
    deepStrictEqual(focusedDateContents.map(n => cleanHtml(n)), [
      prettyHtml`
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
        <div class="calendar-day">2</div>
      </td>
      `,
      ...Array.from('1234', () => prettyHtml(`
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
        <div class="calendar-day">27</div>
      </td>
      `)),
    ]);
  });

});
