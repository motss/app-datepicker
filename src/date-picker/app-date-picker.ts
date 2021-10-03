import { customElement } from 'lit/decorators.js';

import { appDatePickerName } from './constants.js';
import { DatePicker } from './date-picker.js';

@customElement(appDatePickerName)
export class AppDatePicker extends DatePicker {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerName]: AppDatePicker;
  }
}
