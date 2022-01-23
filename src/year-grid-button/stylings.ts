import { css } from 'lit';

export const yearGridButtonStyling = css`
:host {
  --mdc-button-horizontal-padding: 0;
  --mdc-theme-primary: var(--base-primary);
  --mdc-theme-on-primary: var(--base-on-primary);

  align-items: center;
  justify-content: center;

  width: 56px;
  height: 32px;
  pointer-events: none;
}

.mdc-button {
  max-width: 52px;
  min-width: 52px;
  width: 52px;
  height: 28px;
  padding: 0;
  background-color: inherit;
  color: inherit;
  font: inherit;
  font-size: 13px;
  border-radius: 52px;
  pointer-events: auto;
}
`;
