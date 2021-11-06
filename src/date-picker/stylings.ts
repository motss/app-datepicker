import { css } from 'lit';

export const datePickerStyling = css`
:host {
  --date-picker-header-base-height: 52px;
  --date-picker-year-grid-base-height: calc(4px + (32px * 7));
  --date-picker-base-width: calc((16px * 2) + (32px * 7));
  --date-picker-base-height: calc(32px + 36px + 12px + (32px * 6) + 8px);

  --date-picker-with-week-number-width: calc(var(--date-picker-base-width) + 32px);
  --date-picker-in-year-grid-height: calc(var(--date-picker-base-height) + var(--date-picker-year-grid-base-height));

  --date-picker-width: var(--date-picker-base-width);
  --date-picker-height: var(--date-picker-base-height);

  display: flex;
  flex-direction: column;

  position: relative;
  min-width: var(--date-picker-width);
  max-width: var(--date-picker-width);
  min-height: var(--date-picker-height);
  max-height: var(--date-picker-height);
  width: 100%;
  height: 100%;
  overscroll-behavior: contain;
}
:host([startview="calendar"][show-week-number]) {
  --date-picker-width: var(--date-picker-with-week-number-width);
}
:host(startview="yearGrid") {
  --date-picker-height: var(----date-picker-in-year-grid-height);
}

.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;

  max-height: var(--date-picker-base-height);
  height: 100%;
  margin: 4px 0 0;
  padding: 0 0 0 24px;
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
  max-height: var(--date-picker-year-grid-base-height);
  height: 100%;
  padding: 4px 20px 8px 12px;
  overflow: auto;
  scrollbar-width: thin;
}

.calendar {
  padding: 0 16px 8px;
}
`;
