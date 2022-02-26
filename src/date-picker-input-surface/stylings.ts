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
  position: absolute; /* NOTE(motss): Set this so that surface can be placed on top of its anchor element */
  top: 0; /** NOTE(motss): This ensures inputSurface renders downwards on top of input */
  bottom: 0; /** NOTE(motss): This ensures inputSurface renders upwards on top of input */
}

.mdc-menu-surface.mdc-menu-surface--open {
  overflow: initial;
}
`;
