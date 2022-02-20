import { customElement } from 'lit/decorators.js';

import { appIconButtonName } from './constants.js';
import { IconButton } from './icon-button.js';

@customElement(appIconButtonName)
export class AppIconButton extends IconButton {}

declare global {
  interface HTMLElementTagNameMap {
    [appIconButtonName]: AppIconButton;
  }
}
