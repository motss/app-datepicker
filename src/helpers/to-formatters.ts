import { getFormatter } from '@ipohjs/calendar/get-formatter';

import { DateTimeFormat } from '../constants.js';
import type { Formatters } from '../typings.js';

export function toFormatters(locale: string): Formatters {
  const dateFmt = DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    weekday: 'short',
  });
  const dayFmt = DateTimeFormat(locale, { day: 'numeric', timeZone: 'UTC' });
  const fullDateFmt = DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });
  const longMonthYearFmt = DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  });
  const longWeekdayFmt = DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'long' });
  const longMonthFmt = DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
  const narrowWeekdayFmt = DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'narrow' });
  const yearFmt = DateTimeFormat(locale, { timeZone: 'UTC', year: 'numeric' });

  return {
    dateFormat: getFormatter(dateFmt),

    dayFormat: getFormatter(dayFmt),
    fullDateFormat: getFormatter(fullDateFmt),
    locale,
    longMonthFormat: getFormatter(longMonthFmt),
    longMonthYearFormat: getFormatter(longMonthYearFmt),
    longWeekdayFormat: getFormatter(longWeekdayFmt),
    narrowWeekdayFormat: getFormatter(narrowWeekdayFmt),
    yearFormat: getFormatter(yearFmt),
  };
}
