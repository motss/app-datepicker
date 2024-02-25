import { type CSSResultGroup, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { iconChevronLeft, iconChevronRight } from '../icons.js';
import { renderMenuButton } from '../render-helpers/render-menu-button/render-menu-button.js';
import { renderMenuButtonStyle } from '../render-helpers/render-menu-button/styles.js';
import type { RenderMenuButtonInit } from '../render-helpers/render-menu-button/types.js';
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
    renderMenuButtonStyle,
    modalDatePickerBodyMenu_bodyMenuStyle,
    modalDatePickerBodyMenu_buttonsStyle,
  ];

  #onMenuClick = (ev: MouseEvent) => {
    this.#state = this.#state === 'down' ? 'up' : 'down';
    this.requestUpdate();
    this.onMenuClick?.(ev);
  };

  #state: RenderMenuButtonInit['iconDirection'] = 'down';

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

    return html`
    <div class=bodyMenu>
      ${renderMenuButton({ iconDirection: this.#state, label: menuLabel, onClick: this.#onMenuClick, text: menuText })}

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
