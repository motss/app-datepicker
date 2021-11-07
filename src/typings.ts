import type { LitElement } from 'lit';
import type { DateTimeFormatter } from 'nodemod/dist/calendar/typings.js';

import type { startViews } from './constants.js';
import type { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyEnter, keyHome, keyPageDown, keyPageUp, keySpace, keyTab } from './key-values.js';
import type { DatePickerMinMaxProperties, DatePickerMixinProperties, ElementMixinProperties } from './mixins/typings.js';

export type StartView = StartViewTuple[number];

export type StartViewTuple = typeof startViews;

export interface ChangedEvent extends KeyEvent {
  value: DatePickerMixinProperties['value'];
}

export type ChangedProperties<T = Record<string, unknown>> = Map<keyof T, T[keyof T]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export interface DatePickerProperties extends
  DatePickerMinMaxProperties,
  DatePickerMixinProperties,
  ElementMixinProperties {}

export interface DateUpdatedEvent extends KeyEvent {
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

export type LitConstructor = Constructor<LitElement>;

export interface SupportedCustomEventDetail {
  // ['animation-finished']: null;
  // ['changed']: ChangedEvent;
  ['date-updated']: DateUpdatedEvent;
  ['first-updated']: FirstUpdatedEvent;
  // ['value-updated']: ValueUpdatedEvent;
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

export interface ValueUpdatedEvent extends KeyEvent {
  value: string;
}

/**
 * NOTE: No `KeyEvent` is needed as native `button` element will dispatch `click` event on keypress.
 */
export interface YearUpdatedEvent {
  year: number;
}

interface KeyEvent {
  isKeypress: boolean;
  key?: SupportedKey;
}
