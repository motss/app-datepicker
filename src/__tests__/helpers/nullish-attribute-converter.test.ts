import { expect } from '@open-wc/testing';

import { nullishAttributeConverter } from '../../helpers/nullish-attribute-converter';
import { messageFormatter } from '../test-utils/message-formatter';

describe(nullishAttributeConverter.name, () => {
  type CaseNullishAttributeConverter = [
    value: unknown,
    expected: string | undefined
  ];
  const casesNullishAttributeConverter: CaseNullishAttributeConverter[] = [
    [null, undefined],
    [undefined, undefined],
    ['', undefined],
    ['test', 'test'],
  ];
  casesNullishAttributeConverter.forEach((a) => {
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
