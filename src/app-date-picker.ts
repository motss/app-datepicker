import { customElement } from 'lit/decorators.js';

import { APP_DATE_PICKER_NAME } from './constants.js';
import { DatePicker } from './date-picker.js';

@customElement(APP_DATE_PICKER_NAME)
class AppDatePicker extends DatePicker {}

declare global {
  interface HTMLElementTagNameMap {
    [APP_DATE_PICKER_NAME]: AppDatePicker;
  }
}
