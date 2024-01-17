import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';

import { html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../constants.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { datePickerHeaderName, defaultSupportingText } from './constants.js';
import { datePickerHeader_headerStyle, datePickerHeader_headlineStyle, datePickerHeader_iconButtonStyle, datePickerHeader_supportingTextStyle } from './styles.js';

@customElement(datePickerHeaderName)
export class DatePickerHeader extends RootElement {
  static override styles = [
    resetShadowRoot,
    datePickerHeader_headerStyle,
    datePickerHeader_headlineStyle,
    datePickerHeader_iconButtonStyle,
    datePickerHeader_supportingTextStyle,
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
    [datePickerHeaderName]: DatePickerHeader;
  }
}
