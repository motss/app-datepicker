import type { CalendarProperties } from '../../components/app-calendar/types.js';
import type { DatePickerProperties } from '../../types.js';

export interface DatesControllerHostProperties
  extends Pick<
    DatePickerProperties,
    'disabledDates' | 'disabledDays' | 'max' | 'min' | 'value'
  > {}

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
