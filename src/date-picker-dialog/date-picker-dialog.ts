import '@material/mwc-button';
import '@material/mwc-dialog';
import './app-date-picker-dialog-base.js';

import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';

import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import { appDatePickerName } from '../date-picker/constants.js';
import { slotDatePicker } from '../helpers/slot-date-picker.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling } from '../stylings.js';
import type { CustomEventDetail } from '../typings.js';
import { datePickerDialogBaseStyling } from './stylings.js';
import type { DatePickerDialogProperties, DialogClosedEventDetail, DialogClosingEventDetail } from './typings.js';

export class DatePickerDialog extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerDialogProperties {
  public get valueAsDate(): Date {
    return this.#valueAsDate;
  }

  public get valueAsNumber(): number {
    return +this.#valueAsDate;
  }

  @property({ type: String }) public confirmLabel = 'set';
  @property({ type: String }) public dismissLabel = 'cancel';
  @property({ type: Boolean }) public open = false;
  @property({ type: String }) public resetLabel = 'reset';
  @queryAsync(appDatePickerName) private _datePicker!: Promise<AppDatePicker>;
  @state() private _rendered = false;

  #isResetAction = false;
  #selectedDate: Date;
  #valueAsDate: Date;

  public static override styles = [
    baseStyling,
    datePickerDialogBaseStyling,
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
    <app-date-picker-dialog-base
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
    </app-date-picker-dialog-base>
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
    const {
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      landscape,
      locale,
      max,
      min,
      nextMonthLabel,
      previousMonthLabel,
      selectedDateLabel,
      showWeekNumber,
      startView,
      value,
      weekLabel,
      weekNumberType,
      yearDropdownLabel,
    } = this;

    return slotDatePicker({
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      inline: true,
      landscape,
      locale,
      max,
      min,
      nextMonthLabel,
      onDatePickerDateUpdated: this.$onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.$onDatePickerFirstUpdated,
      previousMonthLabel,
      selectedDateLabel,
      showWeekNumber,
      startView,
      value,
      weekLabel,
      weekNumberType,
      yearDropdownLabel,
    });
  }

  #onClosed = async (ev: CustomEvent<DialogClosedEventDetail>) => {
    const datePicker = await this._datePicker;

    this.hide();
    datePicker && (datePicker.startView = 'calendar');
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
