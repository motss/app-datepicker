import { describe, expect, it } from 'vitest';

import { toDayDiffInclusive } from '../../helpers/to-day-diff-inclusive';

describe(toDayDiffInclusive.name, () => {
  it.each<{
    $_value: number;
    max: Date | number;
    min: Date | number;
  }>([
    { $_value: 2, max:  new Date('2020-02-03'), min: new Date('2020-02-02')},
    { $_value: 2, max:  new Date('2020-02-03'), min: +new Date('2020-02-02')},
    { $_value: 2, max: +new Date('2020-02-03'), min: new Date('2020-02-02')},
    { $_value: 2, max: +new Date('2020-02-03'), min: +new Date('2020-02-02')},

    // other ranges
    { $_value: 0, max: new Date('2020-02-01'), min: new Date('2020-02-02') },
    { $_value: 3, max: +new Date('2020-02-04'), min: +new Date('2020-02-02') },
    { $_value: 1, max: +new Date('2020-02-02T20:00:00.00+08:00'), min: +new Date('2020-02-02T08:00:00.000+08:00') },
  ])('returns date range (min=$min, max=$max)', ({
    $_value,
    max,
    min,
  }) => {
    const result = toDayDiffInclusive(min, max);

    expect(result).toBe($_value);
  });

});
