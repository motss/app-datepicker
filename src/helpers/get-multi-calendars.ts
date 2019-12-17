import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { DateTimeFormatter, WeekNumberType } from 'nodemod/dist/calendar/calendar_typing.js';
import { getWeekdays } from 'nodemod/dist/calendar/get-weekdays.js';
import { toUTCDate } from 'nodemod/dist/calendar/to-utc-date.js';

type MultiCalendar = ReturnType<typeof calendar>;

interface MultiCalendars extends NonNullable<Omit<MultiCalendar, 'calendar' | 'key'>> {
  key: string;
  weekdays: ReturnType<typeof getWeekdays>;
  calendars: Pick<ReturnType<typeof calendar>, 'calendar' | 'key'>[];
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
  const calendarsList = [-1, 0, 1].map<MultiCalendar>((n) => {
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

        calendar: null,
        disabledDatesSet: null,
        disabledDaysSet: null,
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

  const multiCalendars = calendarsList.reduce<MultiCalendars>((p, n) => {
    const {
      disabledDatesSet,
      disabledDaysSet,
      ...rest
    } = n;

    if (null != rest.calendar) {
      if (disabledDaysSet) {
        for (const o of disabledDaysSet) p.disabledDaysSet?.add(o);
      }

      if (disabledDatesSet) {
        for (const o of disabledDatesSet) p.disabledDatesSet?.add(o);
      }
    }

    p.calendars.push(rest);

    return p;
  }, {
    weekdays,
    key: getKey(selectedDate),

    calendars: [],
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
  });

  return multiCalendars;
}
