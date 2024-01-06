import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';
import { describe, expect, it } from 'vitest';

import { dateValidator } from '../../helpers/date-validator';
import type { DateValidatorResult, MaybeDate } from '../../helpers/typings';

describe(dateValidator.name, () => {
  const date1 = new Date(1);
  const date1Utc = toUTCDate(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());

  it.each<{
    $_value: DateValidatorResult;
    defaultDate: Date;
    value: MaybeDate;
  }>([
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: false,
      },
      defaultDate: new Date('2020-02-02'),
      value: null,
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: true,
      },
      defaultDate: new Date('2020-02-02'),
      value: '2020-02-02',
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: false,
      },
      defaultDate: new Date('2020-02-02'),
      value: '0',
    },
    {
      $_value: {
        date: date1Utc,
        isValid: true,
      },
      defaultDate: date1Utc,
      value: '1',
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: false,
      },
      defaultDate: new Date('2020-02-02'),
      value: 0,
    },
    {
      $_value: {
        date: date1Utc,
        isValid: true,
      },
      defaultDate: date1Utc,
      value: 1,
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: true,
      },
      defaultDate: new Date('2020-02-02'),
      value: new Date('2020-02-02').getTime(),
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: true,
      },
      defaultDate: new Date('2020-02-02'),
      value: new Date('2020-02-02'),
    },
    {
      $_value: {
        date: new Date('2020-02-02'),
        isValid: true,
      },
      defaultDate: new Date('2020-02-02'),
      value: new Date('2020-02-02').toJSON(),
    },
  ])('validates date (value=$value, defaultDate=$defaultDate)', ({
    $_value,
    defaultDate,
    value,
  }) => {
    const result = dateValidator(value, defaultDate);
  
    expect(result).deep.equal($_value);
  });

});
