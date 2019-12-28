import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { queryEl } from '../helpers/query-el.js';
import {
  ok
} from '../helpers/typed-assert.js';

describe('gestures', () => {
  const elementName = 'app-datepicker';

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-02-20';

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`switches to year list view`, async () => {
    const el = await $(elementName);
    const yearSelectorButton = await el.shadow$('.btn__year-selector');

    yearSelectorButton.click();

    const yearListView = await el.shadow$('.datepicker-body__year-list-view');

    ok(yearListView.isExisting());
  });

  it(`switches to calendar view`, async () => {
    const el = await queryEl(elementName, async (done) => {
      const n: AppDatepicker = document.body.querySelector('app-datepicker')!;

      n.startView = 'yearList';

      await n.updateComplete;

      done();
    });

    const calendarSelectorButton = await el.shadow$('.btn__calendar-selector');

    calendarSelectorButton.click();

    const calendarView = await el.shadow$('.datepicker-body__calendar-view');

    ok(calendarView.isExisting());
  });

});
