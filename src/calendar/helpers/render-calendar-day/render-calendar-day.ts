import { html } from 'lit';

import type { RenderCalendarDayInit } from './types';

export function renderCalendarDay({
  data,
  selected,
}: RenderCalendarDayInit) {
  const {
    disabled,
    fullDate,
    label,
    value,
  } = data;

  if (fullDate) {
    return html`
    <td
      .fullDate=${fullDate}
      aria-disabled=${disabled ? 'true' : 'false'}
      aria-selected=${selected ? 'true' : 'false'}
      class=calendarDay
      data-day=${value}
      part=calendar-day
      role=gridcell
      tabindex=-1
    >
      <abbr title=${label}>${value}</abbr>
    </td>
    `;
  }

  return html`<td
    class=calendarDay
    part=calendar-day
    aria-disabled=true
    aria-hidden=true
    aria-selected=false
    role=gridcell
    tabindex=-1
  ></td>`;
}
