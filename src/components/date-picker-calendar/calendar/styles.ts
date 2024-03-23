import { css } from 'lit';

export const calendarStyles = css`
:host {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}

.calendar col {
  width: var(--_day-size);
}

.calendar :is(td, th):after {
  content: '';
  display: grid;
  position: relative;
  padding-top: 100%;
}

.calendarDay > .calendarDayButton,
.weekDay > abbr {
  display: grid;
  place-content: center;
  place-items: center;

  position: absolute;
  inset: 0;
  margin: 0;
  padding: 8px;
  z-index: 1;
}

.calendarDayButton {
  --_cdb-oc: rgba(0 0 0 / 0);
  --_cdb-lc: var(--md-sys-color-on-surface);

  --md-outlined-button-outline-color: var(--_cdb-oc);
  --md-outlined-button-label-text-color: var(--_cdb-lc);
  --md-outlined-button-label-text-line-height: var(--md-sys-typescale-body-large-line-height);
  --md-outlined-button-label-text-size: var(--md-sys-typescale-body-large-size);
  --md-outlined-button-label-text-weight: var(--md-sys-typescale-body-large-weight);

  padding: 0;
}

.calendarDayButton.today {
  --_cdb-oc: var(--md-sys-color-primary);
  --_cdb-lc: var(--md-sys-color-primary);
}

abbr {
  text-decoration: none;
}
`;
