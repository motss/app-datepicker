import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { RenderYearGridButtonInit } from './types.js';

export function renderYearGridButton({
  label,
  selected,
  tabIndex,
  toyear,
  year,
}: RenderYearGridButtonInit) {
  const maybeLabel = label || undefined;

  return selected
    ? html`
  <md-filled-button
    aria-label=${ifDefined(maybeLabel)}
    aria-pressed=${selected ? 'true' : 'false'}
    class=${classMap({ toyear, yearGridButton: true })}
    data-year=${year}
    part=${`year-grid-button${toyear ? ' toyear' : ''}`}
    tabindex=${tabIndex}
    title=${ifDefined(maybeLabel)}
    type=button
  >${year}</md-filled-button>
  `
    : html`
  <md-outlined-button
    aria-label=${ifDefined(maybeLabel)}
    aria-pressed=${selected ? 'true' : 'false'}
    class=${classMap({ toyear, yearGridButton: true })}
    data-year=${year}
    part=${`year-grid-button${toyear ? ' toyear' : ''}`}
    tabindex=${tabIndex}
    title=${ifDefined(maybeLabel)}
    type=button
  >${year}</md-outlined-button>
  `;
}
