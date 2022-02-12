import { css } from 'lit';

export const datePickerStyling = css`
:host {
  --_col: 7;
  --_row: 6;

  --_body-h: calc(4px + calc(32px * 7)); /** 228px */;
  --_h: calc(var(--_header-h) + var(--_body-h)); /** 52 + 228 = 280 */
  --_header-h: 52px;
  --_w: calc((16px * 2) + (32px * var(--_col))); /** 32 + 224 = 256 */

  display: flex;
  flex-direction: column;

  min-width: var(--date-picker-min-width, var(--_w));
  min-height: var(--date-picker-min-height, var(--_h));
  max-width: var(--date-picker-max-width, var(--_w));
  max-height: var(--date-picker-max-height, var(--_h));
  width: 100%;
  height: 100%;
  background-color: var(--_surface);
  color: var(--_on-surface);
  border-radius: var(--_shape);
  overscroll-behavior: contain;
}
:host([startview="calendar"][showweeknumber]) {
  --_col: 8;
}

.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;

  min-height: var(--_header-h);
  max-height: var(--_header-h);
  height: 100%;
  padding: 4px 0 0 24px;
  border-radius: var(--_shape);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

/** #region header */
.month-and-year-selector {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.selected-year-month {
  margin: 0;
  white-space: nowrap;
}

.year-dropdown {
  margin: 0 0 0 -8px;
  transition: transform 300ms cubic-bezier(0, 0, .4, 1);
  will-change: transform;
}
:host([startview="yearGrid"]) .year-dropdown {
  transform: rotateZ(180deg);
}

.month-pagination {
  display: flex;
  margin: 0 -4px 0 0;
}

.month-pagination > [data-navigation="previous"],
.month-pagination > [data-navigation="next"] {
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  width: 48px;
  height: 48px;
}
/** #endregion header */

.body {
  border-radius: var(--_shape);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.calendar,
.year-grid {
  min-height: var(--_body-h);
  max-height: var(--_body-h);
  height: 100%;
}

.calendar {
  padding: 0 16px 8px;
}

.year-grid {
  padding: 4px 20px 8px 12px;
  overflow: auto;
  overscroll-behavior: contain;
}
`;
