import { describe, expect, it } from 'vitest';

import { toDateString } from '../../helpers/to-date-string';

describe(toDateString.name, () => {
  it('returns date string', () => {
    const testDateStr = '2020-02-02';
    const result = toDateString(new Date(testDateStr));

    expect(result).toBe(testDateStr);
  });
});
