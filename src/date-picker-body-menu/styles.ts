import { css } from 'lit';

export const bodyMenuStyle = css`
.bodyMenu {
  display: grid;
  grid-template-areas: 'menuButton . prevIconButton nextIconButton';
  grid-template-columns: minmax(1px, auto) 1fr repeat(2, minmax(1px, auto));
  grid-template-rows: 40px;

  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-size: var(--md-sys-typescale-body-large-size);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}

.menuButton {
  --_icon-size: 24px;

  grid-area: menuButton;
}

.prevIconButton,
.nextIconButton {
  /** note: bump z-index to fix focus ring from overlapping with other elements */
  z-index: 1;
}

.prevIconButton {
  grid-area: prevIconButton;
}

.nextIconButton {
  grid-area: nextIconButton;
}
`;
