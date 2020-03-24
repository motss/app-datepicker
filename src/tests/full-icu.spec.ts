import { getResolvedLocale } from '../helpers/get-resolved-locale.js';
import { APP_INDEX_URL } from './constants.js';
import {
  deepStrictEqual,
  ok,
  strictEqual,
} from './helpers/typed-assert.js';

describe('timezones', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  function hasFullICU() {
    try {
      const january = new Date(9e8);
      const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
      return spanish.format(january) === 'enero';
    } catch (err) {
      return false;
    }
  }

  it(`supports full ICU`, async () => {
    ok(hasFullICU());
    strictEqual(
      Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date('2020-02-02')),
      'Feb 2, 2020'
    );
    strictEqual(getResolvedLocale(), 'en-US');

    const content = await browser.executeAsync(async (done) => {
      const a = document.createElement('app-datepicker');

      document.body.appendChild(a);

      await a.updateComplete;

      done(
        [
          a.locale,
          (a as any)._formatters.fullDateFormat(new Date('2020-03-03')),
        ]
        // a.locale,
        // Array.from(
        //   a.shadowRoot?.querySelectorAll('.full-calendar__day') ?? []
        // )[2]?.outerHTML ?? 'nil'
      );
    });

    console.debug('1', content, Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date('2020-03-03')));
    deepStrictEqual(content, []);
  });

});
