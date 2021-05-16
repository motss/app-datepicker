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
  font-size: 14px;
}

th,
td {
  padding: 0;
}

.weekday-value {
  padding: 0 0 9px;
  color: #8c8c8c;
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
  height: 0;
  padding-top: 32px;
  outline: none;
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
.calendar-day[aria-selected="true"] {
  color: #fff;
}
.calendar-day[aria-selected="true"]::after {
  background-color: #1d1d1d;
  opacity: 1;
}
.calendar-day:hover::after,
.calendar-day:focus::after {
  outline: 1px solid #1d1d1d;
  opacity: 1;
}
.calendar-day[aria-disabled="true"],
.calendar-day.day--empty {
  background-color: none;
  outline: none;
  opacity: 0;
}

.calendar-day-value {
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  color: currentColor;
  z-index: 1;
}
`;
