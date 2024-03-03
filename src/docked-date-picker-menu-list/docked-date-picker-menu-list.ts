import { customElement } from 'lit/decorators.js';

import { resetShadowRoot } from '../stylings.js';
import { dockedDatePickerMenuListName } from './constants.js';
import { MenuList } from './menu-list.js';

@customElement(dockedDatePickerMenuListName)
export class DockedDatePickerMenuList extends MenuList {
  static override styles = [
    resetShadowRoot,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerMenuListName]: DockedDatePickerMenuList;
  }
}
