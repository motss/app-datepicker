import { expect } from '@open-wc/testing';

import { toFormatters } from '../../helpers/to-formatters';
import type { Formatters } from '../../typings';

describe(toFormatters.name, () => {
  it('returns formatters', () => {
    const testLocale = 'en-US';
    const result = toFormatters(testLocale);

    expect(result).haveOwnProperty('locale', testLocale);

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
        expect(result).haveOwnProperty(n)
    );
  });
});
