import type {
  Calendar,
  CalendarWeekday,
} from 'nodemod/dist/calendar/calendar_typing.js';

import type { DatePickerProperties, Formatters, SupportedKeyCode } from '../typings.js';

export interface ComputeNextFocusedDateInit {
  hasAltKey: boolean;
  keyCode: SupportedKeyCode;
  focusedDate: Date;
  selectedDate: Date;
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  minTime: number;
  maxTime: number;
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
Pick<DatePickerProperties, 'locale'> {
  count?: number;
  disabledDates?: Date[];
  disabledDays?: number[];
  max?: Date;
  min?: Date;
  selectedDate: Date;
}

export interface ToNextSelectableDateInit {
  keyCode: SupportedKeyCode;
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  focusedDate: Date;
  maxTime: number;
  minTime: number;
}
