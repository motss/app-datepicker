import './app-datepicker.js';
import { DATEPICKER_DIALOG_NAME } from './constants.js';
import { DatepickerDialog } from './datepicker-dialog.js';
import { customElementsDefine } from './helpers/custom-elements-define.js';

customElementsDefine(DATEPICKER_DIALOG_NAME, DatepickerDialog);

declare global {
  interface HTMLElementTagNameMap {
    'app-datepicker-dialog': DatepickerDialog;
  }
}
