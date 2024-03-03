import '@material/web/button/text-button.js';
import '../../md-svg/md-svg.js';

import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { iconArrowDropdown } from '../../icons.js';
import type { RenderMenuButtonInit } from './types.js';

export function renderMenuButton<T extends string>({
  className,
  iconDirection,
  label,
  onClick,
  text,
  type,
}: RenderMenuButtonInit<T>): TemplateResult {
  const clsObject = className ? Object.fromEntries(className.trim().split(' ').map((cls) => [cls, true])) : undefined;
  const menuIcon = html`<md-svg height=18 width=18 .content=${iconArrowDropdown}></md-svg>`;

  return html`
  <md-text-button class=${classMap({ menuButton: true, ...clsObject })} data-type=${ifDefined(type as string)} trailing-icon @click=${onClick} aria-label=${label} title=${label}>
    ${text}
    <div class=icon style="--_state:${iconDirection === 'up' ? 180 : 0}deg;" slot=icon>${menuIcon}</div>
  </md-text-button>
  `;
}
