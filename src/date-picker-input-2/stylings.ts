import { css } from 'lit';

export const datePickerInputStyling = css`
:host {
  --mdc-theme-text-disabled-on-light: var(--date-picker-input-disabled-icon);

  position: relative;
}

.mdc-text-field__icon--trailing {
  padding: 0;
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
  color: var(--date-picker-input-icon, rgba(0, 0, 0, 0.54));
  pointer-events: auto;
}
`;
