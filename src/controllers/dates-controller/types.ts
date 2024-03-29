import type { CalendarProperties } from '../../components/date-picker-calendar/calendar/types.js';

export interface DatesControllerProperties extends Required<Pick<CalendarProperties, 'onDateUpdateByClick' | 'onDateUpdateByKey'>> {
  focusedDate: Date;
  selectedDate: Date;
  tabbableDate: Date;
  updateBy(init: UpdateByInit): void;
}

interface UpdateByInit extends Partial<Pick<DatesControllerProperties, 'focusedDate' | 'selectedDate'>> {}
