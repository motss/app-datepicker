import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { PrepareOptions } from '../custom_typings.js';
import { DragOptions, interaction } from '../helpers/interaction.js';
import {
  allStrictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';

describe('gestures', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const { dragCalendarsContainer } = interaction({ elementName, isSafari });
  const actionTypes: DragOptions['type'][] = ['mouse', 'touch'];
  const setup = () => browser.executeAsync(async (a, done) => {
    const el: AppDatepicker = document.createElement(a);

    document.body.appendChild(el);

    await el.updateComplete;

    done();
  }, elementName);
  const cleanup = () => browser.executeAsync((a, done) => {
    const el = document.body.querySelector<AppDatepicker>(a);

    if (el) document.body.removeChild(el);

    done();
  }, elementName);

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

  it(`does not drag calendar`, async function doesNotDragCalendar() {
    const opts = actionTypes.reduce<[DragOptions, PrepareOptions][]>((p, n) => {
      return p.concat([
        [{
          x: 10,
          step: 1, // Use smaller step for small value of x
          type: n,
        }, {
          props: {
            min: '2000-01-01',
            value: '2020-02-01',
          },
        }],
        [{
          x: 50,
          type: n,
        }, {
          props: {
            min: '2020-02-01',
            value: '2020-02-27',
          },
        }],
        [{
          x: -10,
          step: 1, // Use smaller step for small value of x
          type: n,
        }, {
          props: {
            min: '2000-01-01',
            max: '2021-01-01',
            value: '2020-02-01',
          },
        }],
        [{
          x: -50,
          type: n,
        }, {
          props: {
            min: '2000-01-01',
            max: '2020-02-27',
            value: '2020-02-01',
          },
        }],
      ]);
    }, []);
    const results: string[] = [];

    // Explicitly extend timeout based on the length of sequential tests.
    this.timeout(opts.length * 10e3);

    for (const opt of opts) {
      await setup();

      const labelText = await dragCalendarsContainer(...opt);

      await cleanup();

      results.push(labelText);
    }

    allStrictEqual(results, 'February 2020');
  });

  it(`continues dragging after reaching the min/ max date`, async () => {
    const opts = actionTypes.reduce<[DragOptions, PrepareOptions][]>((p, n) => {
      return p.concat([
        [{
          x: 50,
          x2: -100,
          type: n,
        }, {
          props: {
            min: '2020-02-01',
            max: '2021-02-01',
            value: '2020-02-27',
          },
        }],
        [{
          x: -100,
          x2: 50,
          type: n,
        }, {
          props: {
            min: '2000-01-01',
            max: '2020-04-27',
            value: '2020-04-21',
          },
        }],
      ]);
    }, []);
    const results: string[] = [];

    for (const opt of opts) {
      await setup();

      const labelText = await dragCalendarsContainer(...opt);

      await cleanup();

      results.push(labelText);
    }

    allStrictEqual(results, 'March 2020');
  });

});
