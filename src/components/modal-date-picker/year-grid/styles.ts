import { css } from 'lit';

export const modalDatePickerYearGrid_yearGridStyle = css`
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

export const modalDatePickerYearGrid_yearGridButtonStyle = css`
.yearGridButton {
  --_outlineColor: rgba(0 0 0 / 0);
  --_labelColor: var(--md-sys-color-on-surface);
  --_space: 12px;

  --md-outlined-button-outline-color: var(--_outlineColor);
  --md-outlined-button-leading-space: var(--_space);
  --md-outlined-button-trailing-space: var(--_space);
  --md-outlined-button-label-text-color: var(--_labelColor);

  width: 72px;
  height: 36px;
}

.yearGridButton.toyear {
  --_outlineColor: var(--md-sys-color-primary);
  --_labelColor: var(--md-sys-color-primary);
}

.yearGridButton[aria-pressed="true"] {
  --md-filled-button-leading-space: var(--_space);
  --md-filled-button-trailing-space: var(--_space);
}
`;
