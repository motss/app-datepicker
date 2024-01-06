import { describe, expect, it } from 'vitest';

import { clampValue } from '../../helpers/clamp-value';

describe(clampValue.name, () => {
  it.each<{
    $_value: number;
    max: number;
    min: number;
    value: number;
  }>([
    {
      $_value: 100,
      max: 300,
      min: 100,
      value: 100,
    },
    {
      $_value: 200,
      max: 300,
      min: 100,
      value: 200,
    },
    {
      $_value: 300,
      max: 300,
      min: 100,
      value: 301,
    },
    {
      $_value: 100,
      max: 300,
      min: 100,
      value: 99,
    },
  ])('clamps value (min=$min, max=$max, value=$value)', ({
    $_value,
    max,
    min,
    value,
  }) => {
    const result = clampValue(min, max, value);

    expect(result).toBe($_value);
  });
});
