import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { RenderWeekLabelInit } from './types';

export function renderWeekLabel({
  label,
  value,
}: RenderWeekLabelInit) {
  const maybeLabel = label || undefined;

  return html`
  <th
    abbr=${ifDefined(maybeLabel)}
    aria-disabled=true
    class=cell
    part=week-label
    role=rowheader
    scope=row
  >
    <abbr title=${ifDefined(maybeLabel)}>${value}</abbr>
  </th>
  `;
}
