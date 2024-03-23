import { css } from 'lit';

import {
  includeScrollbarStyles,
  includeSeparatorStyles,
} from '../../styles.js';
import { mdRefTypefacePlain } from '../../typography.js';

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

.header {
  --modal-date-picker-header-padding-inline: 24px 12px;

  grid-area: header;
}
${includeSeparatorStyles('.header', 'end')}

.menu {
  --modal-date-picker-body-menu-padding-inline: 8px 12px;

  grid-area: menu;
  align-content: center;
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
