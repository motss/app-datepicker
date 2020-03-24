import { APP_INDEX_URL } from './constants.js';
import {
  ok,
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
  });

});
