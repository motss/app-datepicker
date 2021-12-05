import '@material/mwc-button';
import '@material/mwc-dialog';
import './app-date-picker-dialog-dialog.js';

import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import type { CustomEventDetail } from '../typings.js';
import { datePickerDialogStyling } from './stylings.js';
import type { DatePickerDialogProperties, DialogClosedEventDetail, DialogClosingEventDetail } from './typings.js';

export class DatePickerDialogBase extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerDialogProperties {
  public get valueAsDate(): Date {
    return this.#valueAsDate;
  }

  public get valueAsNumber(): number {
    return +this.#valueAsDate;
  }

  @property({ type: String }) public confirmLabel = 'set';
  @property({ type: String }) public dismissLabel = 'cancel';
  @property({ type: String }) public resetLabel = 'reset';
  @property({ type: Boolean }) public open = false;
  @state() private _rendered = false;

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

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
      super.willUpdate(changedProperties);

      if (!this._rendered && this.open) {
        this._rendered = true;
      }
  }

  protected override render(): TemplateResult {
    return html`
    <app-date-picker-dialog-dialog
      ?open=${this.open}
      @closed=${this.#onClosed}
      @closing=${this.#onClosing}
      @date-updated=${this.$onDatePickerDateUpdated}
      @first-updated=${this.$onDatePickerFirstUpdated}
      @opened=${this.#onOpened}
      @opening=${this.#onOpening}
    >
      ${this._rendered ? html`
      ${this.$renderSlot()}

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
      ` : nothing}
    </app-date-picker-dialog-dialog>
    `;
  }

  public hide(): void {
    this.open = false;
  }

  public show(): void {
    this.open = true;
  }

  protected $onDatePickerDateUpdated({
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

  protected $onDatePickerFirstUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['first-updated']['detail']>) {
    this.#selectedDate = this.#valueAsDate = valueAsDate;
  }

  protected $renderSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  #onClosed = (ev: CustomEvent<DialogClosedEventDetail>) => {
    this.hide();
    this.fire({ detail: ev.detail, type: 'closed' });
  };

  #onClosing = ({
    detail,
  }: CustomEvent<DialogClosingEventDetail>): void => {
    if (detail.action === 'set') {
      const selectedDate = this.#selectedDate;

      this.#valueAsDate = new Date(selectedDate);

      this.value = toDateString(selectedDate);
    }

    this.fire({ detail, type: 'closing' });
  };

  #onOpened = ({ detail }: CustomEvent): void => {
    this.fire({ detail, type: 'opened' });
  };

  #onOpening = ({ detail }: CustomEvent): void => {
    this.fire({ detail, type: 'opening' });
  };

  #onResetClick() {
    this.#isResetAction = true;
    this.value = undefined;
  }
}
