function calendarWeekdays({
  firstDayOfWeek,
  locale,
  showWeekNumber,
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
        label: Intl.DateTimeFormat(locale, { weekday: 'long', }).format(dateDate),
        value: Intl.DateTimeFormat(locale, {
          /** NOTE: Only 'short' or 'narrow' (fallback) is allowed for 'weekdayFormat'. */
          // weekday: /^(short|narrow)/i.test(weekdayFormat)
          //   ? weekdayFormat
          //   : 'narrow',
          weekday: 'narrow',
        }).format(dateDate),
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

function calendarDays({
  firstDayOfWeek,
  locale,
  selectedDate,
  showWeekNumber,
  weekNumberType,
}) {
  const fy = selectedDate.getUTCFullYear();
  const selectedMonth = selectedDate.getUTCMonth();
  const totalDays = new Date(Date.UTC(fy, selectedMonth + 1, 0)).getUTCDate();
  const preFirstWeekday = new Date(Date.UTC(fy, selectedMonth, 1)).getUTCDay() - firstDayOfWeek;
  const firstWeekday = normalizeWeekday(preFirstWeekday);
  const totalCol = showWeekNumber ? 8 : 7;

  return Array.from(
    Array(
      // Math.ceil(
      //   (
      //     totalDays
      //       + firstWeekday
      //       + (
      //         showWeekNumber
      //           ? Math.ceil((totalDays + firstWeekday) / 7)
      //           : 0
      //       )
      //   ) / totalCol
      // )
      6
    ),
    (_, i) => {
      return Array.from(
        Array(totalCol),
        (__, ni) => {
          if (showWeekNumber && ni < 1) {
            const { weekNumber } = computeWeekNumber(
              weekNumberType,
              new Date(Date.UTC(fy, selectedMonth, (i * 7) + ni + 1 - firstWeekday)));

            return {
              // original: weekNumber,
              fullDate: null,
              label: `Week ${weekNumber}`,
              value: weekNumber,
              // originalValue: weekNumber,
            };
          }

          if (
            i < 1
              && (firstWeekday > 0 && firstWeekday < 7)
              && ni < (firstWeekday + (showWeekNumber ? 1 : 0))
          ) {
            return { fullDate: null, label: null, value: null };
          }

          const day = (i * 7) + ni + (showWeekNumber ? 0 : 1) - firstWeekday;

          if (day > totalDays) {
            return { fullDate: null, label: null, value: null };
          }

          const d = new Date(Date.UTC(fy, selectedMonth, day));

          return {
            fullDate: d.toJSON(),
            label: Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            }).format(d),
            value: Number(Intl.DateTimeFormat(locale, { day: 'numeric' }).format(d)),
            /** NOTE: Always have that day in absolute number */
            // originalValue: d.getUTCDate(),
          };
        }
      );
    }
  );
}

export function calendar({
  firstDayOfWeek,
  showWeekNumber,
  locale,
  selectedDate,
  weekNumberType,
}) {
  return {
    weekdays: calendarWeekdays({
      firstDayOfWeek,
      locale,
      showWeekNumber: showWeekNumber,
    }),
    daysInMonth: calendarDays({
      firstDayOfWeek,
      locale,
      selectedDate,
      showWeekNumber,
      weekNumberType,
    }),
  };
}
