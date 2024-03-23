import type { ElementMixinProperties } from '../mixins/types.js';
import type {
  CustomEventDetail,
  DatePickerProperties,
  SupportedKey,
} from '../types.js';
import type { OmitKey } from '../utility.types.js';

export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;

export interface SlotDatePickerInit
  extends OmitKey<DatePickerProperties, keyof ElementMixinProperties>,
    Partial<Pick<HTMLElement, 'slot'>> {
  onDatePickerDateUpdated(
    event: CustomEvent<CustomEventDetail['date-updated']['detail']>
  ): Promise<void> | void;
  onDatePickerFirstUpdated(
    event: CustomEvent<CustomEventDetail['first-updated']['detail']>
  ): Promise<void> | void;
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
