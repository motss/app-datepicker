import { css } from 'lit';

export const datePickerHeader_headerStyle = css`
.header {
  display: grid;
  grid-template-areas: 'supportingText .' 'headline iconButton';
  grid-template-columns: minmax(1px, 1fr) 48px;
  gap: 0 8px;
  
  width: 100%;
  height: 120px;
  padding: 16px 12px 12px 24px;
  border: none;
  border-start-start-radius: var(--md-sys-shape-corner-extra-large);
  border-start-end-radius: var(--md-sys-shape-corner-extra-large);

  color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-headline-large-font);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}

p {
  margin: 0;
}
`;

export const datePickerHeader_supportingTextStyle = css`
.supportingText {
  grid-area: supportingText;

  color: inherit;
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
}
`;

export const datePickerHeader_headlineStyle = css`
.headline {
  grid-area: headline;

  align-self: end;

  color: inherit;
  font-family: var(--md-sys-typescale-headline-large-font);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}
`;

export const datePickerHeader_iconButtonStyle = css`
.iconButton {
  --md-icon-button-state-layer-width: 48px;
  --md-icon-button-state-layer-height: 48px;

  grid-area: iconButton;

  align-self: end;
  color: inherit;
}
`;
