import { expect } from '@open-wc/testing';

import { toNextSelectedDate } from '../../helpers/to-next-selected-date';
import type { ToNextSelectedDateInit } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toNextSelectedDate.name, () => {
  const defaultInit: ToNextSelectedDateInit = {
    currentDate: new Date('2020-02-02'),
    date: new Date('2020-02-02'),
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
    hasAltKey: false,
    key: 'ArrowRight',
    maxTime: +new Date('2020-01-01'),
    minTime: +new Date('2020-03-03'),
  };

  type A = [Partial<ToNextSelectedDateInit>, Date];

  const cases: A[] = [
    // all supported keys
    [
      { key: ' ' },
      new Date('2020-02-01'),
    ],
    [
      { key: 'ArrowDown' },
      new Date('2020-02-09'),
    ],
    [
      { key: 'ArrowLeft' },
      new Date('2020-02-01'),
    ],
    [
      { key: 'ArrowRight' },
      new Date('2020-02-03'),
    ],
    [
      { key: 'ArrowUp' },
      new Date('2020-01-26'),
    ],
    [
      { key: 'End' },
      new Date('2020-02-29'),
    ],
    [
      { key: 'Enter' },
      new Date('2020-02-01'),
    ],
    [
      { key: 'Home' },
      new Date('2020-02-01'),
    ],
    [
      { key: 'PageDown' },
      new Date('2020-03-02'),
    ],
    [
      { key: 'PageUp' },
      new Date('2020-01-02'),
    ],
    [
      { hasAltKey: true, key: 'PageDown' },
      new Date('2021-02-02'),
    ],
    [
      { hasAltKey: true, key: 'PageUp' },
      new Date('2019-02-02'),
    ],
    [
      { key: 'PageUp' },
      new Date('2020-01-02'),
    ],
    [
      { key: 'Tab' },
      new Date('2020-02-01'),
    ],

    // not in current month
    [
      { currentDate: new Date('2020-03-03') },
      new Date('2020-03-01'),
    ],

    // maxTime + next navigation key
    [
      { key: 'ArrowRight', maxTime: +new Date('2020-02-02') },
      new Date('2020-02-02'),
    ],

    // minTime + previous navigation key
    [
      { key: 'ArrowLeft', minTime: +new Date('2020-02-02') },
      new Date('2020-02-02'),
    ],

    // in leap year, 2020-01-31 to next month to 2020-02-29 from 2020-02-31
    [
      { currentDate: new Date('2020-01-01'), date: new Date('2020-01-31'), key: 'PageDown' },
      new Date('2020-02-29'),
    ],

    // in leap year, 2020-02-29 to next year to 2021-02-28 from 2021-02-29
    [
      { currentDate: new Date('2020-02-01'), date: new Date('2020-02-29'), hasAltKey: true, key: 'PageDown' },
      new Date('2021-02-28'),
    ],
  ];

  cases.forEach((a) => {
    const [testPartialInit, expected] = a;

    it(
      messageFormatter('returns selected date (partialInit=%j)', a),
      () => {
        const result = toNextSelectedDate({
          ...defaultInit,
          ...testPartialInit,
        });

        expect(result).deep.equal(expected);
      }
    );
  });

});
