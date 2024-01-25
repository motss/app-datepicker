import { css } from 'lit';

export const modalDatePickerBodyMenu_bodyMenuStyle = css`
:host {
  --_btn-size: 48px;

  display: block;

  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-size: var(--md-sys-typescale-body-large-size);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}

.bodyMenu {
  display: grid;
  grid-template-areas: 'menuButton . prevIconButton nextIconButton';
  grid-template-columns: minmax(1px, auto) 1fr repeat(2, minmax(var(--_btn-size), auto));
  grid-template-rows: var(--_btn-size);
  align-items: center;
}
`;

export const modalDatePickerBodyMenu_buttonsStyle = css`
.menuButton,
.prevIconButton,
.nextIconButton {
  /** note: bump z-index to fix focus ring from overlapping with other elements */
  z-index: 1;
}

.prevIconButton,
.nextIconButton {
  width: var(--_btn-size);
  height: var(--_btn-size);
}

.menuButton {
  --_icon-size: 24px; /** note(do-not-remove): this is md3 private css variable. */

  grid-area: menuButton;
}

.menuButton .icon {
  transition: transform 350ms cubic-bezier(0.05, 0.7, 0.1, 1.0);
  transform: rotateZ(var(--_state, 0deg));
  will-change: transform;
}

.prevIconButton {
  grid-area: prevIconButton;
}

.nextIconButton {
  grid-area: nextIconButton;
}
`;
