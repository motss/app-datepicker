import { expect } from '@open-wc/testing';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { MaybeDate } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toResolvedDate.name, () => {
  type A = [MaybeDate | undefined, Date];
  const today = new Date();
  const date1 = new Date(1);
  const cases: A[] = [
    ['', new Date(NaN)],
    ['0', new Date(NaN)],
    ['1', toUTCDate(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate())],
    ['2020-02-02', new Date('2020-02-02')],
    [+new Date('2020-02-02'), new Date('2020-02-02')],
    [0, new Date(NaN)],
    [NaN, new Date(NaN)],
    [new Date('2020-02-02'), new Date('2020-02-02')],
    [new Date('2020-02-02').toJSON(), new Date('2020-02-02')],
    [null, new Date(NaN)],
    [undefined, toUTCDate(today.getFullYear(), today.getMonth(), today.getDate())],
  ];

  cases.forEach((a) => {
    const [testDate, expected] = a;

    it(
      messageFormatter('returns resolved date (%s)', a),
      () => {
        const result = toResolvedDate(testDate);

        expect(result).deep.equal(expected);
      }
    );
  });

});
