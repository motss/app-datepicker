import { expect } from '@open-wc/testing';

import { clampValue } from '../../helpers/clamp-value';
import { messageFormatter } from '../test-utils/message-formatter';

describe(clampValue.name, () => {
  type CaseClampValue = [
    min: number,
    max: number,
    value: number,
    expected: number
  ];
  const casesClampValue: CaseClampValue[] = [
    [100, 300, 100, 100],
    [100, 300, 200, 200],
    [100, 300, 301, 300],
    [100, 300, 99, 100],
  ];
  casesClampValue.forEach((a) => {
    const [testMin, testMax, testValue, expected] = a;

    it(
      messageFormatter('clamps value (min=%s, max=%s, value=%s', a),
      () => {
        const result = clampValue(testMin, testMax, testValue);

        expect(result).equal(expected);
      }
    );
  });
});
