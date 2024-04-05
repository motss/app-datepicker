import { customElement } from 'lit/decorators.js';

import { baseStyling, resetShadowRoot } from '../../styles.js';
import { renderActionsStyles } from '../../templates/render-actions/styles.js';
import { modalDatePickerName } from './constants.js';
import { DatePicker } from './date-picker.js';
import { modalDatePickerStyles } from './styles.js';

@customElement(modalDatePickerName)
export class ModalDatePicker extends DatePicker {
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerStyles,
    renderActionsStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerName]: ModalDatePicker;
  }
}
