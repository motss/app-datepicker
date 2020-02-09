import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { APP_INDEX_URL } from '../constants.js';
import { DragOptions, interaction } from '../helpers/interaction.js';
import {
  allStrictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe('gestures', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const actionTypes: DragOptions['type'][] = ['mouse', 'touch'];
  const setup = () => browser.executeAsync(async (a, done) => {
    const el: AppDatepickerDialog = document.createElement(a);

    document.body.appendChild(el);

    await el.open();
    await el.updateComplete;

    done();
  }, elementName);
  const cleanup = () => browser.executeAsync((a, done) => {
    const el = document.body.querySelector<AppDatepickerDialog>(a);

    if (el) document.body.removeChild(el);

    done();
  }, elementName);

  const { dragCalendarsContainer } = interaction({ elementName, elementName2, isSafari });

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
