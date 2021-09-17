import { expect } from '@open-wc/testing';

import { nullishAttributeConverter } from '../../helpers/nullish-attribute-converter';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [unknown, string | undefined];

const cases: A[] = [
  [null, undefined],
  [undefined, undefined],
  ['', undefined],
  ['test', 'test'],
];

describe(nullishAttributeConverter.name, () => {
  cases.forEach((a) => {
    it(
      messageFormatter('returns normalized attribute value (value=%s)', a),
      () => {
        const [testValue, expected] = a;

        const result = nullishAttributeConverter(testValue);

        expect(result).equal(expected);
      }
    );
  });
});
