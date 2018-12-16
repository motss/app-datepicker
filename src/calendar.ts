function calendarWeekdays({
  firstDayOfWeek,
  showWeekNumber,

  longWeekdayFormatter,
  narrowWeekdayFormatter,
}) {
  return Array.from(
    Array(showWeekNumber ? 8 : 7),
    (_, i) => {
      if (showWeekNumber && i < 1) {
        return { label: 'Week', value: 'Wk' };
      }

      const dateOffset = ((firstDayOfWeek < 0 ? 7 : 0) + firstDayOfWeek)
        % 7
        + (showWeekNumber ? 0 : 1);
      const dateDate = new Date(Date.UTC(2017, 0, i + dateOffset));

      return {
        label: longWeekdayFormatter(dateDate),
        value: narrowWeekdayFormatter(dateDate),
      };
    });
}

function normalizeWeekday(weekday: number) {
  const weekdayOffset = weekday < 0
    ? 7 * Math.ceil(Math.abs(weekday / 7))
    : 0

  return (weekdayOffset + weekday) % 7;
}

/**
 * {@link https://bit.ly/2UvEN2y|Compute week number by type}
 * @param weekNumberType {string}
 * @param date {Date}
 * @return {}
 */
function computeWeekNumber(weekNumberType: string, date: Date) {
  const getFixedDate = (weekNumberType, date) => {
    const dd = new Date(date);
    const wd = dd.getUTCDay();
    const fy = dd.getUTCFullYear();
    const m = dd.getUTCMonth();
    const d = dd.getUTCDate();

    switch (weekNumberType) {
      case 'first-4-day-week':
        return  new Date(Date.UTC(fy, m, d - wd + 3));
      case 'first-day-of-year':
        return new Date(Date.UTC(fy, m, d - wd + 6));
      case 'first-full-week':
        return new Date(Date.UTC(fy, m, d - wd));
      default:
        return dd;
    }
  };

  const fixedNow = getFixedDate(weekNumberType, date);
  const firstDayOfYear = new Date(Date.UTC(fixedNow.getUTCFullYear(), 0, 1));
  const wk = Math.ceil(((+fixedNow - +firstDayOfYear) / 864e5 + 1) / 7);

  return {
    originalDate: date,
    fixedDate: fixedNow,
    weekNumber: wk,
  };
}


//  Month Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
//  Days   31  28  31  30  31  30  31  31  30  31  30  31
//   31?    0       2       4       6   7       9      11
//   30?                3       5           8      10
//  Feb?        1
//  Su Mo Tu We Th Fr Sa    startDay - _firstDayOfWeek
//                  1  2        5 - 0 < 0 ? 6 : 5 - 0;
//  Mo Tu We Th Fr Sa Su
//               1  2  3        5 - 1 < 0 ? 6 : 5 - 1;
//  Tu We Th Fr Sa Su Mo
//            1  2  3  4        5 - 2 < 0 ? 6 : 5 - 2;
//  We Th Fr Sa Su Mo Tu
//         1  2  3  4  5        5 - 3 < 0 ? 6 : 5 - 3;
//  Th Fr Sa Su Mo Tu We
//      1  2  3  4  5  6        5 - 4 < 0 ? 6 : 5 - 4;
//  Fr Sa Su Mo Tu We Th
//   1  2  3  4  5  6  7        5 - 5 < 0 ? 6 : 5 - 5;
//  Sa Su Mo Tu We Th Fr
//                     1        5 - 6 < 0 ? 6 : 5 - 6;
function calendarDays({
  firstDayOfWeek,
  selectedDate,
  showWeekNumber,
  weekNumberType,
  idOffset,

  fullDateFormatter,
  dayFormatter,
}) {
  const fy = selectedDate.getUTCFullYear();
  const selectedMonth = selectedDate.getUTCMonth();
  const totalDays = new Date(Date.UTC(fy, selectedMonth + 1, 0)).getUTCDate();
  const preFirstWeekday = new Date(Date.UTC(fy, selectedMonth, 1)).getUTCDay() - firstDayOfWeek;
  const firstWeekday = normalizeWeekday(preFirstWeekday);
  const totalCol = showWeekNumber ? 8 : 7;

  const calendar = Array.from(
    Array(6),
    (_, i) => {
      return Array.from(
        Array(totalCol),
        (__, ni) => {
          const rowVal = ni + (i * 7);

          if (showWeekNumber && ni < 1) {
            const { weekNumber } = computeWeekNumber(
              weekNumberType,
              new Date(Date.UTC(fy, selectedMonth, rowVal + 1 - firstWeekday)));

            return {
              fullDate: null,
              label: `Week ${weekNumber}`,
              value: weekNumber,
              id: weekNumber,
            };
          }

          if (
            i < 1
              && (firstWeekday > 0 && firstWeekday < 7)
              && ni < (firstWeekday + (showWeekNumber ? 1 : 0))
          ) {
            return { fullDate: null, label: null, value: null, id: (rowVal + idOffset) };
          }

          const day = rowVal + (showWeekNumber ? 0 : 1) - firstWeekday;

          if (day > totalDays) {
            return { fullDate: null, label: null, value: null, id: (rowVal + idOffset) };
          }

          const d = new Date(Date.UTC(fy, selectedMonth, day));
          const fullDate = d.toJSON();

          return {
            fullDate,
            label: fullDateFormatter(d),
            value: Number(dayFormatter(d)),
            id: fullDate,
            /** NOTE: Always have that day in absolute number */
            // originalValue: d.getUTCDate(),
          };
        }
      );
    }
  );

  return calendar;
}

export function calendar({
  firstDayOfWeek,
  showWeekNumber,
  locale,
  selectedDate,
  weekNumberType,
  idOffset,

  longWeekdayFormatterFn,
  narrowWeekdayFormatterFn,
  dayFormatterFn,
  fullDateFormatterFn,
}) {
  const longWeekdayFormatter = longWeekdayFormatterFn == null
    ? Intl.DateTimeFormat(locale, { weekday: 'long', }).format
    : longWeekdayFormatterFn;
  const narrowWeekdayFormatter = narrowWeekdayFormatterFn == null
    ? Intl.DateTimeFormat(locale, {
      /** NOTE: Only 'short' or 'narrow' (fallback) is allowed for 'weekdayFormat'. */
      // weekday: /^(short|narrow)/i.test(weekdayFormat)
      //   ? weekdayFormat
      //   : 'narrow',
      weekday: 'narrow',
    }).format
    : narrowWeekdayFormatterFn;
  const dayFormatter = dayFormatterFn == null
    ? Intl.DateTimeFormat(locale, { day: 'numeric' }).format
    : dayFormatterFn;
  const fullDateFormatter = fullDateFormatterFn == null
    ? Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format
    : fullDateFormatterFn;

  const weekdays = calendarWeekdays({
    firstDayOfWeek,
    showWeekNumber,

    longWeekdayFormatter,
    narrowWeekdayFormatter,
  });
  const daysInMonth = calendarDays({
    firstDayOfWeek,
    selectedDate,
    showWeekNumber,
    weekNumberType,
    idOffset: idOffset == null ? 0 : idOffset,

    dayFormatter,
    fullDateFormatter,
  });

  return { weekdays, daysInMonth };
}
