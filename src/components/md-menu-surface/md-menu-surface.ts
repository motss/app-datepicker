import { styles } from '@material/web/menu/internal/menu-styles.js';
import { customElement } from 'lit/decorators.js';

import { MdMenuSurfaceName } from './constants.js';
import { MenuSurface } from './menu-surface.js';
import { mdMenuSurfaceStyles } from './styles.js';

@customElement(MdMenuSurfaceName)
export class MdMenuSurface extends MenuSurface {
  static override styles = [styles, mdMenuSurfaceStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [MdMenuSurfaceName]: MdMenuSurface;
  }
}
