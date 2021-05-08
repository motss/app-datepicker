import { getFormatter } from 'nodemod/dist/calendar/helpers/get-formatter.js';
import { INTL_DATE_TIME_FORMAT } from '../constants.js';
import type { Formatters } from '../custom_typings.js';

export function getFormatters(locale: string): Formatters {
  const dateFmt = INTL_DATE_TIME_FORMAT(locale, {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const dayFmt = INTL_DATE_TIME_FORMAT(locale, { timeZone: 'UTC', day: 'numeric' });
  const fullDateFmt = INTL_DATE_TIME_FORMAT(locale, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const longMonthYearFmt = INTL_DATE_TIME_FORMAT(locale, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
  });
  const longWeekdayFmt = INTL_DATE_TIME_FORMAT(locale, { timeZone: 'UTC', weekday: 'long' });
  const narrowWeekdayFmt = INTL_DATE_TIME_FORMAT(locale, { timeZone: 'UTC', weekday: 'narrow' });
  const yearFmt = INTL_DATE_TIME_FORMAT(locale, { timeZone: 'UTC', year: 'numeric' });

  return {
    locale,

    dateFormat: getFormatter(dateFmt),
    dayFormat: getFormatter(dayFmt),
    fullDateFormat: getFormatter(fullDateFmt),
    longMonthYearFormat: getFormatter(longMonthYearFmt),
    longWeekdayFormat: getFormatter(longWeekdayFmt),
    narrowWeekdayFormat: getFormatter(narrowWeekdayFmt),
    yearFormat: getFormatter(yearFmt),
  };
}
