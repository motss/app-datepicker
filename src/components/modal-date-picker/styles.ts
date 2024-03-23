import { css } from 'lit';

export const modalDatePickerStyles = css`
:host {
  --_p: 12px;
}

.dialog {
  max-width: 360px;
  max-height: 572px;
  width: 360px;
  height: 572px;
}

form {
  padding: 0;
}

.menu {
  --_padding: var(--_p);
}

.body {
  grid-area: body;
}
`;
