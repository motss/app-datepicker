import { css } from 'lit';

export const monthCalendarStyling = css`
.calendar-table,
.calendar-day {
  text-align: center;
}

.calendar-table {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  border-collapse: collapse;
  border-spacing: 0;
}

.calendar-day,
.calendar-day-value,
.weekday-value {
  position: relative;
  font-size: 13px;
}

th,
td {
  padding: 0;
}

.weekday {
  max-height: 28px;
  height: 28px;
}

.weekday-value {
  max-height: 16px;
  height: 16px;
  color: var(--date-picker-weekday-color, var(--base-weekday-color));
  line-height: 1;
}

.calendar-day::after,
.calendar-day-value {
  top: calc((32px - 28px) / 2);
  right: 0;
  bottom: 0;
  left: calc((32px - 28px) / 2);
  width: 28px;
  height: 28px;
}

.calendar-day {
  width: 32px;
  height: 32px;
  color: var(--year-grid-color, var(--base-primary-color));
  font-size: 14px;
}
@media (any-hover: hover) {
  .calendar-day:not([aria-hidden="true"]):not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}
.calendar-day[aria-selected="true"] {
  color: var(--date-picker-calendar-day-color, var(--base-selected-color));
}
.calendar-day::after {
  content: '';
  display: block;
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
}
.calendar-day[aria-selected="true"]::after {
  background-color: var(--date-picker-selected-background-color, var(--base-selected-background-color));
  opacity: 1;
}
.calendar-day.day--today::after,
.calendar-day:hover::after,
.calendar-day:focus::after {
  opacity: 1;
  border-style: solid;
  border-width: 1px;
}
.calendar-day.day--today::after {
  border-color: var(--date-picker-today-color, var(--base-selected-background-color));
}
.calendar-day:focus::after {
  border-color: var(--date-picker-focus-color, var(--base-focus-color));
}
.calendar-day:hover::after {
  border-color: var(--date-picker-hover-color, var(--base-hover-color));
}
.calendar-day[aria-disabled="true"],
.calendar-day.day--empty {
  background-color: none;
  outline: none;
  opacity: 0;
}

.calendar-day > .calendar-day-value {
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  color: currentColor;
  z-index: 1;
}
`;
