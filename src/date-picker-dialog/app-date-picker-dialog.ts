import { customElement } from 'lit/decorators.js';

import { appDatePickerDialogName } from './constants.js';
import { DatePickerDialog } from './date-picker-dialog.js';

@customElement(appDatePickerDialogName)
export class AppDatePickerDialog extends DatePickerDialog {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerDialogName]: AppDatePickerDialog;
  }
}
