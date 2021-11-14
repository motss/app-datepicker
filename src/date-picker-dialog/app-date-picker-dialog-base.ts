import { customElement } from 'lit/decorators.js';

import { appDatePickerDialogBaseName } from './constants.js';
import { DatePickerDialogBase } from './date-picker-dialog-base.js';

@customElement(appDatePickerDialogBaseName)
export class AppDatePickerDialogBase extends DatePickerDialogBase {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerDialogBaseName]: AppDatePickerDialogBase;
  }
}
