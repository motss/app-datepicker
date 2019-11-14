import { DateTimeFormatter } from 'nodemod/dist/calendar/calendar_typing.js';

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type WeekNumberType =
  | 'first-4-day-week'
  | 'first-day-of-year'
  | 'first-full-week';

export type StartView = 'calendar' | 'yearList';

export type MonthUpdateType = 'previous' | 'next';

export interface Formatters {
  dayFormat: DateTimeFormatter;
  fullDateFormat: DateTimeFormatter;
  longWeekdayFormat: DateTimeFormatter;
  narrowWeekdayFormat: DateTimeFormatter;
  longMonthYearFormat: DateTimeFormatter;
  dateFormat: DateTimeFormatter;
  yearFormat: DateTimeFormatter;

  locale: string;
}

export const enum KEYCODES_MAP {
  // CTRL = 17,
  // ALT = 18,
  ESCAPE = 27,
  SHIFT = 16,
  TAB = 9,
  ENTER = 13,
  SPACE = 32,
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  END = 35,
  HOME = 36,
  ARROW_LEFT = 37,
  ARROW_UP = 38,
  ARROW_RIGHT = 39,
  ARROW_DOWN = 40,
}

export interface FocusTrap {
  disconnect: () => void;
}
