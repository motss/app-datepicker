import { describe, expect, it } from 'vitest';

import { toNextSelectedYear } from '../../year-grid/to-next-selected-year';
import type { ToNextSelectableYearInit } from '../../year-grid/typings';

describe(toNextSelectedYear.name, () => {
  const defaultInit: ToNextSelectableYearInit = {
    key: 'ArrowUp',
    max: new Date('2021-01-01'),
    min: new Date('2019-01-01'),
    year: 2020,
  };
  const defaultInitWithGrid: ToNextSelectableYearInit = {
    key: 'ArrowUp',
    max: new Date('2032-01-01'),
    min: new Date('2017-01-01'),
    year: 2022,
  };

  it.each<{
    $_value: number;
    partialInit: Partial<ToNextSelectableYearInit>;
  }>([
    // cap at min or max
  {
    $_value: defaultInit.min.getUTCFullYear(),
    partialInit: {},
  },
  {
    $_value: defaultInit.max.getUTCFullYear(),
    partialInit: { key: 'ArrowDown' },
  },
  {
    $_value: defaultInit.min.getUTCFullYear(),
    partialInit: { key: 'ArrowLeft' },
  },
  {
    $_value: defaultInit.max.getUTCFullYear(),
    partialInit: { key: 'ArrowRight' },
  },
  {
    $_value: defaultInit.max.getUTCFullYear(),
    partialInit: { key: 'End' },
  },
  {
    $_value: defaultInit.min.getUTCFullYear(),
    partialInit: { key: 'Home' },
  },
  {
    $_value: defaultInit.year,
    partialInit: { key: ' ' },
  },

  // within min and max
  {
    $_value: defaultInitWithGrid.year - 4,
    partialInit: { ...defaultInitWithGrid },
  },
  {
    $_value: defaultInitWithGrid.year + 4,
    partialInit: { ...defaultInitWithGrid, key: 'ArrowDown' },
  },
  {
    $_value: defaultInitWithGrid.year - 1,
    partialInit: { ...defaultInitWithGrid, key: 'ArrowLeft' },
  },
  {
    $_value: defaultInitWithGrid.year + 1,
    partialInit: { ...defaultInitWithGrid, key: 'ArrowRight' },
  },
  {
    $_value: defaultInitWithGrid.max.getUTCFullYear(),
    partialInit: { ...defaultInitWithGrid, key: 'End' },
  },
  {
    $_value: defaultInitWithGrid.min.getUTCFullYear(),
    partialInit: { ...defaultInitWithGrid, key: 'Home' },
  },
  {
    $_value: defaultInitWithGrid.year,
    partialInit: { ...defaultInitWithGrid, key: ' ' },
  },
  ])('returns next selected year (init=$partialInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toNextSelectedYear({
      ...defaultInit,
      ...partialInit,
    });

    expect(result).toBe($_value);
  });

});
