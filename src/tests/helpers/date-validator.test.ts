import { expect } from '@open-wc/testing';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { dateValidator } from '../../helpers/date-validator';
import type { DateValidatorResult, MaybeDate } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(dateValidator.name, () => {
  type A = [MaybeDate, Date, DateValidatorResult];
  const date1 = new Date(1);
  const date1Utc = toUTCDate(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
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
      '2020-02-02',
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
    [
      '0',
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: false,
      },
    ],
    [
      '1',
      date1Utc,
      {
        date: date1Utc,
        isValid: true,
      },
    ],
    [
      0,
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: false,
      },
    ],
    [
      1,
      date1Utc,
      {
        date: date1Utc,
        isValid: true,
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
      new Date('2020-02-02').toJSON(),
      new Date('2020-02-02'),
      {
        date: new Date('2020-02-02'),
        isValid: true,
      },
    ],
  ];
  cases.forEach((a) => {
    const [testValue, testDefaultDate, expected] = a;
    it(
      messageFormatter('validates date (value=%s, defaultDate=%s)', a),
      () => {
        const result = dateValidator(testValue, testDefaultDate);

        expect(result).deep.equal(expected);
      });
  });

});
