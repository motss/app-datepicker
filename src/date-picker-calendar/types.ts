import type { DatePickerProperties } from '../typings.js';

export interface DatePickerCalendarProperties extends DatePickerProperties {
  onDateChange?(focusedDate: Date): void;
  onDateUpdate?(selectedDate: Date): void;
  onYearUpdate?(): void;
  reset(): Promise<boolean>;
}
