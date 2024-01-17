import { type CSSResultGroup, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { noop } from '../constants.js';
import { iconArrowDropdown, iconChevronLeft, iconChevronRight } from '../icons.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { datePickerBodyMenuName } from './constants.js';
import { bodyMenuStyle } from './styles.js';

@customElement(datePickerBodyMenuName)
export class DatePickerBodyMenu extends RootElement {
  static override styles: CSSResultGroup = [
    resetShadowRoot,
    bodyMenuStyle,
  ];

  @state() menuLabel: string = '';
  @state() menuText: string = '';
  @state() nextIconButtonLabel: string = '';
  @state() onMenuButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() onNextIconButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() onPrevIconButtonClick: (ev: MouseEvent) => unknown = noop;
  @state() prevIconButtonLabel: string = '';

  protected override render(): TemplateResult {
    const {
      menuLabel,
      menuText,
      nextIconButtonLabel,
      prevIconButtonLabel,
    } = this;

    return html`
    <div class=bodyMenu>
      <md-text-button class=menuButton trailing-icon @click=${this.onMenuButtonClick} aria-label=${menuLabel} title=${menuLabel}>
        ${menuText}
        <div slot=icon>${iconArrowDropdown}</div>
      </md-text-button>

      <md-icon-button class=prevIconButton @click=${this.onPrevIconButtonClick} aria-label=${prevIconButtonLabel} title=${prevIconButtonLabel}>${iconChevronLeft}</md-icon-button>
      <md-icon-button class=nextIconButton @click=${this.onNextIconButtonClick} aria-label=${nextIconButtonLabel} title=${nextIconButtonLabel}>${iconChevronRight}</md-icon-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerBodyMenuName]: DatePickerBodyMenu;
  }
}
