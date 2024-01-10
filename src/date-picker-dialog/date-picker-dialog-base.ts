import { MdDialog } from '@material/web/dialog/dialog.js';

import { ElementMixin } from '../mixins/element-mixin.js';
import { resetShadowRoot } from '../stylings.js';
import { datePickerDialogBaseStyling } from './stylings.js';

export class DatePickerDialogBase extends ElementMixin(MdDialog) {
  static override styles = [
    ...MdDialog.styles,
    resetShadowRoot,
    datePickerDialogBaseStyling,
  ];
}
