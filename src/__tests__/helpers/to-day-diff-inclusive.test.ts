import { expect } from '@open-wc/testing';

import { toDayDiffInclusive } from '../../helpers/to-day-diff-inclusive';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toDayDiffInclusive.name, () => {
  type CaseToDayDiffInclusive = [
    min: number | Date,
    max: number | Date,
    expected: number
  ];
  const casesToDayDiffInclusive: CaseToDayDiffInclusive[] = [
    [new Date('2020-02-02'), new Date('2020-02-03'), 2],
    [+new Date('2020-02-02'), new Date('2020-02-03'), 2],
    [new Date('2020-02-02'), +new Date('2020-02-03'), 2],
    [+new Date('2020-02-02'), +new Date('2020-02-03'), 2],

    // other ranges
    [new Date('2020-02-02'), new Date('2020-02-01'), 0],
    [+new Date('2020-02-02'), +new Date('2020-02-04'), 3],
    [+new Date('2020-02-02T08:00:00.000+08:00'), +new Date('2020-02-02T20:00:00.00+08:00'), 1],
  ];
  casesToDayDiffInclusive.forEach((a) => {
    const [testMin, testMax, expected] = a;

    it(
      messageFormatter('returns date range (min=%s, max=%s)', a),
      () => {
        const result = toDayDiffInclusive(testMin, testMax);

        expect(result).equal(expected);
      }
    );
  });

});
