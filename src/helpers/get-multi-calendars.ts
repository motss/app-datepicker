import type {
  Calendar,
  CalendarWeekday,
  DateTimeFormatter,
  WeekNumberType,
} from 'nodemod/dist/calendar/calendar_typing.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';
import { calendar } from 'nodemod/dist/calendar/index.js';

interface MultiCalendars extends NonNullable<Omit<Calendar, 'calendar' | 'key'>> {
  key: string;
  weekdays: CalendarWeekday[];
  calendars: Pick<Calendar, 'calendar' | 'key'>[];
}

interface GetMultiCalendarsOption {
  dayFormat: DateTimeFormatter;
  fullDateFormat: DateTimeFormatter;
  locale: string;
  longWeekdayFormat: DateTimeFormatter;
  narrowWeekdayFormat: DateTimeFormatter;
  selectedDate: Date;

  disabledDates?: Date[];
  disabledDays?: number[];
  firstDayOfWeek?: number;
  max?: Date;
  min?: Date;
  showWeekNumber?: boolean;
  weekLabel?: string;
  weekNumberType?: WeekNumberType;
}

export function getMultiCalendars(
  options: GetMultiCalendarsOption
): MultiCalendars {
  const {
    dayFormat,
    fullDateFormat,
    locale,
    longWeekdayFormat,
    narrowWeekdayFormat,
    selectedDate,

    disabledDates,
    disabledDays,
    firstDayOfWeek,
    max,
    min,
    showWeekNumber,
    weekLabel,
    weekNumberType,
  } = options;

  const minTime = min == null ? Number.MIN_SAFE_INTEGER : +min;
  const maxTime = max == null ? Number.MAX_SAFE_INTEGER : +max;
  const weekdays = getWeekdays({
    longWeekdayFormat,
    narrowWeekdayFormat,
    firstDayOfWeek,
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

  const ify = selectedDate.getUTCFullYear();
  const im = selectedDate.getUTCMonth();
  const calendarsList = [-1, 0, 1].map<Calendar>((n) => {
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
        key,

        calendar: [],
        disabledDatesSet: new Set(),
        disabledDaysSet: new Set(),
      };
    }

    const calendarDays = calendar({
      dayFormat,
      fullDateFormat,
      locale,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      max,
      min,
      showWeekNumber,
      weekNumberType,
      selectedDate: firstDayOfMonth,
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
    weekdays,

    disabledDatesSet: $disabledDatesSet,
    disabledDaysSet: $disabledDaysSet,
    key: getKey(selectedDate),
  };
}
