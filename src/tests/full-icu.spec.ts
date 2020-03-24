import { getResolvedLocale } from '../helpers/get-resolved-locale.js';
import { APP_INDEX_URL } from './constants.js';
import {
  ok, strictEqual,
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

  it(`supports full ICU`, () => {
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
  });

});
