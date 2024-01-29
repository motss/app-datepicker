import { css, unsafeCSS } from 'lit';

import { includeScrollbarStyle } from '../stylings.js';

export const modalDatePickerBody_datePickerBodyStyle = css`
:host {
  --_side: 12px;
}

.datePickerBody {
  display: grid;
  grid-template-areas: 'menu' 'body';
  grid-template-rows: calc(4px + 4px + 40px + 4px + 4px) minmax(auto, calc(48px * 7));
}

.menu,
.body:not(.yearGrid) {
  --_padding: var(--_side);
}

.menu {
  grid-area: menu;
}

.body {
  grid-area: body;

  display: grid;
  overflow: hidden;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.body:not(.yearGrid) {
  scrollbar-gutter: auto;
}

.yearGrid {
  overflow: hidden auto;
}

${unsafeCSS(includeScrollbarStyle('.body'))}
`;
