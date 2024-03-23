import { customElement } from 'lit/decorators.js';

import { resetShadowRoot } from '../../../styles.js';
import { dockedDatePickerMenuListName } from './constants.js';
import { MenuList } from './menu-list.js';
import { dockedDatePickerMenuListStyles } from './styles.js';

@customElement(dockedDatePickerMenuListName)
export class DockedDatePickerMenuList extends MenuList {
  static override styles = [resetShadowRoot, dockedDatePickerMenuListStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerMenuListName]: DockedDatePickerMenuList;
  }
}
