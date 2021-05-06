import { customElement } from 'lit/decorators.js';

import { APP_DATEPICKER_NAME } from './constants.js';
import { DatePicker } from './date-picker.js';

@customElement(APP_DATEPICKER_NAME)
class AppDatePicker extends DatePicker {}

declare global {
  interface HTMLElementTagNameMap {
    [APP_DATEPICKER_NAME]: AppDatePicker;
  }
}
