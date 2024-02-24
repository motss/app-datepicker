import { styles } from '@material/web/menu/internal/menu-styles.css.js';
import { customElement } from 'lit/decorators.js';

import { MdMenuSurfaceName } from './constants.js';
import { MenuSurface } from './menu-surface.js';
import { mdMenuSurface_itemsStyle, mdMenuSurface_menuStyle, mdMenuSurfaceStyle } from './styles.js';

@customElement(MdMenuSurfaceName)
export class MdMenuSurface extends MenuSurface {
  static override styles = [
    styles,
    mdMenuSurfaceStyle,
    mdMenuSurface_menuStyle,
    mdMenuSurface_itemsStyle,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [MdMenuSurfaceName]: MdMenuSurface;
  }
}
