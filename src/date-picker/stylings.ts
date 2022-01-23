import { css } from 'lit';

export const datePickerStyling = css`
:host {
  --base-width: calc((16px * 2) + (32px * 7));
  --base-height: calc(32px + 36px + 12px + (32px * 6) + 8px);
  --base-year-grid-height: calc(4px + (32px * 7));

  --date-picker-width: var(--base-width);
  --date-picker-height: var(--base-height);

  display: flex;
  flex-direction: column;

  position: relative;
  min-width: var(--date-picker-width);
  max-width: var(--date-picker-width);
  min-height: var(--date-picker-height);
  max-height: var(--date-picker-height);
  width: 100%;
  height: 100%;
  background-color: var(--base-primary);
  color: var(--base-on-primary);
  overscroll-behavior: contain;
}
:host([startview="calendar"][show-week-number]) {
  --date-picker-width: calc(var(--base-width) + 32px);
}
:host(startview="yearGrid") {
  --date-picker-height: calc(var(--base-height) + var(--base-year-grid-height));
}

.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;

  max-height: var(--base-height);
  height: 100%;
  padding: 4px 0 0 24px;
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
  max-width: 48px;
  max-height: 48px;
  min-width: 48px;
  min-height: 48px;
}
/** #endregion header */

.year-grid {
  max-height: var(--base-year-grid-height);
  height: 100%;
  padding: 4px 20px 8px 12px;
  overflow: auto;
  overscroll-behavior: contain;
}

.calendar {
  padding: 0 16px 8px;
}
`;
