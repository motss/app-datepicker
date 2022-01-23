import { css } from 'lit';

export const datePickerInputStyling = css`
:host {
  --mdc-text-field-ink-color: var(--base-on-primary);
  --mdc-text-field-label-ink-color: var(--base-on-primary);
  --mdc-text-field-hover-line-color: var(--base-on-primary);
  --mdc-text-field-hover-idle-line-color: var(--base-hover);
  --mdc-text-field-outlined-idle-border-color: var(--base-hover);
  --mdc-text-field-outlined-hover-border-color: var(--base-on-primary);
  --mdc-theme-primary: var(--base-primary);

  position: relative;
}

.mdc-text-field__icon--trailing {
  padding: 0;
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
  pointer-events: auto;
  color: var(--date-picker-input-on-icon, rgba(0, 0, 0, 0.54));
}
`;
