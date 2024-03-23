import { css } from 'lit';

import { mdSysTypescaleBodyLarge } from '../../../typography.js';

export const calendarStyles = css`
:host {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  font-size: ${mdSysTypescaleBodyLarge.size};
  font-weight: ${mdSysTypescaleBodyLarge.weight};
  line-height: ${mdSysTypescaleBodyLarge.lineHeight};
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

  --md-filled-button-label-text-line-height: ${mdSysTypescaleBodyLarge.lineHeight};
  --md-filled-button-label-text-size: ${mdSysTypescaleBodyLarge.size};
  --md-filled-button-label-text-weight: ${mdSysTypescaleBodyLarge.weight};

  --md-outlined-button-disabled-outline-opacity: 0;
  --md-outlined-button-outline-color: var(--_cdb-oc);
  --md-outlined-button-label-text-color: var(--_cdb-lc);
  --md-outlined-button-label-text-line-height: ${mdSysTypescaleBodyLarge.lineHeight};
  --md-outlined-button-label-text-size: ${mdSysTypescaleBodyLarge.size};
  --md-outlined-button-label-text-weight: ${mdSysTypescaleBodyLarge.weight};

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
