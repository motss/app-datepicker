import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import type { DatepickerDialog } from '../../datepicker-dialog.js';
import { APP_INDEX_URL } from '../constants.js';
import type { DragOptions } from '../helpers/interaction.js';
import { interaction } from '../helpers/interaction.js';
import {
  allStrictEqual,
} from '../helpers/typed-assert.js';

describe('gestures', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const actionTypes: DragOptions['type'][] = ['mouse', 'touch'];
  const setup = () => browser.executeAsync(async (a, done) => {
    const el: DatepickerDialog = document.createElement(a);

    document.body.appendChild(el);

    el.locale = 'en-US';

    await el.open();
    await el.updateComplete;

    done();
  }, DATEPICKER_DIALOG_NAME);
  const cleanup = () => browser.executeAsync((a, done) => {
    const el = document.body.querySelector<DatepickerDialog>(a);

    if (el) document.body.removeChild(el);

    done();
  }, DATEPICKER_DIALOG_NAME);

  const { dragCalendarsContainer } = interaction({
    isSafari,
    elementName: DATEPICKER_DIALOG_NAME,
    elementName2: DATEPICKER_NAME,
  });

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  it(`drags calendar to the left`, async () => {
    const results: string[] = [];

    for (const a of actionTypes) {
      await setup();

      const labelText = await dragCalendarsContainer({
        x: 50,
        type: a,
      }, {
        props: {
          min: '2000-01-01',
          value: '2020-02-02',
        },
      });

      await cleanup();

      results.push(labelText);
    }

    allStrictEqual(results, 'January 2020');
  });

  it(`drags calendar to the right`, async () => {
    const results: string[] = [];

    for (const a of actionTypes) {
      await setup();

      const labelText = await dragCalendarsContainer({
        x: -50,
        type: a,
      }, {
        props: {
          min: '2020-02-01',
          max: '2021-02-02',
          value: '2020-02-02',
        },
      });

      await cleanup();

      results.push(labelText);
    }

    allStrictEqual(results, 'March 2020');
  });

});
