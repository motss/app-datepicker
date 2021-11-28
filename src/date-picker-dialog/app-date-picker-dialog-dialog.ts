import { customElement } from 'lit/decorators.js';

import { appDatePickerDialogDialogName } from './constants.js';
import { DatePickerDialogDialog } from './date-picker-dialog-dialog.js';

@customElement(appDatePickerDialogDialogName)
export class AppDatePickerDialogDialog extends DatePickerDialogDialog {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerDialogDialogName]: AppDatePickerDialogDialog;
  }
}
