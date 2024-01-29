import '@material/web/button/text-button.js';

import { html } from 'lit';

import type { RenderActionsInit } from './types.js';

export function renderActions({
  confirmText,
  denyText,
  formId,
}: RenderActionsInit) {
  return html`
  <div class=actions slot=actions>
    <md-text-button class=denyText form=${formId} value=deny>${denyText}</md-text-button>
    <md-text-button class=confirmText form=${formId} value=confirm>${confirmText}</md-text-button>
  </div>
  `;
}
