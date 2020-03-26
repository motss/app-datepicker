import { APP_INDEX_URL } from './constants.js';
import {
  ok,
} from './helpers/typed-assert.js';

function hasFullICU() {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
}

describe('full-icu', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  it(`supports full ICU`, async () => {
    ok(hasFullICU());
  });

});
