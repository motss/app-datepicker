import { css, unsafeCSS } from 'lit';

import { includeScrollbarStyle } from '../stylings.js';

export const datePickerCalendarStyle = css`
:host {
  --_size: 12px;

  display: grid;
  overflow: hidden;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  scrollbar-gutter: auto;
}

:host([startview="yearGrid"]) {
  overflow: hidden auto;
}

app-calendar {
  --_padding: var(--_size);
}

${unsafeCSS(includeScrollbarStyle(':host([startview="yearGrid"])'))}
`;
