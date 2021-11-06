import type { DateTimeFormatter } from 'nodemod/dist/calendar/typings.js';

import type { calendarViews } from './constants.js';
import type { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyEnter, keyHome, keyPageDown, keyPageUp, keySpace, keyTab } from './key-values.js';
import type { DatePickerMinMaxProperties, DatePickerMixinProperties } from './mixins/typings.js';

export type CalendarView = CalendarViewTuple[number];

export type CalendarViewTuple = typeof calendarViews;

export interface ChangedEvent {
  isKeypress: boolean;
  value: DatePickerMixinProperties['value'];
}

export type ChangedProperties<T = Record<string, unknown>> = Map<keyof T, T[keyof T]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export interface DatePickerProperties extends DatePickerMixinProperties,
DatePickerMinMaxProperties {}

export interface DateUpdatedEvent {
  isKeypress: boolean;
  value: Date;
}

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

export type InferredFromSet<SetType> = SetType extends Set<infer T> ? T : never;

export interface SupportedCustomEventDetail {
  ['animation-finished']: null;
  ['changed']: ChangedEvent;
  ['date-updated']: DateUpdatedEvent;
  ['first-updated']: FirstUpdatedEvent;
  ['value-updated']: ValueUpdatedEvent;
  ['year-updated']: YearUpdatedEvent;
}

export type SupportedKey =
  | typeof keyArrowDown
  | typeof keyArrowLeft
  | typeof keyArrowRight
  | typeof keyArrowUp
  | typeof keyEnd
  | typeof keyEnter
  | typeof keyHome
  | typeof keyPageDown
  | typeof keyPageUp
  | typeof keySpace
  | typeof keyTab;

export interface ValueUpdatedEvent extends Pick<DateUpdatedEvent, 'isKeypress'> {
  value: string;
}

export interface YearUpdatedEvent {
  year: number;
}
