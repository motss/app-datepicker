import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';

import { html, svg, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../../../constants.js';
import { RootElement } from '../../../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../../../stylings.js';
import { defaultSupportingText, modalDatePickerHeaderName } from './constants.js';
import { modalDatePickerHeader_headerStyle, modalDatePickerHeader_headlineStyle, modalDatePickerHeader_iconButtonStyle, modalDatePickerHeader_supportingTextStyle } from './styles.js';
import type { ModalDatePickerHeaderProperties } from './types.js';

@customElement(modalDatePickerHeaderName)
export class ModalDatePickerHeader extends RootElement implements ModalDatePickerHeaderProperties {
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerHeader_headerStyle,
    modalDatePickerHeader_headlineStyle,
    modalDatePickerHeader_iconButtonStyle,
    modalDatePickerHeader_supportingTextStyle,
  ];

  @state() headline: string = '';
  @state() iconButton: TemplateResult<2> = svg``;
  @state() onIconButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() supportingText: string = defaultSupportingText;

  override render() {
    const {
      headline,
      iconButton,
      supportingText,
    } = this;

    const editIcon =
      /** fixme: this require new M3 TextField component to edit date */
      html`<md-icon-button class=iconButton hidden @click=${this.onIconButtonClick}>${iconButton}</md-icon-button>`;

    return html`
    <div class=header>
      <p class=supportingText>${supportingText}</p>
      <p class=headline>${headline}</p>
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
