import { css } from 'lit';

export const DatePickerInputSurfaceStyling = css`
:host {
  /* mwc-menu-surface CSS Variables: */
  /* --mdc-menu-max-height: 604px */
  /* --mdc-menu-min-width: 112px */
  /* --mdc-menu-max-width: calc(100vw - 32px) */
  /* --mdc-menu-theme-surface: #fff */
  /* --mdc-menu-theme-on-surface: #000 */
  /* --mdc-shape-medium: 4px */

  --mdc-shape-medium: var(--_shape);

  display: block;
}

.mdc-menu-surface.mdc-menu-surface--open {
  overflow: initial;
}
`;
