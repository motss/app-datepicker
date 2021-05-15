import type { DateTimeFormatter } from 'nodemod/dist/calendar/calendar_typing';

import type { keyCodesRecord } from './constants.js';
import type { DatePickerMinMaxProperties, DatePickerMixinProperties } from './mixins/typings.js';

export type CalendarView = CalendarViewTuple[number];

export type CalendarViewTuple = ['calendar', 'yearList'];

export interface ChangedEvent {
  isKeypress: boolean;
  value: DatePickerMixinProperties['value'];
}

export type ChangeProperties<T = Record<string, unknown>> = Map<keyof T, T[keyof T]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export type DatePickerProperties = DatePickerMixinProperties & DatePickerMinMaxProperties;

export interface FirstUpdatedEvent {
  focusableElements: HTMLElement[];
  value: DatePickerMixinProperties['value'];
}

export interface Formatters extends Pick<DatePickerMixinProperties, 'locale'> {
  dayFormat: DateTimeFormatter;
  fullDateFormat: DateTimeFormatter;
  longWeekdayFormat: DateTimeFormatter;
  narrowWeekdayFormat: DateTimeFormatter;
  longMonthFormat: DateTimeFormatter;
  longMonthYearFormat: DateTimeFormatter;
  dateFormat: DateTimeFormatter;
  yearFormat: DateTimeFormatter;
}



export interface SupportedCustomEvent {
  ['animation-finished']: null;
  ['changed']: ChangedEvent;
  ['first-updated']: FirstUpdatedEvent;
}

export type SupportedKeyCode = typeof keyCodesRecord[keyof typeof keyCodesRecord];
