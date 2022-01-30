import { css } from 'lit';

export const datePickerDialogBaseStyling = css`
.mdc-dialog .mdc-dialog__surface,
.mdc-dialog .mdc-dialog__content {
  --mdc-dialog-content-ink-color: var(--base-on-primary);
  --mdc-dialog-min-width: 256px;
  --mdc-theme-surface: var(--base-surface);

  overflow: initial;
}

.mdc-dialog .mdc-dialog__content {
  background-color: inherit;
  padding: 0;
}

.mdc-dialog .mdc-dialog__actions {
  --mdc-theme-primary: var(--base-on-primary);
}

.mdc-dialog .mdc-dialog__scrim {
  --mdc-dialog-scrim-color: var(--date-picker-dialog-scrim);
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
