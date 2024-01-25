import '../modal-date-picker-body/modal-date-picker-body.js';
import '../modal-date-picker-footer/modal-date-picker-footer.js';
import '../modal-date-picker-header/modal-date-picker-header.js';

import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { iconEdit } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { ModalDatePickerFooter } from '../modal-date-picker-footer/modal-date-picker-footer.js';
import type { ModalDatePickerHeaderProperties } from '../modal-date-picker-header/types.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import { modalDatePickerName } from './constants.js';
import type { ModalDatePickerProperties } from './types.js';

@customElement(modalDatePickerName)
export class ModalDatePicker extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements ModalDatePickerProperties {
  static override styles = [
    resetShadowRoot,
    baseStyling,
  ];

  #onConfirmClick: ModalDatePickerFooter['onConfirmClick'] = () => {};

  #onDenyClick: ModalDatePickerFooter['onDenyClick'] = () => {};

  #onIconButtonClick: ModalDatePickerHeaderProperties['onIconButtonClick'] = () => {};

  protected override render(): TemplateResult {
    // fixme: move logics from body to here!
    const {
      chooseMonthLabel,
      chooseYearLabel,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      nextMonthLabel,
      previousMonthLabel,
      selectDateLabel,
      selectedDateLabel,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayLabel,
      toyearTemplate,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const headline = 'Thu, Jan 25'; // fixme: replace with focused date text
    const iconButton = iconEdit;
    const supportingText = selectDateLabel;

    return html`
    <modal-date-picker-header
      .headline=${headline}
      .iconButton=${iconButton}
      .onIconButtonClick=${this.#onIconButtonClick}
      .supportingText=${supportingText}
    ></modal-date-picker-header>

    <modal-date-picker-body
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
    ></modal-date-picker-body>

    <modal-date-picker-footer
      .onConfirmClick=${this.#onConfirmClick}
      .onDenyClick=${this.#onDenyClick}
    ></modal-date-picker-footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerName]: ModalDatePicker;
  }
}
