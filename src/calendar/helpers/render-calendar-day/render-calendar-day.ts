import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { RenderCalendarDayInit } from './types';

export function renderCalendarDay({
  data,
  selectedDate,
  tabbableDate,
  todayDate,
}: RenderCalendarDayInit) {
  const {
    disabled,
    fullDate,
    label,
    value,
  } = data;

  if (fullDate) {
    const colTime = fullDate.getTime();

    const selected = colTime === selectedDate.getTime();
    const tabbable = tabbableDate.getTime() === colTime;
    const today = colTime === todayDate.getTime();

    return html`
    <td
      .fullDate=${fullDate}
      aria-disabled=${disabled ? 'true' : 'false'}
      aria-selected=${selected ? 'true' : 'false'}
      class=${classMap({ calendarDay: true, today })}
      data-day=${value}
      part=calendar-day
      role=gridcell
      tabindex=${tabbable ? 0 : -1}
      aria-current=${ifDefined(today ? 'date' : undefined)}
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
