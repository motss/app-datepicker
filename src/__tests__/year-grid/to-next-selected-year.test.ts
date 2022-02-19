import { expect } from '@open-wc/testing';

import { toNextSelectedYear } from '../../year-grid/to-next-selected-year';
import type { ToNextSelectableYearInit } from '../../year-grid/typings';
import { messageFormatter } from '../test-utils/message-formatter';

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

  type CaseNextSelectedYear = [
    partialInit: Partial<ToNextSelectableYearInit>,
    expected: number
  ];
  const casesNextSelectedYear: CaseNextSelectedYear[] = [
    // cap at min or max
    [
      {},
      defaultInit.min.getUTCFullYear(),
    ],
    [
      { key: 'ArrowDown' },
      defaultInit.max.getUTCFullYear(),
    ],
    [
      { key: 'ArrowLeft' },
      defaultInit.min.getUTCFullYear(),
    ],
    [
      { key: 'ArrowRight' },
      defaultInit.max.getUTCFullYear(),
    ],
    [
      { key: 'End' },
      defaultInit.max.getUTCFullYear(),
    ],
    [
      { key: 'Home' },
      defaultInit.min.getUTCFullYear(),
    ],
    [
      { key: ' ' },
      defaultInit.year,
    ],

    // within min and max
    [
      { ...defaultInitWithGrid },
      defaultInitWithGrid.year - 4,
    ],
    [
      { ...defaultInitWithGrid, key: 'ArrowDown' },
      defaultInitWithGrid.year + 4,
    ],
    [
      { ...defaultInitWithGrid, key: 'ArrowLeft' },
      defaultInitWithGrid.year - 1,
    ],
    [
      { ...defaultInitWithGrid, key: 'ArrowRight' },
      defaultInitWithGrid.year + 1,
    ],
    [
      { ...defaultInitWithGrid, key: 'End' },
      defaultInitWithGrid.max.getUTCFullYear(),
    ],
    [
      { ...defaultInitWithGrid, key: 'Home' },
      defaultInitWithGrid.min.getUTCFullYear(),
    ],
    [
      { ...defaultInitWithGrid, key: ' ' },
      defaultInitWithGrid.year,
    ],
  ];
  casesNextSelectedYear.forEach(a => {
    const [testPartialInit, expected] = a;

    it(
      messageFormatter('returns next selected year (init=%j)', a),
      () => {
        const result = toNextSelectedYear({
          ...defaultInit,
          ...testPartialInit,
        });

        expect(result).equal(expected);
      }
    );
  });

});
