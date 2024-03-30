import { customElement } from 'lit/decorators.js';

import { resetButton, resetShadowRoot } from '../../../styles.js';
import { modalDatePickerYearGridName } from './constants.js';
import { modalDatePickerYearGridStyles } from './styles.js';
import { YearGrid } from './year-grid.js';

@customElement(modalDatePickerYearGridName)
export class ModalDatePickerYearGrid extends YearGrid {
  static override styles = [
    resetShadowRoot,
    resetButton,
    modalDatePickerYearGridStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerYearGridName]: ModalDatePickerYearGrid;
  }
}
