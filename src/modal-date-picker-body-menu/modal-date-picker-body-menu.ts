import { type CSSResultGroup, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { iconArrowDropdown, iconChevronLeft, iconChevronRight } from '../icons.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import { modalDatePickerBodyMenuName } from './constants.js';
import { modalDatePickerBodyMenu_bodyMenuStyle, modalDatePickerBodyMenu_buttonsStyle } from './styles.js';
import type { ModalDatePickerBodyMenuProperties } from './types.js';

@customElement(modalDatePickerBodyMenuName)
export class ModalDatePickerBodyMenu extends RootElement implements ModalDatePickerBodyMenuProperties {
  static override styles: CSSResultGroup = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerBodyMenu_bodyMenuStyle,
    modalDatePickerBodyMenu_buttonsStyle,
  ];

  #onMenuClick = (ev: MouseEvent) => {
    this.#state = this.#state === 'down' ? 'up' : 'down';
    this.requestUpdate();
    this.onMenuClick?.(ev);
  };

  #state: string = 'down';

  @property() menuLabel: string = '';
  @property() menuText: string = '';
  @property() nextIconButtonLabel: string = '';
  @state() onMenuClick?: ModalDatePickerBodyMenuProperties['onMenuClick'];
  @state() onNextClick?: ModalDatePickerBodyMenuProperties['onNextClick'];
  @state() onPrevClick?: ModalDatePickerBodyMenuProperties['onPrevClick'];
  @property() prevIconButtonLabel: string = '';
  @property({ type: Boolean }) showNextButton: boolean = false;
  @property({ type: Boolean }) showPrevButton: boolean = false;

  protected override render(): TemplateResult {
    const {
      menuLabel,
      menuText,
      nextIconButtonLabel,
      onNextClick,
      onPrevClick,
      prevIconButtonLabel,
      showNextButton,
      showPrevButton,
    } = this;
    const iconState = this.#state === 'down' ? 0 : 180;

    return html`
    <div class=bodyMenu>
      <md-text-button class=menuButton trailing-icon @click=${this.#onMenuClick} aria-label=${menuLabel} title=${menuLabel}>
        ${menuText}
        <div class=icon style="--_state:${iconState}deg;" slot=icon>${iconArrowDropdown}</div>
      </md-text-button>

      ${showPrevButton ? html`<md-icon-button class=prevIconButton @click=${onPrevClick} aria-label=${prevIconButtonLabel} title=${prevIconButtonLabel}>${iconChevronLeft}</md-icon-button>` : nothing}
      ${showNextButton ? html`<md-icon-button class=nextIconButton @click=${onNextClick} aria-label=${nextIconButtonLabel} title=${nextIconButtonLabel}>${iconChevronRight}</md-icon-button>` : nothing}
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerBodyMenuName]: ModalDatePickerBodyMenu;
  }
}
