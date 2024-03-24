import type { MinMaxMixinProperties } from '../../mixins/types.js';
import type { DatePickerProperties } from '../../types.js';

type PickDatePickerProperties = Pick<
  DatePickerProperties,
  | 'disabledDates'
  | 'disabledDays'
  | 'firstDayOfWeek'
  | 'locale'
  | 'shortWeekLabel'
  | 'showWeekNumber'
  | 'weekLabel'
  | 'weekNumberTemplate'
  | 'weekNumberType'
>;

export interface DatePickerCalendarProperties extends
  PickDatePickerProperties,
  MinMaxMixinProperties {
  onDateChange?(focusedDate: Date): void;
  onDateUpdate?(selectedDate: Date): void;
  reset(): Promise<boolean>;
}
