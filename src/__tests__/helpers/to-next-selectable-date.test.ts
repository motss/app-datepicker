import { expect } from '@open-wc/testing';

import { toNextSelectableDate } from '../../helpers/to-next-selectable-date';
import type { ToNextSelectableDateInit } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toNextSelectableDate.name, () => {
  const defaultInit: ToNextSelectableDateInit = {
    date: new Date('2020-02-02'),
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
    key: 'ArrowRight',
    maxTime: +new Date('2020-03-03'),
    minTime: +new Date('2020-01-01'),
  };

  type CaseNextSelectableDateFOrNonDisabledDate = [
    partialInit: Partial<ToNextSelectableDateInit>,
    expected: Date
  ];
  const casesNextSelectableDateForNonDisabledDate: CaseNextSelectableDateFOrNonDisabledDate[] = [
    [
      {},
      new Date('2020-02-02'),
    ],
    [
      {
        maxTime: +new Date('2020-02-02'),
        minTime: +new Date('2020-02-02'),
      },
      new Date('2020-02-02'),
    ],
  ];
  casesNextSelectableDateForNonDisabledDate.forEach((a) => {
    const [partialInit, expected] = a;

    it(
      messageFormatter('returns next selectable date for non-disabled date (%j)', a),
      () => {
        const result = toNextSelectableDate({
          ...defaultInit,
          ...partialInit,
        });

        expect(result).deep.equal(expected);
      }
    );
  });

  type CaseNextSelectableDateForDisabledDate = [
    partialInit: Partial<ToNextSelectableDateInit>,
    expected: Date
  ];
  const casesNextSelectableDateForDisabledDate: CaseNextSelectableDateForDisabledDate[] = [
    // disabled dates to non-disabled dates
    [
      {
        disabledDatesSet: new Set([+new Date('2020-02-02')]),
        key: 'ArrowLeft',
      },
      new Date('2020-02-01'),
    ],
    [
      {
        disabledDatesSet: new Set([+new Date('2020-02-02')]),
        key: 'ArrowRight',
      },
      new Date('2020-02-03'),
    ],

    // > 1 disabled dates to non-disabled dates
    [
      {
        disabledDatesSet: new Set([
          +new Date('2020-02-01'),
          +new Date('2020-02-02'),
        ]),
        key: 'ArrowLeft',
      },
      new Date('2020-01-31'),
    ],
    [
      {
        disabledDatesSet: new Set([
          +new Date('2020-02-02'),
          +new Date('2020-02-03'),
        ]),
        key: 'ArrowRight',
      },
      new Date('2020-02-04'),
    ],

    // > 1 disabled dates to non-disabled dates with min/ max dates
    [
      {
        disabledDatesSet: new Set([
          +new Date('2020-02-01'),
          +new Date('2020-02-02'),
        ]),
        key: 'ArrowLeft',
        minTime: +new Date('2020-01-31'),
      },
      new Date('2020-01-31'),
    ],
    [
      {
        disabledDatesSet: new Set([
          +new Date('2020-02-02'),
          +new Date('2020-02-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-02-04'),
      },
      new Date('2020-02-04'),
    ],

    // disabled date before min to min
    [
      {
        date: new Date('2019-02-02'),
        key: 'ArrowLeft',
      },
      new Date(defaultInit.minTime),
    ],
    [
      {
        date: new Date('2019-02-02'),
        key: 'ArrowRight',
      },
      new Date(defaultInit.minTime),
    ],

    // disabled date after max to max
    [
      {
        date: new Date('2020-04-03'),
        key: 'ArrowRight',
      },
      new Date(defaultInit.maxTime),
    ],
    [
      {
        date: new Date('2020-04-03'),
        key: 'ArrowLeft',
      },
      new Date(defaultInit.maxTime),
    ],

    // disabled min/ max to non-disabled date after/ before min/ max
    [
      {
        date: new Date('2020-02-01'),
        disabledDatesSet: new Set([
          +new Date('2020-02-01'),
        ]),
        key: 'ArrowLeft',
        minTime: +new Date('2020-02-01'),
      },
      new Date('2020-02-02'),
    ],
    [
      {
        date: new Date('2020-04-03'),
        disabledDatesSet: new Set([
          +new Date('2020-04-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-04-03'),
      },
      new Date('2020-04-02'),
    ],

    // disabled max to non-disabled min
    [
      {
        date: new Date('2020-04-03'),
        disabledDatesSet: new Set([
          +new Date('2020-04-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-04-03'),
        minTime: +new Date('2020-04-02'),
      },
      new Date('2020-04-02'),
    ],
  ];
  casesNextSelectableDateForDisabledDate.forEach((a) => {
    const [partialInit, expected] = a;

    it(
      messageFormatter('returns next selectable date for disabled date (%j)', a),
      () => {
        const result = toNextSelectableDate({
          ...defaultInit,
          ...partialInit,
        });

        expect(result).deep.equal(expected);
      }
    );
  });

});
