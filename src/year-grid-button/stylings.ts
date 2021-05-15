import { css } from '@lit/reactive-element';

export const yearGridButtonStyling = css`
:host {
  --mdc-button-horizontal-padding: 0;

  align-items: center;
  justify-content: center;

  width: 56px;
  height: 32px;
}

.mdc-button {
  max-width: 52px;
  min-width: 52px;
  width: 52px;
  height: 28px;
  padding: 0;
  border-radius: 52px;
}
`;
