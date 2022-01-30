import { css } from 'lit';

export const datePickerInputStyling = css`
:host {
  --mdc-text-field-disabled-fill-color: var(--date-picker-input-disabled-fill);
  --mdc-text-field-disabled-ink-color: var(--date-picker-input-disabled-ink);
  --mdc-text-field-disabled-line-color: var(--date-picker-input-disabled-line);
  --mdc-text-field-fill-color: var(--date-picker-input-fill);
  --mdc-text-field-filled-border-radius: var(--date-picker-input-filled-border-radius);
  --mdc-text-field-hover-line-color: var(--date-picker-input-hover-line);
  --mdc-text-field-idle-line-color: var(--date-picker-input-idle-line);
  --mdc-text-field-ink-color: var(--base-on-primary);
  --mdc-text-field-label-ink-color: var(--date-picker-input-label-ink);
  --mdc-text-field-outlined-disabled-border-color: var(--date-picker-input-disabled-line);
  --mdc-text-field-outlined-hover-border-color: var(--date-picker-input-hover-line);
  --mdc-text-field-outlined-idle-border-color: var(--date-picker-input-idle-line);
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
