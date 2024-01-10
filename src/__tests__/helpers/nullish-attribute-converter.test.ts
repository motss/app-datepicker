import { describe, expect, it } from 'vitest';

import { nullishAttributeConverter } from '../../helpers/nullish-attribute-converter';

describe(nullishAttributeConverter.name, () => {
  it.each<{
    $_value: string | undefined;
    value: unknown;
  }>([
    {
      $_value: undefined,
      value: null,
    },
    {
      $_value: undefined,
      value: undefined,
    },
    {
      $_value: undefined,
      value: '',
    },
    {
      $_value: 'test',
      value: 'test',
    },
  ])('returns normalized attribute value (value=$value)', ({
    $_value,
    value,
  }) => {
    const result = nullishAttributeConverter(value);

    expect(result).toBe($_value);
  });

});
