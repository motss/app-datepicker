import { styles } from '@material/web/menu/internal/menu-styles.css.js';
import { customElement } from 'lit/decorators.js';

import { dockedDatePickerMenuSurfaceName } from './constants.js';
import { MenuSurface } from './menu-surface.js';

@customElement(dockedDatePickerMenuSurfaceName)
export class DockedDatePickerMenuSurface extends MenuSurface {
  static override styles = [styles];
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerMenuSurfaceName]: DockedDatePickerMenuSurface;
  }
}
