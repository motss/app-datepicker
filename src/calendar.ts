import { AppDatepicker } from './app-datepicker';
import { DateTimeFormatter, toUTCDate } from './datepicker-helpers';

export const enum WEEK_NUMBER_TYPE {
  FIRST_4_DAY_WEEK = 'first-4-day-week',
  FIRST_DAY_OF_YEAR = 'first-day-of-year',
  FIRST_FULL_WEEK = 'first-full-week',
}

function normalizeWeekday(weekday: number) {
  if (weekday >= 0 && weekday < 7) return weekday;

  const weekdayOffset = weekday < 0 ? 7 * Math.ceil(Math.abs(weekday / 7)) : 0;

  return (weekdayOffset + weekday) % 7;
}

function getFixedDateForWeekNumber(weekNumberType: string, date: Date) {
  const wd = date.getUTCDay();
  const fy = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  switch (weekNumberType) {
    case WEEK_NUMBER_TYPE.FIRST_4_DAY_WEEK:
      return toUTCDate(fy, m, d - wd + 3);
    case WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR:
      return toUTCDate(fy, m, d - wd + 6);
    case WEEK_NUMBER_TYPE.FIRST_FULL_WEEK:
      return toUTCDate(fy, m, d - wd);
    default:
      return date;
  }
}

/**
 * {@link https://bit.ly/2UvEN2y|Compute week number by type}
 * @param weekNumberType {string}
 * @param date {Date}
 * @return {}
 */
interface WeekNumber {
  originalDate: Date;
  fixedDate: Date;
  weekNumber: number;
}
function computeWeekNumber(weekNumberType: string, date: Date): WeekNumber {
  const fixedNow = getFixedDateForWeekNumber(weekNumberType, date);
  const firstDayOfYear = toUTCDate(fixedNow.getUTCFullYear(), 0, 1);
  const wk = Math.ceil(((+fixedNow - +firstDayOfYear) / 864e5 + 1) / 7);

  return {
    originalDate: date,
    fixedDate: fixedNow,
    weekNumber: wk,
  };
}

interface ParamsCalendarWeekdays {
  firstDayOfWeek: AppDatepicker['firstDayOfWeek'];
  showWeekNumber: AppDatepicker['showWeekNumber'];
  weekLabel?: AppDatepicker['weekLabel'];

  longWeekdayFormatter: DateTimeFormatter;
  narrowWeekdayFormatter: DateTimeFormatter;
}
export interface CalendarWeekdays {
  label: string;
  value: string;
}
export function calendarWeekdays({
  firstDayOfWeek,
  showWeekNumber,
  weekLabel,

  longWeekdayFormatter,
  narrowWeekdayFormatter,
}: ParamsCalendarWeekdays): CalendarWeekdays[] {
  const fixedFirstDayOfWeek = 1 + ((firstDayOfWeek + (firstDayOfWeek < 0 ? 7 : 0)) % 7);
  const weekdays: CalendarWeekdays[] =
    showWeekNumber ? [{ label: 'Week', value: !weekLabel ? 'Wk' : weekLabel }] : [];

  for (let i = 0, len = 7; i < len; i += 1) {
    const dateDate = toUTCDate(2017, 0, fixedFirstDayOfWeek + i);

    weekdays.push({
      /** NOTE: Stripping LTR mark away for x-browser compatibilities and consistency reason */
      label: longWeekdayFormatter(dateDate),
      value: narrowWeekdayFormatter(dateDate),
    });
  }

  return weekdays;
}

interface ParamsCalendarDays {
  firstDayOfWeek: AppDatepicker['firstDayOfWeek'];
  selectedDate: AppDatepicker['_selectedDate'];
  showWeekNumber: AppDatepicker['showWeekNumber'];
  weekNumberType: AppDatepicker['weekNumberType'];
  disabledDatesList: number[];
  disabledDaysList: number[];
  min: Date;
  max: Date;
  idOffset: number;

