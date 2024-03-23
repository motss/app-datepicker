import { css } from 'lit';

import { mdSysTypescaleBodyLarge } from '../../../typography.js';

export const modalDatePickerBodyMenuStyles = css`
:host {
  --_btn-size: 48px;

  display: grid;
  grid-template-areas: 'menuButton . prevIconButton nextIconButton';
  grid-template-columns: minmax(1px, auto) 1fr repeat(2, minmax(var(--_btn-size), auto));
  grid-template-rows: var(--_btn-size);
  align-items: center;

  color: var(--md-sys-color-on-surface);
  padding-inline: var(--modal-date-picker-body-menu-padding-inline);
}

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
  --md-text-button-icon-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-label-text-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-label-text-line-height: ${mdSysTypescaleBodyLarge.lineHeight};
  --md-text-button-label-text-size: ${mdSysTypescaleBodyLarge.size};
  --md-text-button-label-text-weight: ${mdSysTypescaleBodyLarge.weight};

  grid-area: menuButton;
}

.prevIconButton {
  grid-area: prevIconButton;
}

.nextIconButton {
  grid-area: nextIconButton;
}
`;
