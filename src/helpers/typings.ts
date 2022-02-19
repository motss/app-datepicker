import type { Calendar, CalendarInit, CalendarWeekday } from 'nodemod/dist/calendar/typings.js';

import type { ElementMixinProperties } from '../mixins/typings.js';
import type { CustomEventDetail, DatePickerProperties, Formatters, SupportedKey } from '../typings.js';
import type { OmitKey } from '../utility-typings.js';

export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;

export interface MultiCalendars extends Omit<Calendar, 'calendar'> {
  calendars: Pick<Calendar, 'calendar' | 'key'>[];
  weekdays: CalendarWeekday[];
}

export interface SlotDatePickerInit extends OmitKey<DatePickerProperties, keyof ElementMixinProperties> {
  onDatePickerDateUpdated(event: CustomEvent<CustomEventDetail['date-updated']['detail']>): Promise<void> | void;
  onDatePickerFirstUpdated(event: CustomEvent<CustomEventDetail['first-updated']['detail']>): Promise<void> | void;
}

export interface ToMultiCalendarsInit extends
Pick<Formatters, 'dayFormat' | 'fullDateFormat' | 'longWeekdayFormat' | 'narrowWeekdayFormat'>,
Partial<Pick<
  DatePickerProperties, 'firstDayOfWeek' | 'showWeekNumber' | 'weekLabel' | 'weekNumberType'
>>,
Pick<DatePickerProperties, 'locale'>,
Pick<CalendarInit, 'disabledDates' | 'disabledDays' | 'max' | 'min'> {
  count?: number;
  currentDate: CalendarInit['date'];
}

export interface ToNextSelectableDateInit {
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  key: SupportedKey;
  maxTime: number;
  minTime: number;
}

export interface ToNextSelectedDateInit {
  currentDate: Date;
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  hasAltKey: boolean;
  key: SupportedKey;
  maxTime: number;
  minTime: number;
}
