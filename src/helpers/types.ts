import type { SupportedKey } from '../types.js';

export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;

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
