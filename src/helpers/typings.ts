import type {
  Calendar,
  CalendarWeekday,
} from 'nodemod/dist/calendar/calendar_typing.js';

import type { DatePickerElementInterface, Formatters } from '../typings.js';

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
  DatePickerElementInterface, 'firstDayOfWeek' | 'showWeekNumber' | 'weekLabel' | 'weekNumberType'
>>,
Pick<DatePickerElementInterface, 'locale'> {
  disabledDates?: Date[];
  disabledDays?: number[];
  max?: Date;
  min?: Date;
  selectedDate: Date;
}
