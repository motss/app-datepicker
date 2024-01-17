import { css } from 'lit';

export const calendar_tableStyle = css`
table {
  width: 100%;
  background-color: var(--ip-background-container);
  color: var(--ip-on-background-container);
}

th,
td {
  /* width: var(--app-calendar-cell-width, calc(100% / var(--_cols, 7))); */
  width: 40px;
  margin-top: 100%;

  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-size: var(--md-sys-typescale-body-large-size);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}

th::after,
td:after {
  content: '';
  position: relative;
  display: grid;
  padding-top: 100%;
}

th.weekday > p,
td.calendarDay[aria-label][title] > p {
  display: grid;
  place-content: center;
  place-items: center;

  position: absolute;
  inset: 0;
  margin: 0;
  padding: 8px;
}
`;

// :host {
//   --_border-width: 0px;
//   --_inset: 0px;
//   --_size: 32px;

//   display: block;
//   font-size: 13px;
// }

// table,
// thead,
// tbody,
// tr,
// th,
// td {
//   position: relative;
//   padding: 0;
// }

// .calendar-table,
// .calendar-day {
//   text-align: center;
// }

// .calendar-table {
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   user-select: none;

//   border-collapse: collapse;
//   border-spacing: 0;
// }

// .weekday {
//   max-height: 28px;
//   height: 28px;
// }

// .weekday-value {
//   max-height: 16px;
//   height: 16px;
//   color: var(--_on-weekday);
//   line-height: 1;
// }

// .calendar-day,
// .calendar-day:not(.week-number):not([aria-hidden="true"])::before,
// .calendar-day:not(.week-number):not([aria-hidden="true"])::after {
//   position: relative;
//   width: var(--_size);
//   height: var(--_size);
//   top: var(--_inset);
//   right: var(--_inset);
//   bottom: var(--_inset);
//   left: var(--_inset);
//   inset: var(--_inset);
//   border: var(--_border-width) solid var(--_border-color);
//   border-radius: 50%;
//   outline: none;
// }

// .calendar-day {
//   min-width: var(--_size);
//   min-height: var(--_size);
//   max-width: var(--_size);
//   max-height: var(--_size);
// }
// .calendar-day.week-number {
//   color: var(--_on-week-number);
// }
// .calendar-day[aria-disabled="true"] {
//   color: var(--_on-disabled);
// }
// @media (any-hover: hover) {
//   .calendar-day:not(.week-number):not([aria-hidden="true"]):not([aria-disabled="true"]):hover {
//     cursor: pointer;
//   }
// }

// .calendar-day:not(.week-number):not([aria-hidden="true"])::before,
// .calendar-day:not(.week-number):not([aria-hidden="true"])::after {
//   --_size: (var(--_size) - (var(--_inset) * 2) - (var(--_border-width) * 2));

//   content: attr(data-day);
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   position: absolute;
//   width: var(--_size);
//   height: var(--_size);
//   pointer-events: none;
// }

// .calendar-day::before {
//   z-index: 1;
// }
// .calendar-day:not([aria-disabled="true"]):focus-visible::before,
// .calendar-day:not([aria-disabled="true"]):hover::before {
//   --_border-color: var(--_focus);
//   --_border-width: 1px;
//   --_inset: 0px;

//   color: var(--_on-focus);
// }
// .calendar-day:not([aria-disabled="true"]):hover::before,
// .calendar-day.day--today:not([aria-selected="true"]):hover::before {
//   --_border-color: var(--_hover);

//   color: var(--_on-hover);
// }
// .calendar-day[aria-selected="true"]::before {
//   color: var(--_on-primary);
// }
// .calendar-day[aria-selected="true"]:focus-visible::before {
//   --_border-color: var(--_selected-focus);

//   color: var(--_selected-on-focus);
// }
// .calendar-day[aria-selected="true"]:hover::before {
//   --_border-color: var(--_selected-hover);

//   color: var(--_selected-on-hover);
// }
// .calendar-day.day--today:not([aria-selected="true"])::before {
//   --_border-color: var(--_today);
//   --_border-width: 1px;

//   color: var(--_on-today);
// }

// .calendar-day:not(.week-number):not([aria-hidden="true"])::after {
//   content: '';
// }
// .calendar-day:not([aria-disabled="true"]):focus-visible::after,
// .calendar-day:not([aria-disabled="true"]):hover::after {
//   --_inset: 3px;
// }
// .calendar-day[aria-selected="true"]::after {
//   background-color: var(--_primary);
// }
// `;
