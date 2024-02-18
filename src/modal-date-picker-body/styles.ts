import { css } from 'lit';

export const modalDatePickerBody_datePickerBodyStyle = css`
:host {
  --_side: 12px;
}

.datePickerBody {
  display: grid;
  grid-template-areas: 'menu' 'body';
  grid-template-rows: calc(4px + 4px + 40px + 4px + 4px) minmax(auto, calc(48px * 7));
}

.menu {
  --_padding: var(--_side);

  grid-area: menu;
}

.body {
  grid-area: body;
}
`;
