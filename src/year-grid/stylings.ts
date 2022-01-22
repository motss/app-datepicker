import { css } from 'lit';

export const yearGridStyling = css`
.year-grid {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(4, minmax(56px, auto));
  grid-template-rows: repeat(auto-fit, 32px);
  align-items: center;
  justify-items: center;

  width: calc(56px * 4);
}

.year-grid > .year-grid-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 56px;
  height: 32px;
  color: var(--base-primary-color);
  font-size: 13px;
}
@media (any-hover: hover) {
  .year-grid > .year-grid-button:not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.year-grid > .year-grid-button:focus::before,
.year-grid > .year-grid-button:hover::before,
.year-grid > .year-grid-button.year--today:not([aria-selected="true"])::after {
  border-style: solid;
  border-width: 1px;
}

.year-grid > .year-grid-button::before {
  content: attr(aria-label);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 26px;
  border-radius: 50px;
  z-index: 1;
}
.year-grid > .year-grid-button[aria-selected="true"]::before {
  color: var(--base-selected-color);
}
.year-grid > .year-grid-button:focus::before {
  border-color: var(--base-focus-color);
}
.year-grid > .year-grid-button:hover::before {
  border-color: var(--base-hover-color);
}

.year-grid > .year-grid-button::after {
  content: '';
  position: absolute;
  width: 52px;
  height: 28px;
  border-radius: 52px;
}
.year-grid > .year-grid-button[aria-selected="true"]::after {
  background-color: var(--base-selected-bg-color);
}
.year-grid > .year-grid-button.year--today:not([aria-selected="true"])::after {
  border-color: var(--base-today-color);
}
.year-grid > .year-grid-button.year--today:not([aria-selected="true"]):focus::after,
.year-grid > .year-grid-button.year--today:not([aria-selected="true"]):hover::after {
  width: 48px;
  height: 24px;
}
`;
