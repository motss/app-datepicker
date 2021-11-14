import { css, unsafeCSS } from 'lit';

import { appDatePickerDialogName } from './constants.js';

export const datePickerDialogBaseStyling = css`
:host {
  display: block;
}

.mdc-dialog__content {
  padding: 0;
}
`;

export const datePickerDialogStyling = css`
${unsafeCSS(appDatePickerDialogName)} {
  display: block;
}
`;
