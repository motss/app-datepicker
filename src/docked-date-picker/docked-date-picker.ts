import '@material/web/iconbutton/icon-button.js';
import '../docked-date-picker-text-field/docked-date-picker-text-field.js';
import '../docked-date-picker-menu-surface/docked-date-picker-menu-surface.js';

import type { CloseMenuEvent } from '@material/web/menu/internal/controllers/shared.js';
import { html, type TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { dockedDatePickerTextFieldName } from '../docked-date-picker-text-field/constants.js';
import type { DockedDatePickerTextField } from '../docked-date-picker-text-field/docked-date-picker-text-field.js';
import { iconCalendar } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { dockedDatePickerName } from './constants.js';
import type { DockedDatePickerProperties } from './types.js';

@customElement(dockedDatePickerName)
export class DockedDatePicker extends DatePickerMixin(DatePickerMinMaxMixin(ElementMixin(RootElement))) implements DockedDatePickerProperties {
  // close(returnValue: DockedDatePickerPropertiesReturnValue): Promise<void> {

  // }

  // show(): Promise<void> {

  // }

  // reset(): Promise<boolean> {

  // }

  // get returnValue(): ModalDatePickerProperties['returnValue'] {
  //   return (this.#dialogRef.value as MdDialog).returnValue;
  // }

  /**
   * Dispatches the `input` and `change` events.
   */
  #dispatchInteractionEvents = () => {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  #hostRef: Ref<this> = createRef();

  #onCloseMenu = (event: CloseMenuEvent) => {
    const reason = event.detail.reason;
    // const item = event.detail.itemPath[0] as SelectOption;
    const hasChanged = false;

    // if (reason.kind === 'click-selection') {
    //   hasChanged = this.selectItem(item);
    // } else if (reason.kind === 'keydown' && isSelectableKey(reason.key)) {
    //   hasChanged = this.selectItem(item);
    // } else {
    //   // This can happen on ESC being pressed
    //   item.tabIndex = -1;
    //   item.blur();
    // }

    console.debug('closemenu', reason);

    // Dispatch interaction events since selection has been made via keyboard
    // or mouse.
    if (hasChanged) {
      this.#dispatchInteractionEvents();
    }

    this.#open = false;
    this.requestUpdate();
  };

  #onClosing = () => {
    this.#open = false;
    this.requestUpdate();
  };

  #onOpening = () => {
    // todo:
  };

  #open: boolean = false;

  #showMenuSurface = () => {
    this.#open = true;
    this.requestUpdate();
  };

  @query(dockedDatePickerTextFieldName) private readonly textField!: DockedDatePickerTextField | null;

  @property() label = '';

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({ type: Boolean }) quick = false;

  protected override render(): TemplateResult {
    const {
      label,
      value,
    } = this;
    const v = ifDefined(value);

    // fixme: revisit
    const trailingIconLabel = 'Show calendar';

    console.debug(this.textField, this.#hostRef.value);

    return html`
    <div ${ref(this.#hostRef)}>
      <docked-date-picker-text-field
        label=${label}
        value=${v}
      >
        <md-icon-button
          slot="trailing-icon"
          @click=${this.#showMenuSurface}
          aria-label=${trailingIconLabel}
          title=${trailingIconLabel}
        >
          ${iconCalendar}
        </md-icon-button>
      </docked-date-picker-text-field>

      <docked-date-picker-menu-surface
        id=""
        listTabIndex="-1"
        type=""
        stay-open-on-focusout
        .anchor=${this.#hostRef.value}
        .open=${this.#open}
        .quick=${this.quick}
        .fixed=${false}
        @opening=${this.#onOpening}
        @closing=${this.#onClosing}
        @close-menu=${this.#onCloseMenu}
      >
        <div style="height:300px;background-color:#fff;">test</div>
      </docked-date-picker-menu-surface>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}
