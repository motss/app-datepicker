import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { RenderWeekNumberInit } from './types';

export function renderWeekNumber({
  label,
  value,
}: RenderWeekNumberInit) {
  const maybeLabel = label || undefined;

  return html`
  <th
    aria-disabled=true
    class=cell
    part=week-number
    role=rowheader
    scope=row
  >
    <abbr title=${ifDefined(maybeLabel)}
    >${value}</abbr>
  </th>
  `;
}
