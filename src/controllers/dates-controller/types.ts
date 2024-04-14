import type { CalendarProperties } from '../../components/app-calendar/types.js';
import type { DatePickerProperties } from '../../types.js';

export interface DatesControllerData
  extends Pick<
    DatesControllerProperties,
    'focusedDate' | 'selectedDate' | 'tabbableDate'
  > {}

export interface DatesControllerHostProperties
  extends Pick<
    DatePickerProperties,
    'disabledDates' | 'disabledDays' | 'max' | 'min' | 'value'
  > {}

export interface DatesControllerInit {
  onConfirmByKey?(ev: KeyboardEvent, data: DatesControllerData): void;
  onUpdate?(init: DatesControllerData): void;
}

export interface DatesControllerProperties
  extends Required<
    Pick<CalendarProperties, 'onDateUpdateByClick' | 'onDateUpdateByKey'>
  > {
  focusedDate: Date;
  selectedDate: Date;
  tabbableDate: Date;
  updateBy(init: UpdateByInit): void;
}

interface UpdateByInit
  extends Partial<
    Pick<DatesControllerProperties, 'focusedDate' | 'selectedDate'>
  > {}
