import { expect } from '@open-wc/testing';

import { toYearList } from '../../helpers/to-year-list';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toYearList.name, () => {
  type A = [Date, Date, number[]];

  const cases: A[] = [
    [new Date('2020-02-02'), new Date('2020-02-01'), []],
    [new Date('2020-02-02'), new Date('2020-02-02'), [2020]],
    [new Date('2020-02-02'), new Date('2020-02-03'), [2020]],
    [new Date('2019-02-02'), new Date('2020-02-02'), [2019, 2020]],
  ];

  cases.forEach((a) => {
    const [testMin, testMax, expected] = a;

    it(
      messageFormatter('returns year list (min=%s, max=%s)', a),
      () => {
        const result = toYearList(testMin, testMax);

        expect(result).deep.equal(expected);
      }
    );
  });
});