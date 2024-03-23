import '@material/web/button/text-button.js';
import '../../components/md-svg/md-svg.js';

import { html, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { iconArrowDropdown } from '../../icons.js';
import type { RenderMenuButtonInit } from './types.js';

export function renderMenuButton<T extends string>({
  className,
  disabled,
  iconDirection,
  label,
  onClick,
  text,
  type,
}: RenderMenuButtonInit<T>): TemplateResult {
  const clsObject = className
    ? Object.fromEntries(
        className
          .trim()
          .split(' ')
          .map((cls) => [cls, true])
      )
    : undefined;
  const menuIcon = html`<md-svg height=18 width=18 .content=${iconArrowDropdown}></md-svg>`;

  return html`
  <md-text-button
    ?disabled=${disabled}
    @click=${onClick}
    aria-label=${label}
    class=${classMap({ menuButton: true, ...clsObject })}
    data-type=${ifDefined(type as string)}
    title=${label}
    trailing-icon
  >
    ${text}
    ${
      disabled
        ? nothing
        : html`<div class=icon style="--_state:${
            iconDirection === 'up' ? 180 : 0
          }deg;" slot=icon>${menuIcon}</div>`
    }
  </md-text-button>
  `;
}
