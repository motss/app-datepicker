import type { DatePickerProperties } from '../../types.js';

export interface ValueControllerHostProperties extends Pick<DatePickerProperties, 'value'> {}

export interface ValueControllerProperties extends ValueControllerHostProperties {
  valueDate: Date;
}
