import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import { describe, expect, it } from 'vitest';

import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { MaybeDate } from '../../helpers/typings';

describe(toResolvedDate.name, () => {
  const today = new Date();
  const date1 = new Date(1);

  it.each<{
    $_value: Date;
    date: MaybeDate | undefined;
  }>([
    { $_value: new Date(NaN), date: '' },
    { $_value: new Date(NaN), date: '0' },
    { $_value: toUTCDate(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()), date: '1' },
    { $_value: new Date('2020-02-02'), date: '2020-02-02' },
    { $_value: new Date('2020-02-02'), date: +new Date('2020-02-02') },
    { $_value: new Date(NaN), date: 0 },
    { $_value: new Date(NaN), date: NaN },
    { $_value: new Date('2020-02-02'), date: new Date('2020-02-02') },
    { $_value: new Date('2020-02-02'), date: new Date('2020-02-02').toJSON() },
    { $_value: new Date(NaN), date: null },
    { $_value: toUTCDate(today.getFullYear(), today.getMonth(), today.getDate()), date: undefined },
  ])('returns resolved date ($date)', ({
    $_value,
    date,
  }) => {
    const result = toResolvedDate(date);

    expect(result).toEqual($_value);
  });

});
