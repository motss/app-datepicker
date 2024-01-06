import { describe, expect, it } from 'vitest';

import { toYearList } from '../../helpers/to-year-list';

describe(toYearList.name, () => {
  it.each<{
    $_value: number[];
    max: Date;
    min: Date;
  }>([
    {
      $_value: [],
      max: new Date('2020-02-01'),
      min: new Date('2020-02-02'),
    },
    {
      $_value: [2020],
      max: new Date('2020-02-02'),
      min: new Date('2020-02-02'),
    },
    {
      $_value: [2020],
      max: new Date('2020-02-03'),
      min: new Date('2020-02-02'),
    },
    {
      $_value: [2019, 2020],
      max: new Date('2020-02-02'),
      min: new Date('2019-02-02'),
    },
  ])('returns year list (min=$min, max=$max)', ({
    $_value,
    max,
    min,
  }) => {
    const result = toYearList(min, max);

    expect(result).toEqual($_value);
  });

});
