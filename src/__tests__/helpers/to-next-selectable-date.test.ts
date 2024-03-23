import { describe, expect, it } from 'vitest';

import { toNextSelectableDate } from '../../helpers/to-next-selectable-date';
import type { ToNextSelectableDateInit } from '../../helpers/types';

describe(toNextSelectableDate.name, () => {
  const defaultInit: ToNextSelectableDateInit = {
    date: new Date('2020-02-02'),
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
    key: 'ArrowRight',
    maxTime: +new Date('2020-03-03'),
    minTime: +new Date('2020-01-01'),
  };

  it.each<{
    $_value: Date;
    partialInit: Partial<ToNextSelectableDateInit>;
  }>([
    {
      $_value: new Date('2020-02-02'),
      partialInit: {},
    },
    {
      $_value: new Date('2020-02-02'),
      partialInit: {
        maxTime: +new Date('2020-02-02'),
        minTime: +new Date('2020-02-02'),
      },
    },
  ])(
    'returns next selectable date for non-disabled date ($partialInit)',
    ({ $_value, partialInit }) => {
      const result = toNextSelectableDate({
        ...defaultInit,
        ...partialInit,
      });

      expect(result).toEqual($_value);
    }
  );

  it.each<{
    $_value: Date;
    partialInit: Partial<ToNextSelectableDateInit>;
  }>([
    // disabled dates to non-disabled dates
    {
      $_value: new Date('2020-02-01'),
      partialInit: {
        disabledDatesSet: new Set([+new Date('2020-02-02')]),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: new Date('2020-02-03'),
      partialInit: {
        disabledDatesSet: new Set([+new Date('2020-02-02')]),
        key: 'ArrowRight',
      },
    },

    // > 1 disabled dates to non-disabled dates
    {
      $_value: new Date('2020-01-31'),
      partialInit: {
        disabledDatesSet: new Set([
          +new Date('2020-02-01'),
          +new Date('2020-02-02'),
        ]),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: new Date('2020-02-04'),
      partialInit: {
        disabledDatesSet: new Set([
          +new Date('2020-02-02'),
          +new Date('2020-02-03'),
        ]),
        key: 'ArrowRight',
      },
    },

    // > 1 disabled dates to non-disabled dates with min/ max dates
    {
      $_value: new Date('2020-01-31'),
      partialInit: {
        disabledDatesSet: new Set([
          +new Date('2020-02-01'),
          +new Date('2020-02-02'),
        ]),
        key: 'ArrowLeft',
        minTime: +new Date('2020-01-31'),
      },
    },
    {
      $_value: new Date('2020-02-04'),
      partialInit: {
        disabledDatesSet: new Set([
          +new Date('2020-02-02'),
          +new Date('2020-02-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-02-04'),
      },
    },

    // disabled date before min to min
    {
      $_value: new Date(defaultInit.minTime),
      partialInit: {
        date: new Date('2019-02-02'),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: new Date(defaultInit.minTime),
      partialInit: {
        date: new Date('2019-02-02'),
        key: 'ArrowRight',
      },
    },

    // disabled date after max to max
    {
      $_value: new Date(defaultInit.maxTime),
      partialInit: {
        date: new Date('2020-04-03'),
        key: 'ArrowRight',
      },
    },
    {
      $_value: new Date(defaultInit.maxTime),
      partialInit: {
        date: new Date('2020-04-03'),
        key: 'ArrowLeft',
      },
    },

    // disabled min/ max to non-disabled date after/ before min/ max
    {
      $_value: new Date('2020-02-02'),
      partialInit: {
        date: new Date('2020-02-01'),
        disabledDatesSet: new Set([+new Date('2020-02-01')]),
        key: 'ArrowLeft',
        minTime: +new Date('2020-02-01'),
      },
    },
    {
      $_value: new Date('2020-04-02'),
      partialInit: {
        date: new Date('2020-04-03'),
        disabledDatesSet: new Set([+new Date('2020-04-03')]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-04-03'),
      },
    },

    // disabled max to non-disabled min
    {
      $_value: new Date('2020-04-02'),
      partialInit: {
        date: new Date('2020-04-03'),
        disabledDatesSet: new Set([+new Date('2020-04-03')]),
        key: 'ArrowRight',
        maxTime: +new Date('2020-04-03'),
        minTime: +new Date('2020-04-02'),
      },
    },
  ])(
    'returns next selectable date for disabled date ($partialInit)',
    ({ $_value, partialInit }) => {
      const result = toNextSelectableDate({
        ...defaultInit,
        ...partialInit,
      });

      expect(result).toEqual($_value);
    }
  );
});
