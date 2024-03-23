import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';

import { styles as mdTypeScaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { html, svg, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../../../constants.js';
import { RootElement } from '../../../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../../../styles.js';
import {
  defaultSupportingText,
  modalDatePickerHeaderName,
} from './constants.js';
import { modalDatePickerHeaderStyles } from './styles.js';
import type { ModalDatePickerHeaderProperties } from './types.js';

@customElement(modalDatePickerHeaderName)
export class ModalDatePickerHeader
  extends RootElement
  implements ModalDatePickerHeaderProperties
{
  static override styles = [
    resetShadowRoot,
    baseStyling,
    mdTypeScaleStyles,
    modalDatePickerHeaderStyles,
  ];

  @state() headline = '';
  @state() iconButton: TemplateResult<2> = svg``;
  @state() onIconButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() supportingText: string = defaultSupportingText;

  override render() {
    const { headline, iconButton, supportingText } = this;

    const editIcon =
      /** fixme: this require new M3 TextField component to edit date */
      html`<md-icon-button class=iconButton hidden @click=${this.onIconButtonClick}>${iconButton}</md-icon-button>`;

    return html`
    <div class=header>
      <p class="supportingText md-typescale-label-large">${supportingText}</p>
      <p class="headline md-typescale-headline-large">${headline}</p>
      ${editIcon}
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerHeaderName]: ModalDatePickerHeader;
  }
}
