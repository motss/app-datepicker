import type {
  Calendar,
  CalendarOptions,
  CalendarWeekday,
} from 'nodemod/dist/calendar/calendar_typing.js';

import type { DatePickerProperties, Formatters, SupportedKeyCode } from '../typings.js';

export interface ComputeNextSelectedDateInit {
  currentDate: Date;
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  hasAltKey: boolean;
  keyCode: SupportedKeyCode;
  maxTime: number;
  minTime: number;
}

export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;

export interface MultiCalendars extends Omit<Calendar, 'calendar'> {
  calendars: Pick<Calendar, 'calendar' | 'key'>[];
  weekdays: CalendarWeekday[];
}

export interface ToMultiCalendarsInit extends
Pick<Formatters, 'dayFormat' | 'fullDateFormat' | 'longWeekdayFormat' | 'narrowWeekdayFormat'>,
Partial<Pick<
  DatePickerProperties, 'firstDayOfWeek' | 'showWeekNumber' | 'weekLabel' | 'weekNumberType'
>>,
Pick<DatePickerProperties, 'locale'>,
Pick<CalendarOptions, 'disabledDates' | 'disabledDays' | 'max' | 'min'> {
  count?: number;
  currentDate: CalendarOptions['selectedDate'];
}

export interface ToNextSelectableDateInit {
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  keyCode: SupportedKeyCode;
  maxTime: number;
  minTime: number;
}
