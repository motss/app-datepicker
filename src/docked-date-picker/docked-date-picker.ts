import '@material/web/iconbutton/icon-button.js';
import '../docked-date-picker-text-field/docked-date-picker-text-field.js';
import '../md-menu-surface/md-menu-surface.js';

import type { CloseMenuEvent } from '@material/web/menu/internal/controllers/shared.js';
import { html, type TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { dockedDatePickerTextFieldName } from '../docked-date-picker-text-field/constants.js';
import type { DockedDatePickerTextField } from '../docked-date-picker-text-field/docked-date-picker-text-field.js';
import { iconCalendar } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { dockedDatePicker_calendarIconLabel, dockedDatePickerName } from './constants.js';
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

  static override styles = [
    resetShadowRoot,
  ];

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

    this._open = false;
  };

  #onClosing = () => {
    this._open = false;
  };

  #onOpening = () => {
    // todo:
  };

  #showMenuSurface = () => {
    this._open = !this._open;
  };

  @state() _open: boolean = false;

  @query(dockedDatePickerTextFieldName) private readonly textField!: DockedDatePickerTextField | null;

  @property() calendarIconLabel: string = dockedDatePicker_calendarIconLabel;

  @property() label = '';

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({ type: Boolean }) quick = false;

  protected override render(): TemplateResult {
    const {
      _open,
      calendarIconLabel,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      label,
      locale,
      max,
      min,
      quick,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      toyearTemplate,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const anchorId = 'field_01HQDDHBZFASJH3XSA4GJC0TZA';
    const v = ifDefined(value);

    return html`
    <div ${ref(this.#hostRef)}>
      <docked-date-picker-text-field
        id=${anchorId}
        label=${label}
        value=${v}
      >
        <md-icon-button
          slot="trailing-icon"
          @click=${this.#showMenuSurface}
          aria-label=${calendarIconLabel}
          title=${calendarIconLabel}
        >
          ${iconCalendar}
        </md-icon-button>
      </docked-date-picker-text-field>

      <div class=menu>
        <md-menu-surface
          ?open=${_open}
          ?quick=${quick}
          @close-menu=${this.#onCloseMenu}
          @closing=${this.#onClosing}
          @opening=${this.#onOpening}
          anchor=${anchorId}
          stay-open-on-focusout
        >
          <date-picker-calendar
            disabledDates=${disabledDates}
            disabledDays=${disabledDays}
            firstDayOfWeek=${firstDayOfWeek}
            locale=${locale}
            max=${ifDefined(max)}
            min=${ifDefined(min)}
            selectedYearTemplate=${selectedYearTemplate}
            shortWeekLabel=${shortWeekLabel}
            startView=${this.startView}
            toyearTemplate=${toyearTemplate}
            weekLabel=${weekLabel}
            weekNumberTemplate=${weekNumberTemplate}
            weekNumberType=${weekNumberType}
            .onDateChange=${() => { /** todo: */ }}
            .onDateUpdate=${() => { /** todo: */ }}
            .onYearUpdate=${() => { /** todo: */ }}
            .value=${value}
            ?showWeekNumber=${showWeekNumber}
          ></date-picker-calendar>
        </md-menu-surface>
      </div>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}
