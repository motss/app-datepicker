import { html } from 'lit';

import type { RenderWeekDayInit } from './types';

export function renderWeekDay({ label, value }: RenderWeekDayInit) {
  return html`
  <th
    aria-label=${label}
    class=weekDay
    role=columnheader
  >
    <abbr title=${label}>${value}</abbr>
  </th>
  `;
}
