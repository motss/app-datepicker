import '@material/web/button/text-button.js';

import { type CSSResultGroup, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../constants.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { modalDatePickerFooterName, defaultConfirmText, defaultDenyText } from './constants.js';
import { modalDatePickerFooter_confirmTextStyle, modalDatePickerFooter_denyTextStyle, modalDatePickerFooter_textButtonsStyle } from './styles.js';

@customElement(modalDatePickerFooterName)
export class ModalDatePickerFooter extends RootElement {
  static override styles: CSSResultGroup = [
    resetShadowRoot,
    modalDatePickerFooter_confirmTextStyle,
    modalDatePickerFooter_denyTextStyle,
    modalDatePickerFooter_textButtonsStyle,
  ];

  @state() confirmText: string = defaultConfirmText;
  @state() denyText: string = defaultDenyText;
  @state() onConfirmClick: (ev: MouseEvent) => unknown = noop;
  @state() onDenyClick: (ev: MouseEvent) => unknown = noop;

  protected override render(): TemplateResult {
    const {
      confirmText,
      denyText,
    } = this;

    return html`
    <div class=textButtons>
      <md-text-button class=denyText @click=${this.onDenyClick}>${denyText}</md-text-button>
      <md-text-button class=confirmText @click=${this.onConfirmClick}>${confirmText}</md-text-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerFooterName]: ModalDatePickerFooter;
  }
}
