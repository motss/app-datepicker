import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

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
  const { disabled, fullDate, label, value } = data;

  if (fullDate) {
    const colTime = fullDate.getTime();
    const fullDateText = fullDate.toJSON();

    const selected = colTime === selectedDate.getTime();
    const tabbable = tabbableDate.getTime() === colTime;
    const today = colTime === todayDate.getTime();

    const ariaCurrent = today ? 'date' : undefined;
    const ariaSelected = selected ? 'true' : 'false';
    const tabindex = tabbable ? 0 : -1;

    const content = html`<abbr title=${label}>${value}</abbr>`;
    const button = selected
      ? html`
      <md-filled-button
        ?disabled=${disabled}
        aria-current=${ifDefined(ariaCurrent)}
        aria-label=${label}
        aria-pressed=${ariaSelected}
        class=${classMap({ calendarDayButton: true, today })}
        data-day=${value}
        data-fulldate=${fullDateText}
        part=calendar-day-button
        tabindex=${tabindex}
        title=${label}
        type=button
      >${content}</md-filled-button>
      `
      : html`
      <md-outlined-button
        ?disabled=${disabled}
        .fullDate=${fullDate}
        aria-current=${ifDefined(ariaCurrent)}
        aria-label=${label}
        aria-pressed=${ariaSelected}
        class=${classMap({ calendarDayButton: true, today })}
        data-day=${value}
        data-fulldate=${fullDateText}
        part=calendar-day-button
        tabindex=${tabindex}
        title=${label}
        type=button
      >${content}</md-outlined-button>
      `;

    return html`
    <td
      class=calendarDay
      data-day=${value}
      data-fulldate=${fullDateText}
      part=calendar-day
      role=gridcell
    >
      ${button}
    </td>
    `;
  }

  return html`<td
    class=calendarDay--none
    part="calendar-day-none"
    aria-disabled=true
    aria-hidden=true
    aria-selected=false
    role=gridcell
  ></td>`;
}
