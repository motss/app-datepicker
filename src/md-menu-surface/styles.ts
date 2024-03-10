import { css } from 'lit';

export const mdMenuSurfaceStyles = css`
:host {
  --md-elevation-level: var(--md-menu-surface-container-elevation, 2);
  --md-elevation-shadow-color: var(--md-menu-surface-container-shadow-color, var(--md-sys-color-shadow, #000));
}

.menu {
  border-radius: var(--md-menu-surface-container-shape, 16px);
}

.items {
  background-color: var(--md-menu-surface-container-color, var(--md-sys-color-surface-container-high));
}

.item-padding {
  padding-block: var(--md-menu-surface-item-padding-block, 8px);
}
`;
