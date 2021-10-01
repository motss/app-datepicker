import { expect } from '@open-wc/testing';

import { adjustOutOfRangeValue } from '../../helpers/adjust-out-of-range-value';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [
  ...Parameters<typeof adjustOutOfRangeValue>,
  ReturnType<typeof adjustOutOfRangeValue>
];

const cases: A[] = [
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-01-01'),
    new Date('2020-02-02'),
  ],
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-02-15'),
    new Date('2020-02-12'),
  ],
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-02-08'),
    new Date('2020-02-08'),
  ],
];

describe(adjustOutOfRangeValue.name, () => {
  cases.forEach((a) => {
    it(messageFormatter('returns adjusted date (min=%s, max=%s, date=%s)', a), () => {
      const [
        testMin,
        testMax,
        testDate,
        expected,
      ] = a;

      const result = adjustOutOfRangeValue(testMin, testMax, testDate);

      expect(result).deep.equal(expected);
    });
  });

});
