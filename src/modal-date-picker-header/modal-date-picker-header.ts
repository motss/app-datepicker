import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';

import { html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../constants.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { modalDatePickerHeaderName, defaultSupportingText } from './constants.js';
import { modalDatePickerHeader_headerStyle, modalDatePickerHeader_headlineStyle, modalDatePickerHeader_iconButtonStyle, modalDatePickerHeader_supportingTextStyle } from './styles.js';

@customElement(modalDatePickerHeaderName)
export class ModalDatePickerHeader extends RootElement {
  static override styles = [
    resetShadowRoot,
    modalDatePickerHeader_headerStyle,
    modalDatePickerHeader_headlineStyle,
    modalDatePickerHeader_iconButtonStyle,
    modalDatePickerHeader_supportingTextStyle,
  ];

  @state() headline: string = '';
  @state() iconButton: TemplateResult | string = '';
  @state() onIconButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() supportingText: string = defaultSupportingText;

  override render() {
    const {
      headline,
      iconButton,
      supportingText,
    } = this;

    return html`
    <div class=header>
      <p class=supportingText>${supportingText}</p>
      <p class=headline>${headline}</p>
      <md-icon-button class=iconButton @click=${this.onIconButtonClick}>${iconButton}</md-icon-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerHeaderName]: ModalDatePickerHeader;
  }
}