import { css } from 'lit';

export const datePickerDialogBaseStyling = css`
/* mwc-dialog CSS Variables: */
/* --mdc-dialog-scrim-color: rgba(0, 0, 0, 0.32) */
/* --mdc-dialog-heading-ink-color: rgba(0, 0, 0, 0.87) */
/* --mdc-dialog-content-ink-color: rgba(0, 0, 0, 0.6) */
/* --mdc-dialog-scroll-divider-color: rgba(0, 0, 0, 0.12) */
/* --mdc-dialog-min-width: 280px */
/* --mdc-dialog-max-width: 560px */
/* --mdc-dialog-max-height: calc(100% - 32px) */
/* --mdc-dialog-box-shadow: mdc elevation 24 */
/* --mdc-dialog-z-index: 7 */

:host {
  --mdc-dialog-min-width: 256px;
}

.mdc-dialog .mdc-dialog__surface,
.mdc-dialog .mdc-dialog__content {
  --mdc-shape-medium: var(--_shape);

  border-radius: var(--_shape);
  overflow: initial;
}

.mdc-dialog .mdc-dialog__content {
  background-color: inherit;
  padding: 0;
}

app-date-picker {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-dialog .mdc-dialog__actions {
  border-radius: var(--_shape);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
`;

export const datePickerDialogStyling = css`
.secondary-actions {
  margin: 0;
}
.secondary-actions mwc-button + mwc-button {
  margin: 0 0 0 8px;
}
`;