  fullDateFormatter: DateTimeFormatter;
  dayFormatter: DateTimeFormatter;
}
interface CalendarDay {
  fullDate: ReturnType<Date['toJSON']> | null;
  label: string | null;
  value: string | null;
  id: string;
  disabled: boolean;
}
export interface CalendarDays {
  calendar: CalendarDay[][];
  disabledDates: number[];
}
export function calendarDays({
  firstDayOfWeek,
  selectedDate,
  showWeekNumber,
  weekNumberType,
  disabledDatesList,
  disabledDaysList,
  min,
  max,
  idOffset,

  fullDateFormatter,
  dayFormatter,
}: ParamsCalendarDays): CalendarDays {
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
  const fy = selectedDate.getUTCFullYear();
  const selectedMonth = selectedDate.getUTCMonth();
  const totalDays = toUTCDate(fy, selectedMonth + 1, 0).getUTCDate();
  const preFirstWeekday = toUTCDate(fy, selectedMonth, 1).getUTCDay() - firstDayOfWeek;
  const firstWeekday = normalizeWeekday(preFirstWeekday);
  const totalCol = showWeekNumber ? 8 : 7;
  const firstWeekdayWithWeekNumberOffset = firstWeekday + (showWeekNumber ? 1 : 0);
  const allCalendarRows: CalendarDay[][] = [];
  const allDisabledDates: number[] = [];
  const minTime = +min;
  const maxTime = +max;

  let calendarRow: CalendarDay[] = [];
  let day = 1;
  let row = 0;
  let col = 0;
  let calendarFilled = false;
  /**
   * NOTE(motss): Thinking this is cool to write,
   * don't blame me for writing this kind of loop.
   * Optimization is totally welcome to make things faster.
   * Also, I'd like to learn a better way. PM me and we can talk about that. 😄
   */
  for (let i = 0, len = 6 * totalCol + (showWeekNumber ? 6 : 0); i <= len; i += 1, col += 1) {
    if (col >= totalCol) {
      col = 0;
      row += 1;
      allCalendarRows.push(calendarRow);
      calendarRow = [];
    }

    if (i >= len) break;

    const rowVal = col + (row * totalCol);

    if (!calendarFilled && showWeekNumber && col < 1) {
      const { weekNumber } = computeWeekNumber(
        weekNumberType,
        toUTCDate(fy, selectedMonth, day - (row < 1 ? firstWeekday : 0)));
      const weekLabel = `Week ${weekNumber}`;

      calendarRow.push({
        fullDate: null,
        label: weekLabel,
        value: `${weekNumber}`,
        id: weekLabel,
        disabled: true,
      } as CalendarDay);
      // calendarRow.push(weekNumber);
      continue;
    }

    if (calendarFilled || rowVal < firstWeekdayWithWeekNumberOffset) {
      calendarRow.push({
        fullDate: null,
        label: null,
        value: null,
        id: `${(day + idOffset)}`,
        disabled: true,
      } as CalendarDay);
      // calendarRow.push(null);
      continue;
    }

    const d = toUTCDate(fy, selectedMonth, day);
    const dTime = +d;
    const fullDate = d.toJSON();
    const isDisabledDay =
      disabledDaysList.some(ndd => ndd === col) ||
      disabledDatesList.some(ndd => ndd === dTime) ||
      (dTime < minTime || dTime > maxTime);

    if (isDisabledDay) allDisabledDates.push(+d);

    calendarRow.push({
      fullDate,
      /** NOTE: Stripping LTR mark away for x-browser compatibilities and consistency reason */
      label: fullDateFormatter(d),
      value: dayFormatter(d),
      id: fullDate,
      disabled: isDisabledDay,
    } as CalendarDay);
    // calendarRow.push(day);
    day += 1;

    if (day > totalDays) calendarFilled = true;
  }

  return {
    calendar: allCalendarRows,
    disabledDates: allDisabledDates,
  };
}
