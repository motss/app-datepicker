import { expect } from '@open-wc/testing';

import { toDateRange } from '../../helpers/to-date-range';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toDateRange.name, () => {
  type A = [number | Date, number | Date, number];

  const cases: A[] = [
    [new Date('2020-02-02'), new Date('2020-02-03'), 2],
    [+new Date('2020-02-02'), new Date('2020-02-03'), 2],
    [new Date('2020-02-02'), +new Date('2020-02-03'), 2],
    [+new Date('2020-02-02'), +new Date('2020-02-03'), 2],

    // other ranges
    [new Date('2020-02-02'), new Date('2020-02-01'), 0],
    [+new Date('2020-02-02'), +new Date('2020-02-04'), 3],
  ];

  cases.forEach((a) => {
    const [testMin, testMax, expected] = a;

    it(
      messageFormatter('returns date range (min=%s, max=%s)', a),
      () => {
        const result = toDateRange(testMin, testMax);

        expect(result).equal(expected);
      }
    );
  });
});
