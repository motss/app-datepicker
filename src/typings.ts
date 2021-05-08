import type { LitElement } from 'lit';

import type { DateTimeFormatter, WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import type { DatePickerMixin } from './date-picker-mixin.js';
import type { DatePicker } from './date-picker.js';

export type CalendarView = CalendarViewTuple[number];

export type CalendarViewTuple = ['calendar', 'yearList'];

export interface ChangedEvent {
  isKeypress: boolean;
  value: DatePickerElementInterface['value'];
}

export type ChangeProperties<T = Record<string, unknown>> = Map<keyof T, T[keyof T]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export interface DatePickerElementInterface {
  disabledDates: string;
  disabledDays: string;
  dragRatio: number;
  firstDayOfWeek: number;
  inline: boolean;
  landscape: boolean;
  locale: string;
  max?: string;
  min?: string;
  nextMonthLabel: string;
  previousMonthLabel: string;
  selectedDateLabel: string;
  showWeekNumber: number;
  startView: CalendarView;
  value: string;
  weekLabel: string;
  weekNumberType: WeekNumberType;
  yearDropdownLabel: string;
}

export type DatePickerInterface = DatePicker & DatePickerElementInterface;

export type DatePickerMixinInterface = ReturnType<typeof DatePickerMixin>;

export interface FirstUpdatedEvent {
  focusableElements: HTMLElement[];
  value: DatePickerElementInterface['value'];
}

export interface Formatters extends Pick<DatePickerElementInterface, 'locale'> {
  dayFormat: DateTimeFormatter;
  fullDateFormat: DateTimeFormatter;
  longWeekdayFormat: DateTimeFormatter;
  narrowWeekdayFormat: DateTimeFormatter;
  longMonthFormat: DateTimeFormatter;
  longMonthYearFormat: DateTimeFormatter;
  dateFormat: DateTimeFormatter;
  yearFormat: DateTimeFormatter;
}

export type MixinReturnType<
  BaseConstructor extends Constructor<LitElement>,
  Mixin
> = BaseConstructor & Constructor<Mixin>

export interface SupportedCustomEvent {
  ['animation-finished']: null;
  ['changed']: ChangedEvent;
  ['first-updated']: FirstUpdatedEvent;
}
