import { Dialog } from '@material/mwc-dialog';

import { ElementMixin } from '../mixins/element-mixin.js';
import { datePickerDialogBaseStyling } from './stylings.js';

export class DatePickerDialogBase extends ElementMixin(Dialog) {
  public static override styles = [
    ...Dialog.styles,
    datePickerDialogBaseStyling,
  ];
}
