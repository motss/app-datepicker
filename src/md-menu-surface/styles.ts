import { css } from 'lit';

export const mdMenuSurfaceStyle = css`
:host {
  --md-elevation-level: var(--md-menu-surface-container-elevation, 2);
  --md-elevation-shadow-color: var(--md-menu-surface-container-shadow-color, var(--md-sys-color-shadow, #000));
}
`;

export const mdMenuSurface_menuStyle = css`
.menu {
  border-radius: var(--md-menu-surface-container-shape, 4px);
}
`;

export const mdMenuSurface_itemsStyle = css`
.items {
  background-color: var(--md-menu-surface-container-color, var(--md-sys-color-surface-container-high));
}
`;
