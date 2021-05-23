import { css } from '@lit/reactive-element';

export const yearGridButtonStyling = css`
:host {
  --mdc-button-horizontal-padding: 0;
  --mdc-theme-primary: var(--year-grid-button-color, #000);
  --mdc-theme-on-primary: var(--year-grid-button-text-color);

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
  font-size: 14px;
  border-radius: 52px;
  pointer-events: auto;
}
`;
