import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { customElement } from 'lit/decorators.js';

import { ElementMixin } from '../mixins/element-mixin.js';
import { dockedDatePickerTextFieldName } from './constants.js';

@customElement(dockedDatePickerTextFieldName)
export class DockedDatePickerTextField extends ElementMixin(MdOutlinedTextField) {
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerTextFieldName]: DockedDatePickerTextField;
  }
}
