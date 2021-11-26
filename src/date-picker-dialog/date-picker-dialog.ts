import '@material/mwc-button';
import '@material/mwc-dialog';
import '../date-picker/app-date-picker.js';
import './app-date-picker-dialog-base.js';

import type { ReactiveElement, TemplateResult } from 'lit';
import { adoptStyles, html } from 'lit';
import { property } from 'lit/decorators.js';

import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import type { CustomEventDetail } from '../typings.js';
import { datePickerDialogStyling } from './stylings.js';
import type { DatePickerDialogProperties, DialogClosingEventDetail } from './typings.js';

export class DatePickerDialog extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerDialogProperties {
  public override get valueAsDate(): Date {
    return this.#valueAsDate;
  }

  public override get valueAsNumber(): number {
    return +this.#valueAsDate;
  }

  @property({ type: String }) public confirmLabel = 'set';
  @property({ type: String }) public dismissLabel = 'cancel';
  @property({ type: String }) public resetLabel = 'reset';
  @property({ type: Boolean }) public open = false;

  #isResetAction = false;
  #selectedDate: Date;
  #valueAsDate: Date;

  public static override styles = [
    datePickerDialogStyling,
  ];

  public constructor() {
    super();

    this.#selectedDate = this.#valueAsDate = toResolvedDate();
  }

  protected override createRenderRoot(): Element | ShadowRoot {
    const renderRoot = this as unknown as ShadowRoot;

    adoptStyles(
      renderRoot,
      (this.constructor as typeof ReactiveElement).elementStyles
    );

    return renderRoot;
  }

  protected override render(): TemplateResult<1> {
    return html`
    <app-date-picker-dialog-base
      ?open=${this.open}
      @closing=${this.#onClosing}
      @closed=${this.#onClosed}
    >
      <app-date-picker
        ?showWeekNumber=${this.showWeekNumber}
        .disabledDates=${this.disabledDates}
        .disabledDays=${this.disabledDays}
        .firstDayOfWeek=${this.firstDayOfWeek}
        .landscape=${this.landscape}
        .locale=${this.locale}
        .max=${this.max}
        .min=${this.min}
        .nextMonthLabel=${this.nextMonthLabel}
        .previousMonthLabel=${this.previousMonthLabel}
        .selectedDateLabel=${this.selectedDateLabel}
        .startView=${this.startView}
        .value=${this.value}
        .weekLabel=${this.weekLabel}
        .weekNumberType=${this.weekNumberType}
        .yearDropdownLabel=${this.yearDropdownLabel}
        @date-updated=${this.#onDatePickerDateUpdated}
        @first-updated=${this.#onDatePickerFirstUpdated}
      ></app-date-picker>

      <div class=secondary-actions slot=secondaryAction>
        <mwc-button
          @click=${this.#onResetClick}
          data-dialog-action=reset
        >${this.resetLabel}</mwc-button>
        <mwc-button
          dialogAction=cancel
        >${this.dismissLabel}</mwc-button>
      </div>

      <mwc-button
        dialogAction=set
        slot=primaryAction
      >${this.confirmLabel}</mwc-button>
    </app-date-picker-dialog-base>
    `;
  }

  public hide(): void {
    this.open = false;
  }

  public show(): void {
    this.open = true;
  }

  #onClosed = () => {
    this.hide();
  };

  #onClosing = ({
    detail: {
      action,
    },
  }: CustomEvent<DialogClosingEventDetail>): void => {
    if (action === 'set') {
      const selectedDate = this.#selectedDate;

      this.#valueAsDate = new Date(selectedDate);

      this.value = toDateString(selectedDate);
    }
  };

  #onDatePickerDateUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>) {
    this.#selectedDate = new Date(valueAsDate);

    /**
     * Reset `value` when it is a reset action or `value` is nullish
     */
    if (this.#isResetAction || !this.value) {
      this.#isResetAction = false;
      this.#valueAsDate = new Date(valueAsDate);

      this.value = toDateString(valueAsDate);
    }
  }

  #onDatePickerFirstUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['first-updated']['detail']>) {
    this.#selectedDate = this.#valueAsDate = valueAsDate;
  }

  #onResetClick() {
    this.#isResetAction = true;
    this.value = undefined;
  }
}
