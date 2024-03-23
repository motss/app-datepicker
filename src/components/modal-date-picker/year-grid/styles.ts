import { css } from 'lit';

import { mdSysTypescaleBodyLarge, mdSysTypescaleTitleMedium } from '../../../typography.js';

export const modalDatePickerYearGridStyles = css`
.yearGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(1px, calc(312px / 3)));
  grid-template-rows: repeat(var(--_rows, auto-fill), 52px);
  place-items: center;

  padding-inline: 13px; /** note: scrollbar's width is 11px when scrollbar-width: thin; is set */
  padding-block: 8px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);

  font-size: ${mdSysTypescaleBodyLarge.size};
  font-weight: ${mdSysTypescaleBodyLarge.weight};
  line-height: ${mdSysTypescaleBodyLarge.lineHeight};
}

.yearGridButton {
  --_outlineColor: rgba(0 0 0 / 0);
  --_labelColor: var(--md-sys-color-on-surface);
  --_space: 12px;

  --md-outlined-button-label-text-color: var(--_labelColor);
  --md-outlined-button-label-text-line-height: ${mdSysTypescaleBodyLarge.lineHeight};
  --md-outlined-button-label-text-size: ${mdSysTypescaleBodyLarge.size};
  --md-outlined-button-label-text-weight: ${mdSysTypescaleBodyLarge.weight};
  --md-outlined-button-leading-space: var(--_space);
  --md-outlined-button-outline-color: var(--_outlineColor);
  --md-outlined-button-trailing-space: var(--_space);

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
  --md-filled-button-label-text-line-height: ${mdSysTypescaleTitleMedium.lineHeight};
  --md-filled-button-label-text-size: ${mdSysTypescaleTitleMedium.size};
  --md-filled-button-label-text-weight: ${mdSysTypescaleTitleMedium.weight};
}
`;
