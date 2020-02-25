import { DATEPICKER_NAME } from '../../constants.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
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

      el.min = '2000-01-01';
      el.value = '2020-02-02';

      document.body.appendChild(el);
      await el.updateComplete;

      done();
    }, DATEPICKER_NAME);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<Datepicker>(a)!;

      document.body.removeChild(el);

      done();
    }, DATEPICKER_NAME);
  });

  it(`updates month after navigating with keyboard and mouse`, async () => {
    type A = [string, string];

    const getValues = () => browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<Datepicker>(a)!;

      const calendarLabel = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

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
  const getValuesAfterKeys = async (key: number, altKey: boolean = false): Promise<B> => {
    await browser.executeAsync(async (a, done) => {
      const n = document.body.querySelector<Datepicker>(a)!;

      n.min = '2000-01-01';
      n.value = '2020-02-29';

      await n.updateComplete;

      done();
    }, DATEPICKER_NAME);

    await clickElements(Array.from('123', () => (
      `.btn__month-selector[aria-label="Next month"]`
    )));

    await focusCalendarsContainer();
    await browserKeys(key, altKey);

    const [prop, content]: B = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<Datepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

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
    const focusedContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedContents.push(focusedDateContent);
    }

    allStrictEqual(props, '2020-05-01');
    allStrictEqual(focusedContents, prettyHtml`
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
    const focusedContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2020-05-01', '2020-05-31']);
    deepStrictEqual(focusedContents, [1, 31].map(n => prettyHtml(`
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
    const focusedContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);

      props.push(prop);
      focusedContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2020-06-01', '2020-04-01']);
    deepStrictEqual(focusedContents, ['Jun', 'Apr'].map(n => prettyHtml(`
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
    const focusedContents: string[] = [];

    for (const arrowKey of arrowKeys) {
      const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey, true);

      props.push(prop);
      focusedContents.push(focusedDateContent);
    }

    deepStrictEqual(props, ['2021-05-01', '2019-05-01']);
    deepStrictEqual(focusedContents, [2021, 2019].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May 1, ${n}" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `)));
  });

});
