import type { DatePickerProperties } from '../typings.js';

export interface ModalDatePickerBodyProperties extends DatePickerProperties {
  onDateUpdate?(selectedDate: Date): void;
  reset(): Promise<boolean>;
}
