import { customElement } from 'lit/decorators.js';

import { resetShadowRoot } from '../../../stylings.js';
import { dockedDatePickerHeaderName } from './constants.js';
import { Header } from './header.js';
import { dockedDatePickerHeaderStyles } from './styles.js';

@customElement(dockedDatePickerHeaderName)
export class DockedDatePickerHeader extends Header {
  static override styles = [
    resetShadowRoot,
    dockedDatePickerHeaderStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerHeaderName]: DockedDatePickerHeader;
  }
}
