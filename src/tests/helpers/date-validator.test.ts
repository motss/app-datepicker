import { expect } from '@open-wc/testing';

import { dateValidator } from '../../helpers/date-validator';
import type { DateValidatorResult, MaybeDate } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [MaybeDate, Date, DateValidatorResult];

describe(dateValidator.name, () => {
  const cases: A[] = [
    [
      null,
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: false,
      },
    ],
    [
      +new Date('2020-02-02'),
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
    [
      new Date('2020-02-02'),
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
    [
      '2020-02-02',
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
    [
      new Date('2020-02-02').toJSON(),
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
  ];

  cases.forEach(([
    testValue,
    testDate,
    expected,
  ]) => {
    it(
      messageFormatter('validates date (value=%s, date=%s)', [testValue, testDate]),
      () => {
        const result = dateValidator(testValue, testDate);

        expect(result).deep.equal(expected);
      });
  });

});
