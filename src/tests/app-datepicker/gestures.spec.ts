import { DATEPICKER_NAME } from '../../constants.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import type { PrepareOptions } from '../custom_typings.js';
import { interaction } from '../helpers/interaction.js';
import type { DragOptions } from '../helpers/interaction.js';
import {
  allStrictEqual,
} from '../helpers/typed-assert.js';

describe('gestures', () => {
  const isSafari = browser.capabilities.browserName === 'Safari';
  const { dragCalendarsContainer } = interaction({ isSafari, elementName: DATEPICKER_NAME });
  const actionTypes: DragOptions['type'][] = ['mouse', 'touch'];
  const setup = () => browser.executeAsync(async (a, done) => {
    const el: Datepicker = document.createElement(a);

    document.body.appendChild(el);

    el.locale = 'en-US';

    await el.updateComplete;

    done();
  }, DATEPICKER_NAME);
  const cleanup = () => browser.executeAsync((a, done) => {
    const els = document.body.querySelectorAll(a) as unknown as Datepicker[];

    els.forEach(n => document.body.removeChild(n));

    done();
  }, DATEPICKER_NAME);

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
