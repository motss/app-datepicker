import type { ChangedProperties, DatePickerProperties } from '../typings.js';

export type DatePickerChangedProperties = ChangedProperties<DatePickerProperties & {
  _currentDate: Date;
  _max: Date;
  _min: Date;
  _selectedDate: Date;
}>;
