import { css } from 'lit';

export const datePickerInputStyling = css`
:host {
  /* mwc-textfield CSS variables: */
  /* --mdc-text-field-filled-border-radius: 4px 4px 0 0 */
  /* --mdc-text-field-idle-line-color: rgba(0, 0, 0, 0.42) */
  /* --mdc-text-field-hover-line-color: rgba(0, 0, 0, 0.87) */
  /* --mdc-text-field-disabled-line-color: rgba(0, 0, 0, 0.06) */
  /* --mdc-text-field-outlined-idle-border-color: rgba(0, 0, 0, 0.38) */
  /* --mdc-text-field-outlined-hover-border-color: rgba(0, 0, 0, 0.87) */
  /* --mdc-text-field-outlined-disabled-border-color: rgba(0, 0, 0, 0.06) */
  /* --mdc-text-field-fill-color: rgb(245, 245, 245) */
  /* --mdc-text-field-disabled-fill-color: rgb(250, 250, 250) */
  /* --mdc-text-field-ink-color: rgba(0, 0, 0, 0.87) */
  /* --mdc-text-field-label-ink-color: rgba(0, 0, 0, 0.6) */
  /* --mdc-text-field-disabled-ink-color: rgba(0, 0, 0, 0.37) */

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
