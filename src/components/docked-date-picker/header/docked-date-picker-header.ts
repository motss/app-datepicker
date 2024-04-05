import { customElement } from 'lit/decorators.js';

import { resetShadowRoot } from '../../../styles.js';
import { renderMenuButtonStyles } from '../../../templates/render-menu-button/styles.js';
import { dockedDatePickerHeaderName } from './constants.js';
import { Header } from './header.js';
import { dockedDatePickerHeaderStyles } from './styles.js';

@customElement(dockedDatePickerHeaderName)
export class DockedDatePickerHeader extends Header {
  static override styles = [
    resetShadowRoot,
    renderMenuButtonStyles,
    dockedDatePickerHeaderStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerHeaderName]: DockedDatePickerHeader;
  }
}
