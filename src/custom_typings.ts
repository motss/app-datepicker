import { DateTimeFormatter } from 'nodemod/dist/calendar/calendar_typing.js';

// #region TS helpers
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
// #endregion TS helpers

// #region part attribute
type HTMLButtonElementPart =
  | 'calendar-selector'
  | 'month-selector'
  | 'year-selector'
  | 'year';
type HTMLDivElementPart =
  | 'actions'
  | 'body'
  | 'calendar-view'
  | 'calendar'
  | 'calendars'
  | 'day'
  | 'dialog-content'
  | 'header'
  | 'label'
  | 'month-selectors'
  | 'scrim'
  | 'toolbar'
  | 'year-list-view'
  | 'year-list';
type HTMLElementMWCButtonPart =
  | 'clear'
  | 'confirm'
  | 'dismiss';
type HTMLTableCellElementPart = /** Both td and th have the same instance */
  | 'calendar-day'
  | 'weekday';
type HTMLTableElementPart = 'table';
type HTMLTableRowElementPart = 'weekdays';
export type HTMLElementPart =
  | HTMLButtonElementPart
  | HTMLDivElementPart
  | HTMLElementMWCButtonPart
  | HTMLTableCellElementPart
  | HTMLTableElementPart
  | HTMLTableRowElementPart;
// #endregion part attribute

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

export const enum KEY_CODES_MAP {
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
  disconnect(): void;
}

export interface DatepickerValueUpdated {
  isKeypress: boolean;
  keyCode?: KEY_CODES_MAP;
  value: string;
}

export interface DatepickerFirstUpdated extends Pick<DatepickerValueUpdated, 'value'> {
  firstFocusableElement: HTMLElement;
}
