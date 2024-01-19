import { css } from 'lit';

export const yearGridStyle = css`
.yearGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(72px, auto));
  grid-template-rows: repeat(var(--_rows, auto-fill), 48px);
  place-items: center;

  padding-inline: 12px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-line-size);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}
`;

export const yearGrid_yearGridButtonStyle = css`
.yearGridButton {
  width: 72px;
  height: 36px
}

.yearGridButton[aria-pressed="true"] {
  --md-filled-button-leading-space: 12px;
  --md-filled-button-trailing-space: 12px;
}
`;
