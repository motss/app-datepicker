import { css, unsafeCSS } from 'lit';

import { includeScrollbarStyle } from '../stylings.js';

export const datePickerCalendarStyles = css`
:host {
  --_o: hidden;
  --_p: 12px;

  display: grid;
  overflow: var(--_o);
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}
:host([startview="yearGrid"]) {
  --_o: hidden auto;
}
${unsafeCSS(includeScrollbarStyle(':host([startview="yearGrid"])'))}

app-calendar {
  --_padding: var(--_p);
}
`;
