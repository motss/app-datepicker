import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual,
} from '../helpers/typed-assert.js';
import { getAllDateStrings } from '../timezones.js';

const elementName = 'app-datepicker';

describe('timezones', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-01-01';

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector<AppDatepicker>(a)!;

      document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(
      `./src/tests/snapshots/${elementName}/timezones-${browserName}.png`);
  });

  it(`resolves to the correct 'value' in different timezones`, async function timezoneTests() {
    /**
     * Some browsers require more time to run this test as the tests date used here is
     * considerably large that makes some browsers to take quite some time to update the
     * element in terms of layout and paint.
     */
    this.timeout(90e3);

    const allDateStrings = getAllDateStrings();
    const results: string[] = [];
    const expected: string[] = allDateStrings.map(n => n[1].value);

    for (const n of allDateStrings) {
      const valueProp = await browser.executeAsync(
        async (a: string, b: string, done: (a: string) => void) => {
          const el = document.body.querySelector<AppDatepicker>(a)!;

          el.value = b;

          await el.updateComplete;

          return done(el.value);
        },
        elementName,
        n[1].date
      );

      results.push(valueProp);
    }

    deepStrictEqual(results, expected);
  });

});
