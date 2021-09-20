import { expect } from '@open-wc/testing';

import { isInCurrentMonth } from '../../helpers/is-in-current-month';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [Date, Date, boolean];

const cases: A[] = [
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    true,
  ],
  [
    new Date('2020-02-02'),
    new Date('2020-03-12'),
    false,
  ],
];

describe(isInCurrentMonth.name, () => {
  cases.forEach(a => {
    const [testTarget, testSource, expected] = a;

    it(
      messageFormatter('returns if %s is current month of %s', a),
      () => {
        const result = isInCurrentMonth(testTarget, testSource);

        expect(result).equal(expected);
      }
    );
  });
});
