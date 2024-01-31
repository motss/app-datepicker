import '@material/web/dialog/dialog.js';
import '../modal-date-picker-body/modal-date-picker-body.js';
import '../modal-date-picker-header/modal-date-picker-header.js';

import type { MdDialog } from '@material/web/dialog/dialog.js';
import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { labelConfirm, labelDeny } from '../constants.js';
import { iconEdit } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { ModalDatePickerBody } from '../modal-date-picker-body/modal-date-picker-body.js';
import type { ModalDatePickerBodyProperties } from '../modal-date-picker-body/types.js';
import type { ModalDatePickerHeaderProperties } from '../modal-date-picker-header/types.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import { modalDatePickerName } from './constants.js';
import { renderActions } from './helpers/render-actions/render-actions.js';
import { modalDatePicker_actionsStyle, modalDatePicker_dialogStyle, modalDatePicker_formStyle } from './styles.js';
import type { ModalDatePickerProperties, ModalDatePickerPropertiesReturnValue } from './types.js';

@customElement(modalDatePickerName)
export class ModalDatePicker extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements ModalDatePickerProperties {
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePicker_dialogStyle,
    modalDatePicker_formStyle,
    modalDatePicker_actionsStyle,
  ];

  #bodyRef: Ref<ModalDatePickerBody> = createRef();
  #dialogRef: Ref<MdDialog> = createRef();

  #didDateUpdate: boolean = false;

  #onDateUpdate: ModalDatePickerBodyProperties['onDateUpdate'] = (updatedDate) => {
    this.#selectedDate = updatedDate;
    this.#didDateUpdate = true;
  };

  #onDialogClosed = (ev: CustomEvent<object>) => {
    this.#propagateCustomEvent(ev);

    const updatedDate = this.#selectedDate;

    if (this.#didDateUpdate && updatedDate && this.#dialogRef.value?.returnValue === 'confirm') {
      // todo: add custom formatter
      this.value = updatedDate.toJSON();
      this.#selectedDate = undefined;
      this.onDateUpdate?.(updatedDate);
    }
  };

  #onIconButtonClick: ModalDatePickerHeaderProperties['onIconButtonClick'] = () => {
    /** fixme: this require new M3 TextField component to edit date */
  };

  #propagateCustomEvent = (ev: CustomEvent<object>) => {
    this.fire({ detail: ev.detail, type: ev.type });
  };

  #selectedDate?: Date;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @state() onDateUpdate?: ModalDatePickerProperties['onDateUpdate'];

  @property({ type: Boolean }) open: ModalDatePickerProperties['open'];

  @property() type?: MdDialog['type'];

  close(returnValue: ModalDatePickerPropertiesReturnValue) {
    return (this.#dialogRef.value as MdDialog).close(returnValue);
  }

  protected override render(): TemplateResult {
    // fixme: move logics from body to here!
    const {
      chooseMonthLabel,
      chooseYearLabel,
      confirmText,
      denyText,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      id,
      locale,
      max,
      min,
      nextMonthLabel,
      open,
      previousMonthLabel,
      selectDateLabel,
      selectedDateLabel,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayLabel,
      toyearTemplate,
      type,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const formId = id || 'modalDatePicker';
    const headline = 'Thu, Jan 25'; // fixme: replace with focused date text
    const iconButton = iconEdit;
    const supportingText = selectDateLabel;

    return html`
    <md-dialog
      ${ref(this.#dialogRef)}
      class=dialog
      ?open=${open}
      @cancel=${this.#propagateCustomEvent}
      @close=${this.#propagateCustomEvent}
      @closed=${this.#onDialogClosed}
      @open=${this.#propagateCustomEvent}
      @opened=${this.#propagateCustomEvent}
      type=${ifDefined(type)}
    >
      <form method=dialog slot=content id=${formId}>
        <modal-date-picker-header
          .headline=${headline}
          .iconButton=${iconButton}
          .onIconButtonClick=${this.#onIconButtonClick}
          .supportingText=${supportingText}
        ></modal-date-picker-header>

        <modal-date-picker-body
          ${ref(this.#bodyRef)}
          .chooseMonthLabel=${chooseMonthLabel}
          .chooseYearLabel=${chooseYearLabel}
          .disabledDates=${disabledDates}
          .disabledDays=${disabledDays}
          .firstDayOfWeek=${firstDayOfWeek}
          .locale=${locale}
          .max=${max}
          .min=${min}
          .nextMonthLabel=${nextMonthLabel}
          .previousMonthLabel=${previousMonthLabel}
          .selectDateLabel=${selectDateLabel}
          .selectedDateLabel=${selectedDateLabel}
          .selectedYearTemplate=${selectedYearTemplate}
          .shortWeekLabel=${shortWeekLabel}
          .showWeekNumber=${showWeekNumber}
          .startView=${startView}
          .todayLabel=${todayLabel}
          .toyearTemplate=${toyearTemplate}
          .value=${value}
          .weekLabel=${weekLabel}
          .weekNumberTemplate=${weekNumberTemplate}
          .weekNumberType=${weekNumberType}
          .onDateUpdate=${this.#onDateUpdate}
        ></modal-date-picker-body>
      </form>

      ${renderActions({ confirmText, denyText, formId })}
    </md-dialog>
    `;
  }

  async reset(): Promise<boolean> {
    await (this.#bodyRef.value as ModalDatePickerBody).reset();
    return this.updateComplete;
  }

  show(): Promise<void> {
    return (this.#dialogRef.value as MdDialog).show();
  }

  showPicker(): ReturnType<typeof this.show> {
    return this.show();
  }

  get returnValue(): ModalDatePickerProperties['returnValue'] {
    return (this.#dialogRef.value as MdDialog).returnValue;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerName]: ModalDatePicker;
  }
}
