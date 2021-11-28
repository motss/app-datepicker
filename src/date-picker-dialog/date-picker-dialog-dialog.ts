import { Dialog } from '@material/mwc-dialog';

import { ElementMixin } from '../mixins/element-mixin.js';
import { datePickerDialogDialogStyling } from './stylings.js';

export class DatePickerDialogDialog extends ElementMixin(Dialog) {
  public static override styles = [
    ...Dialog.styles,
    datePickerDialogDialogStyling,
  ];
}
