import { describe, expect, it } from 'vitest';

import { isInCurrentMonth } from '../../helpers/is-in-current-month';

describe(isInCurrentMonth.name, () => {
  it.each<{
    $_value: boolean;
    source: Date;
    target: Date;
  }>([
    {
      $_value: true,
      source: new Date('2020-02-12'),
      target: new Date('2020-02-02'),
    },
    {
      $_value: false,
      source: new Date('2020-03-12'),
      target: new Date('2020-02-02'),
    },
  ])('returns if $target is current month of $source', ({
    $_value,
    source,
    target,
  }) => {
    const result = isInCurrentMonth(target, source);

    expect(result).toBe($_value);
  });

});
