import { css } from 'lit';

export const yearGridStyling = css`
:host {
  --_border-width: 0px;
  --_col: 56px;
  --_inset: 2px;
  --_row: 32px;
  --_col-n: 4;

  display: block;
  font-size: 13px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(var(--_col-n), minmax(var(--_col), auto));
  grid-template-rows: repeat(auto-fit, var(--_row));
  align-items: center;
  justify-items: center;

  width: calc(var(--_col) * var(--_col-n));
}
@supports (scrollbar-width: thin) {
  .year-grid {
    scrollbar-width: thin;
  }
}

.year-grid-button,
.year-grid-button::before,
.year-grid-button::after {
  --_offset: calc(var(--_inset) * 2) + (var(--_border-width) * 2);

  --_col2: calc(var(--_col) - (var(--_offset)));
  --_row2: calc(var(--_row) - (var(--_offset)));

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  top: var(--_inset);
  right: var(--_inset);
  bottom: var(--_inset);
  left: var(--_inset);
  inset: var(--_inset);
  width: var(--_col2);
  height: var(--_row2);
  border: var(--_border-width) solid var(--_border-color);
  border-radius: 50px;
  outline: none;
}

.year-grid-button {
  min-width: var(--_col);
  min-height: var(--_row);
  max-width: var(--_col);
  max-height: var(--_row);
}
@media (any-hover: hover) {
  .year-grid-button:not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.year-grid-button::before,
.year-grid-button::after {
  content: attr(aria-label);

  position: absolute;
  pointer-events: none;
}

.year-grid-button::before {
  z-index: 1;
}
.year-grid-button:focus::before,
.year-grid-button:hover::before {
  --_border-color: var(--_focus);
  --_border-width: 1px;
  --_inset: 0px;

  color: var(--_on-focus);
}
.year-grid-button:hover::before,
.year-grid-button.year--today:not([aria-selected="true"]):hover::before {
  --_border-color: var(--_hover);

  color: var(--_on-hover);
}
.year-grid-button[aria-selected="true"]::before {
  color: var(--_on-primary);
}
.year-grid-button[aria-selected="true"]:focus::before {
  --_border-color: var(--_selected-focus);

  color: var(--_selected-on-focus);
}
.year-grid-button[aria-selected="true"]:hover::before {
  --_border-color: var(--_selected-hover);

  color: var(--_selected-on-hover);
}
.year-grid-button.year--today:not([aria-selected="true"])::before {
  --_border-color: var(--_today);
  --_border-width: 1px;

  color: var(--_on-today);
}

.year-grid-button::after {
  content: '';
}
.year-grid-button:focus::after,
.year-grid-button:hover::after {
  --_inset: 3px;
}
.year-grid-button[aria-selected="true"]::after {
  background-color: var(--_primary);
}
`;
