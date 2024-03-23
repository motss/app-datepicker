import { css, unsafeCSS } from 'lit';

import { includeScrollbarStyles } from '../../styles.js';

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
${unsafeCSS(includeScrollbarStyles(':host([startview="yearGrid"])'))}

app-calendar {
  --_padding: var(--_p);
}
`;
