import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../md-menu-surface/md-menu-surface.js';

import type { CloseMenuEvent } from '@material/web/menu/menu.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { labelConfirm, labelDeny, MAX_DATE, MIN_DATE } from '../constants.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { iconCalendar } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { renderActions } from '../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../render-helpers/render-actions/styles.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import { dockedDatePicker_calendarIconLabel, dockedDatePickerName } from './constants.js';
import { renderHeader } from './render-helpers/render-header/render-header.js';
import { renderHeaderStyle } from './render-helpers/render-header/styles.js';
import { dockedDatePicker_actionsStyle, dockedDatePicker_headerStyle } from './styles.js';
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
    renderActionsStyle,
    dockedDatePicker_actionsStyle,
    renderHeaderStyle,
    dockedDatePicker_headerStyle,
  ];

  /**
   * Dispatches the `input` and `change` events.
   */
  #dispatchInteractionEvents = () => {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  #hostRef: Ref<this> = createRef();

  #maxDate: Date;

  #minDate: Date;

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

    this.open = false;
  };

  #onClosing = () => {
    this.open = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.#textFieldRef.value as any).focused = false;
  };

  #onConfirm = () => {};

  #onDeny = () => {};

  // @query('md-outlined-text-field') private readonly textField!: MdOutlinedTextField | null;

  #onOpening = () => {
    this.open = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.#textFieldRef.value as any).focused = true;
  };

  #showMenuSurface = () => {
    if (this.open) {
      this.#onClosing();
    } else {
      this.#onOpening();
    }
  };

  #textFieldRef = createRef<MdOutlinedTextField>();

  #updateMinMax = (changedProperties: PropertyValueMap<this>) => {
    const { max, min } = this;

    if (changedProperties.has('max') && changedProperties.get('max') !== max) {
      this.#maxDate = toResolvedDate(max || MAX_DATE);
    }

    if (changedProperties.has('min') && changedProperties.get('min') !== min) {
      this.#minDate = toResolvedDate(min || MIN_DATE);
    }
  };

  @property() calendarIconLabel: string = dockedDatePicker_calendarIconLabel;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property() label = '';

  @property({ reflect: true, type: Boolean }) open: boolean = false;

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({ type: Boolean }) quick = false;

  constructor() {
    super();

    this.#maxDate = MAX_DATE;
    this.#minDate = MIN_DATE;
  }
  protected override render(): TemplateResult {
    const {
      calendarIconLabel,
      confirmText,
      denyText,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      label,
      locale,
      max,
      min,
      open,
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
    const v = value ?? '';
    const date = toResolvedDate(value);

    return html`
    <div ${ref(this.#hostRef)}>
      <md-outlined-text-field
        ${ref(this.#textFieldRef)}
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
      </md-outlined-text-field>

      <div class=menu>
        <md-menu-surface
          ?open=${open}
          ?quick=${quick}
          @close-menu=${this.#onCloseMenu}
          @closing=${this.#onClosing}
          @opening=${this.#onOpening}
          anchor=${anchorId}
          stay-open-on-focusout
        >
          ${renderHeader({
            date,
            locale,
            max: this.#maxDate,
            min: this.#minDate,
            nextMonthButtonLabel: 'next month',
            nextYearButtonLabel: 'next year',
            onMonthClick: () => { /** todo: */ },
            onYearClick: () => { /** todo: */ },
            prevMonthButtonLabel: 'previous month',
            prevYearButtonLabel: 'previous year',
          })}

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

          ${renderActions({
            confirmText,
            denyText,
            onConfirm: this.#onConfirm,
            onDeny: this.#onDeny,
          })}
        </md-menu-surface>
      </div>
    </div>
    `;
  }

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#updateMinMax(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}

// fixme: focus calendar when opened
