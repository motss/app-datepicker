import { css, type CSSResult, unsafeCSS } from 'lit';

import { renderMenuButtonStyle } from '../../../render-helpers/render-menu-button/styles.js';

const areas = ['prevMonth', 'month', 'nextMonth', 'prevYear', 'year', 'nextYear'] as const;

const gridTemplateAreas: CSSResult = unsafeCSS(areas.join(' '));
const buttons = unsafeCSS(areas.map((area) => `.${area} { grid-area: ${area} }`).join('\n'));

export const dockedDatePickerHeaderStyles = css`
${renderMenuButtonStyle}

:host {
  display: block;
}

.header {
  display: grid;
  grid-template-areas: '${gridTemplateAreas}';
  grid-template-columns: repeat(2, 40px minmax(0px, 1fr) 40px);

  padding-block: var(--_padding-block);
  padding-inline: var(--_padding-inline);
  color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-headline-large-font);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}

.header :is(md-icon-button, md-text-button) {
  z-index: 1;
}

.header md-text-button {
  --md-text-button-disabled-label-text-color: var(--md-sys-color-on-surface);
  --md-text-button-disabled-icon-color: var(--md-sys-color-on-surface);

  --md-text-button-icon-size: 18px;
  --md-text-button-icon-color: var(--md-sys-color-on-surface-variant);

  --md-text-button-label-text-color: var(--md-sys-color-on-surface-variant);

  --md-text-button-focus-icon-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-focus-label-text-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-hover-icon-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-hover-label-text-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-hover-state-layer-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-pressed-icon-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-pressed-label-text-color: var(--md-sys-color-on-surface-variant);
  --md-text-button-pressed-state-layer-color: var(--md-sys-color-on-surface-variant);

  /** note: this forces the content to render without ellipsis. */
  width: fit-content;
}

.header ${buttons}
`;
