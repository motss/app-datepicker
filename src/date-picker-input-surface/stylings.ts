import { css } from 'lit';

export const DatePickerInputSurfaceStyling = css`
:host {
  --mdc-theme-surface: var(--base-primary);
  --mdc-theme-on-surface: var(--base-on-primary);

  display: block;
  position: relative;
}

.mdc-menu-surface.mdc-menu-surface--open {
  overflow: initial;
}
`;
