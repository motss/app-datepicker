import { css } from 'lit';

export const datePickerStyling = css`
.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;

  margin: 0 8px 0 24px;
}

/** #region header */
.month-and-year-selector {
  display: flex;
  align-items: center;
}

.selected-year,
.month-dropdown {
  margin: 0 0 0 4px;
}

.month-pagination {
  display: flex;
}

[data-navigation="next"] {
  margin: 0 0 0 24px;
}
/** #endregion header */
`;
