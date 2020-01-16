
import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { interaction } from '../helpers/interaction.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';

describe('edge cases', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const {
    browserKeys,
    clickElements,
    focusCalendarsContainer,
  } = interaction(elementName, isSafari);

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      el.min = '2000-01-01';
      el.value = '2020-02-02';

      document.body.appendChild(el);
      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a)!;

      document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`updates month after navigating with keyboard and mouse`, async () => {
    type A = [string, string];

    const getValues = () => browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const calendarLabel = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      done([
        n.value,
        calendarLabel.outerHTML,
      ] as A);
    }, elementName, toSelector('.calendar-label'));

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

});
