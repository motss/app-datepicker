import { calendar } from '@ipohjs/calendar';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';

import type { Calendar } from '../calendar/calendar.js';
import type { MultiCalendars, ToMultiCalendarsInit } from './typings.js';

export function toMultiCalendars(
  options: ToMultiCalendarsInit
): MultiCalendars {
  const {
    count,
    currentDate,
    dayFormat,
    disabledDates,
    disabledDays,
    firstDayOfWeek,

    fullDateFormat,
    locale,
    longWeekdayFormat,
    max,
    min,
    narrowWeekdayFormat,
    showWeekNumber,
    weekLabel,
    weekNumberType,
  } = options;

  const countValue = count || 0;
  const calendarCount = countValue + +!(countValue & 1);
  const minTime = min == null ? Number.MIN_SAFE_INTEGER : +min;
  const maxTime = max == null ? Number.MAX_SAFE_INTEGER : +max;
  const weekdays = getWeekdays({
    firstDayOfWeek,
    longWeekdayFormat,
    narrowWeekdayFormat,
    showWeekNumber,
    weekLabel,
  });
  const getKey = (date: Date) => [
    locale,
    date.toJSON(),
    disabledDates?.join('_'),
    disabledDays?.join('_'),
    firstDayOfWeek,
    max?.toJSON(),
    min?.toJSON(),
    showWeekNumber,
    weekLabel,
    weekNumberType,
  ].filter(Boolean).join(':');

  const ify = currentDate.getUTCFullYear();
  const im = currentDate.getUTCMonth();
  const calendarCountInitialValue = Math.floor(calendarCount / 2) * -1;
  const calendarCountArray = Array.from(Array(calendarCount), (_, i) => calendarCountInitialValue + i);
  const calendarsList = calendarCountArray.map<Calendar>((n) => {
    const firstDayOfMonth = toUTCDate(ify, im + n, 1);
    const lastDayOfMonthTime = +toUTCDate(ify, im + n + 1, 0);
    const key = getKey(firstDayOfMonth);

    /**
     * NOTE: Return `null` when one of the followings fulfills:-
     *
     *           minTime            maxTime
     *       |--------|--------o--------|--------|
     *   last day     |   valid dates   |     first day
     *
     *  - last day of the month < `minTime` - entire month should be disabled
     *  - first day of the month > `maxTime` - entire month should be disabled
     */
    if (lastDayOfMonthTime < minTime || +firstDayOfMonth > maxTime) {
      return {
        calendar: [],

        disabledDatesSet: new Set(),
        disabledDaysSet: new Set(),
        key,
      };
    }

    const calendarDays = calendar({
      date: firstDayOfMonth,
      dayFormat,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      fullDateFormat,
      locale,
      max,
      min,
      showWeekNumber,
      weekNumberType,
    });

    return { ...calendarDays, key };
  });

  const calendars: MultiCalendars['calendars'] = [];
  const $disabledDatesSet: MultiCalendars['disabledDatesSet'] = new Set();
  const $disabledDaysSet: MultiCalendars['disabledDaysSet'] = new Set();

  for (const cal of calendarsList) {
    const {
      disabledDatesSet,
      disabledDaysSet,
      ...rest
    } = cal;

    if (rest.calendar.length > 0) {
      if (disabledDaysSet.size > 0) {
        for (const o of disabledDaysSet) $disabledDaysSet.add(o);
      }

      if (disabledDatesSet.size > 0) {
        for (const o of disabledDatesSet) $disabledDatesSet.add(o);
      }
    }

    calendars.push(rest);
  }

  return {
    calendars,
    disabledDatesSet: $disabledDatesSet,

    disabledDaysSet: $disabledDaysSet,
    key: getKey(currentDate),
    weekdays,
  };
}
