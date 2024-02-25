import '@material/web/button/text-button.js';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { RenderActionsInit } from './types.js';

export function renderActions({
  confirmText,
  denyText,
  formId,
  onConfirm,
  onDeny,
  slot,
}: RenderActionsInit) {
  const form = ifDefined(formId);

  return html`
  <div class=actions slot=${ifDefined(slot)}>
    <md-text-button class=denyText form=${form} value=deny @click=${onDeny}>${denyText}</md-text-button>
    <md-text-button class=confirmText form=${form} value=confirm @click=${onConfirm}>${confirmText}</md-text-button>
  </div>
  `;
}
