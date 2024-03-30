import { css } from 'lit';

import {
  includeScrollbarStyles,
  includeSeparatorStyles,
} from '../../styles.js';
import { mdRefTypefacePlain, mdSysTypescaleBodyLarge, mdSysTypescaleHeadlineLarge, mdSysTypescaleLabelLarge } from '../../typography.js';

const headerStyles = css`
.header {
  display: grid;
  grid-template-areas: 'supportingText .' 'headline iconButton';
  grid-template-columns: minmax(1px, 1fr) 48px;
  gap: 0 8px;

  width: 100%;
  height: 120px;
  padding-block: 16px 12px;
  padding-inline: 24px 12px;
  border: none;
  border-start-start-radius: var(--md-sys-shape-corner-extra-large);
  border-start-end-radius: var(--md-sys-shape-corner-extra-large);

  color: var(--md-sys-color-on-surface-variant);
  font-size: ${mdSysTypescaleLabelLarge.size};
  font-weight: ${mdSysTypescaleLabelLarge.weight};
  line-height: ${mdSysTypescaleLabelLarge.lineHeight};
}
${includeSeparatorStyles('.header', 'end')}

p {
  margin: 0;
}

.supportingText,
.headline {
  padding-inline: var(--_side) 0;
}

.supportingText {
  grid-area: supportingText;
}

.headline {
  grid-area: headline;
  align-self: end;

  color: var(--md-sys-color-on-surface);
  font-size: ${mdSysTypescaleHeadlineLarge.size};
  font-weight: ${mdSysTypescaleHeadlineLarge.weight};
  line-height: ${mdSysTypescaleHeadlineLarge.lineHeight};
}

.iconButton {
  --md-icon-button-state-layer-width: 48px;
  --md-icon-button-state-layer-height: 48px;

  grid-area: iconButton;

  align-self: end;
  color: inherit;
}
`;

const menuStyles = css`
.menu {
  --_btn-size: 48px;

  display: grid;
  grid-template-areas: 'menuButton . prevIconButton nextIconButton';
  grid-template-columns: minmax(1px, auto) 1fr repeat(2, minmax(var(--_btn-size), auto));
  grid-template-rows: var(--_btn-size);
  align-content: center;

  color: var(--md-sys-color-on-surface);
  padding-inline: 8px 12px;
}

.menuButton,
.prevIconButton,
.nextIconButton {
  /** NOTE: bump z-index to fix focus ring from overlapping with other elements */
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

export const modalDatePickerStyles = css`
:host {
  --_bp: 12px;
  --_dh: 572px;
  --_bh: minmax(calc(48px * 6), calc(48px * 7));
  --_bo: initial;

  font-family: ${mdRefTypefacePlain(`'Open Sans', sans-serif, system-ui`)};
}
:host([startview=yearGrid]) {
  --_dh: 516px;
  --_bh: 280px;
  --_bo: auto;
  --_bp: 0px;
}

.dialog {
  max-width: 360px;
  max-height: var(--_dh);
  width: 360px;
  height: 100%;
}

form {
  display: grid;
  grid-template-areas: 'header' 'menu' 'body';
  grid-template-rows: 120px 56px var(--_bh);

  padding: 0;
}

${headerStyles}
.header {
  grid-area: header;
}

${menuStyles}
.menu {
  grid-area: menu;
}

.body {
  --_padding-inline-start: 12px;
  --_padding-inline-end: 12px;

  grid-area: body;
  overflow-y: var(--_bo);
}
${includeScrollbarStyles(':host([startview=yearGrid]) .body', true)}

${includeSeparatorStyles(':host([startview=yearGrid]) .actions', 'start')}
`;
