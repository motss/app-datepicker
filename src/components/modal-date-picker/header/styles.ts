import { css } from 'lit';

export const modalDatePickerHeaderStyles = css`
.header {
  display: grid;
  grid-template-areas: 'supportingText .' 'headline iconButton';
  grid-template-columns: minmax(1px, 1fr) 48px;
  gap: 0 8px;

  width: 100%;
  height: 120px;
  padding-block: 16px 12px;
  padding-inline: var(--modal-date-picker-header-padding-inline);
  border: none;
  border-start-start-radius: var(--md-sys-shape-corner-extra-large);
  border-start-end-radius: var(--md-sys-shape-corner-extra-large);

  color: var(--md-sys-color-on-surface-variant);
}

p {
  margin: 0;
}

.supportingText,
.headline {
  padding-inline: var(--_side) 0;
}

.supportingText {
  grid-area: supportingText;

  color: inherit;
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
}

.headline {
  grid-area: headline;
  align-self: end;

  color: var(--md-sys-color-on-surface);
}

.iconButton {
  --md-icon-button-state-layer-width: 48px;
  --md-icon-button-state-layer-height: 48px;

  grid-area: iconButton;

  align-self: end;
  color: inherit;
}
`;
