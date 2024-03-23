import type { DatePickerProperties } from '../../types.js';

type PickDatePickerProperties = Pick<
  DatePickerProperties,
  | 'disabledDates'
  | 'disabledDays'
  | 'firstDayOfWeek'
  | 'locale'
  | 'max'
  | 'min'
  | 'shortWeekLabel'
  | 'showWeekNumber'
  | 'weekLabel'
  | 'weekNumberTemplate'
  | 'weekNumberType'
>;

export interface DatePickerCalendarProperties extends PickDatePickerProperties {
  onDateChange?(focusedDate: Date): void;
  onDateUpdate?(selectedDate: Date): void;
  reset(): Promise<boolean>;
}
