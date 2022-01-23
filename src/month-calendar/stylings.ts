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
  color: var(--base-on-weekday);
  line-height: 1;
}

.calendar-day {
  width: 32px;
  height: 32px;
  color: var(--base-on-primary);
}
@media (any-hover: hover) {
  .calendar-day:not([aria-hidden="true"]):not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.calendar-day:not([aria-hidden="true"])::before,
.calendar-day:not([aria-hidden="true"])::after {
  content: attr(data-day);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: calc((32px - 28px) / 2);
  left: calc((32px - 28px) / 2);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  pointer-events: none;
}
.calendar-day.day--today:not([aria-disabled="true"]):not([aria-selected="true"])::before,
.calendar-day:not([aria-disabled="true"]):hover::after,
.calendar-day:not([aria-disabled="true"]):focus::after {
  width: 26px;
  height: 26px;
  border-style: solid;
  border-width: 1px;
}

.calendar-day::before {
  z-index: 1;
}
.calendar-day[aria-selected="true"]::before {
  color: var(--base-on-selected);
}
.calendar-day.day--today:not([aria-selected="true"])::before {
  border-color: var(--base-today);
}
.calendar-day.day--today:not([aria-selected="true"]):focus::before,
.calendar-day.day--today:not([aria-selected="true"]):hover::before {
  top: calc((32px - 26px) / 2);
  left: calc((32px - 26px) / 2);
  width: 24px;
  height: 24px;
}

.calendar-day:not([aria-hidden="true"])::after {
  content: '';
}
.calendar-day[aria-selected="true"]::after {
  background-color: var(--base-selected);
}
.calendar-day:focus::after {
  border-color: var(--base-focus);
}
.calendar-day:hover::after {
  border-color: var(--base-hover);
}
.calendar-day[aria-disabled="true"] {
  color: var(--base-on-disabled);
}
`;
