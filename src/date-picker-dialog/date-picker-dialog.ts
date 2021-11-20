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
  @property({ type: String }) public confirmLabel = 'set';
  @property({ type: String }) public dismissLabel = 'cancel';
  @property({ type: String }) public resetLabel = 'reset';
  @property({ type: Boolean }) public open = false;

  #disconnect: () => void = () => void 0;
  #valueAsDate: Date = toResolvedDate();

  public static override styles = [
    datePickerDialogStyling,
  ];

  public constructor() {
    super();

    const closing = (ev: CustomEvent<DialogClosingEventDetail>) => {
      this.#onClosing(ev);
    };

    this.addEventListener('closing' as never, closing);

    this.#disconnect = () => {
      this.removeEventListener('closing' as never, closing);
    };
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();

    this.#disconnect();
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
      ...rest
    },
  }: CustomEvent<DialogClosingEventDetail>): void => {
    console.debug({ action, rest });

    if (action === 'set') {
      this.value = toDateString(this.#valueAsDate);
    }
  };

  #onDatePickerDateUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>) {
    this.#valueAsDate = valueAsDate;
  }

  #onDatePickerFirstUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['first-updated']['detail']>) {
    this.#valueAsDate = valueAsDate;
  }

  #onResetClick() {
    this.value = undefined;
  }
}
