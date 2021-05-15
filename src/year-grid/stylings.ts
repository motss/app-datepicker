import { css } from '@lit/reactive-element';

export const yearGridStyling = css`
.year-grid {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(4, minmax(1px, 56px));
  grid-template-rows: repeat(auto-fit, 32px);
  place-items: center;
}
`;
