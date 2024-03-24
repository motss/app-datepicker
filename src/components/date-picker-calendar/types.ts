import type { MinMaxMixinProperties } from '../../mixins/types.js';
import type { DatePickerProperties } from '../../types.js';

interface CalendarStates {
  _focusedDate: Date;
  _selectedDate: Date;
  _tabbableDate: Date;
}

export interface DatePickerCalendarProperties
  extends CalendarStates,
    PickDatePickerProperties,
    MinMaxMixinProperties {
  onDateChange?(focusedDate: Date): void;
  onDateUpdate?(selectedDate: Date): void;
  reset(): Promise<boolean>;
}

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
