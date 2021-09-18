import { expect } from '@open-wc/testing';

import { toDateRange } from '../../helpers/to-date-range';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toDateRange.name, () => {
  type A = [number | Date, number | Date];

  const cases: A[] = [
    [new Date('2020-02-02'), new Date('2020-02-03')],
    [+new Date('2020-02-02'), new Date('2020-02-03')],
    [new Date('2020-02-02'), +new Date('2020-02-03')],
    [+new Date('2020-02-02'), +new Date('2020-02-03')],
  ];

  cases.forEach((a) => {
    const [testMin, testMax] = a;

    it(
      messageFormatter('returns date range (min=%s, max=%s)', a),
      () => {
        const result = toDateRange(testMin, testMax);

        expect(result).equal(864e5);
      }
    );
  });
});
