import { css } from 'lit';

export const datePickerInputStyling = css`
:host {
  position: relative;
}

.mdc-text-field__icon--trailing {
  padding: 0 4px 0 0;
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
  pointer-events: auto;
}
`;
