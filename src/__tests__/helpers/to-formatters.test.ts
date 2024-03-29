import { describe, expect, it } from 'vitest';

import { toFormatters } from '../../helpers/to-formatters';
import type { Formatters } from '../../typings';

describe(toFormatters.name, () => {
  it('returns formatters', () => {
    const locale = 'en-US';
    const result = toFormatters(locale);

    expect(result).toHaveProperty('locale', locale);

    const props: (keyof Omit<Formatters, 'locale'>)[] = [
      'dateFormat',
      'dayFormat',
      'fullDateFormat',
      'longMonthFormat',
      'longMonthYearFormat',
      'longWeekdayFormat',
      'narrowWeekdayFormat',
      'yearFormat',
    ];

    props.forEach(
      n =>
        expect(result).toHaveProperty(n)
    );
  });

});
