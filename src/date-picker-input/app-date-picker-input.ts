import { customElement } from 'lit/decorators.js';

import { appDatePickerInputName } from './constants.js';
import { DatePickerInput } from './date-picker-input.js';

@customElement(appDatePickerInputName)
export class AppDatePickerInput extends DatePickerInput {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerInputName]: AppDatePickerInput;
  }
}
