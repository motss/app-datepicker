import { customElement } from 'lit/decorators.js';

import { resetShadowRoot } from '../../styles.js';
import { renderActionsStyles } from '../../templates/render-actions/styles.js';
import { dockedDatePickerName } from './constants.js';
import { DatePicker } from './date-picker.js';
import { dockedDatePickerStyles } from './styles.js';

@customElement(dockedDatePickerName)
export class DockedDatePicker extends DatePicker {
  static override styles = [
    resetShadowRoot,
    renderActionsStyles,
    dockedDatePickerStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}
