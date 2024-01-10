import { describe, expect, it } from 'vitest';

import { splitString } from '../../helpers/split-string';

describe(splitString.name, () => {
  const str = 'hello, world, everyone';
  const expected = str.split(/,\s*/);

  it.each<{
    $_value: string[];
    source: string;
  }>([
    {
      $_value: [],
      source: '',
    },
    {
      $_value: expected,
      source: str,
    },
  ])('splits string ($source)', ({
    $_value,
    source,
  }) => {
    const result = splitString(source);

    expect(result).toEqual($_value);
  });

  it.each<[separator?: RegExp]>([
    [],
    [/,\s/],
  ])('splits string with optional callback and optional separator (%s)', (separator) => {
      const result = splitString<[string]>(
        str,
        (n) => [n],
        separator
      );

      expect(result).toEqual(expected.map(n => [n]));
  });

});
