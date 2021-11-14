import { Dialog } from '@material/mwc-dialog';

import { datePickerDialogBaseStyling } from './stylings.js';

export class DatePickerDialogBase extends Dialog {
  public static override styles = [
    ...Dialog.styles,
    datePickerDialogBaseStyling,
  ];
}
