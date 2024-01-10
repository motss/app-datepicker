import '@material/web/button/outlined-button.js';
import '../date-picker/app-date-picker.js';
import './app-date-picker-dialog-base.js';
import '@material/web/dialog/dialog.js';

import { html, nothing, type TemplateResult  } from 'lit';
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
import { datePickerDialogStyling } from './stylings.js';
import type { DatePickerDialogChangedProperties, DatePickerDialogProperties, DialogClosedEventDetail, DialogClosingEventDetail } from './typings.js';

export class DatePickerDialog extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerDialogProperties {
  public static override styles = [
    baseStyling,
    datePickerDialogStyling,
  ];

  #isResetAction = false;

  #onClose = ({
    detail,
  }: CustomEvent<DialogClosingEventDetail>): void => {
    if (detail.action === 'set') {
      const selectedDate = this.#selectedDate;

      this.#valueAsDate = new Date(selectedDate);

      this.value = toDateString(selectedDate);
    }

    this.fire({ detail, type: 'close' });
  };
  #onClosed = async (ev: CustomEvent<DialogClosedEventDetail>): Promise<void> => {
    const datePicker = await this._datePicker;

    this.hide();
    datePicker && (datePicker.startView = 'calendar');
    this.fire({ detail: ev.detail, type: 'closed' });
  };
  #onOpen = ({ detail }: CustomEvent): void => {
    this.fire({ detail, type: 'open' });
  };
  #onOpened = ({ detail }: CustomEvent): void => {
    this.fire({ detail, type: 'opened' });
  };
  #onResetClick = () => {
    this.#isResetAction = true;
    this.value = undefined;
  };
  #selectedDate: Date;

  #valueAsDate: Date;
  @queryAsync(appDatePickerName) private _datePicker!: Promise<AppDatePicker>;
  @state() private _rendered = false;

  @property({ type: String }) public confirmLabel = 'set';

  @property({ type: String }) public dismissLabel = 'cancel';

  @property({ type: Boolean }) public open = false;

  @property({ type: String }) public resetLabel = 'reset';

  public constructor() {
    super();

    this.#selectedDate = this.#valueAsDate = toResolvedDate();
  }

  protected $onDatePickerDateUpdated({
    detail: {
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['date-updated']['detail']>): void {
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
  }: CustomEvent<CustomEventDetail['first-updated']['detail']>): void {
    this.#selectedDate = this.#valueAsDate = valueAsDate;
  }

  protected $renderSlot(): TemplateResult {
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
      selectedDateLabel,
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayLabel,
      toyearLabel,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    return slotDatePicker({
      chooseMonthLabel,
      chooseYearLabel,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      nextMonthLabel,
      onDatePickerDateUpdated: this.$onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.$onDatePickerFirstUpdated,
      previousMonthLabel,
      selectedDateLabel,
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      slot: 'content',
      startView,
      todayLabel,
      toyearLabel,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    });
  }

  public hide(): void {
    this.open = false;
  }

  protected override render(): TemplateResult {
    const {
      _rendered,
      confirmLabel,
      dismissLabel,
      open,
      resetLabel,
    } = this;

    return html`
    <md-dialog
      ?open=${open}
      @closed=${this.#onClosed}
      @close=${this.#onClose}
      @date-updated=${this.$onDatePickerDateUpdated}
      @first-updated=${this.$onDatePickerFirstUpdated}
      @opened=${this.#onOpened}
      @open=${this.#onOpen}
    >
      ${this.open ? this.$renderSlot() : nothing}

      <div slot=actions>
        <md-outlined-button
          @click=${this.#onResetClick}
          data-dialog-action=reset
        >
          <span class=label>${resetLabel}</span>
        </md-outlined-button>
        <md-outlined-button
          dialogAction=cancel
        >
          <span class=label>${dismissLabel}</span>
        </md-outlined-button>

        <md-outlined-button
          dialogAction=set
        >
          <span class=label>${confirmLabel}</span>
        </md-outlined-button>
      </div>
    </md-dialog>
    `;
  }

  public show(): void {
    this.open = true;
  }

  protected override updated(changedProperties: DatePickerDialogChangedProperties): void {
    /**
     * NOTE(motss): `value` should always update `#selectedDate` and `#valueAsDate`.
     */
    if (changedProperties.has('value')) {
      this.#selectedDate = this.#valueAsDate = toResolvedDate(this.value);
    }
  }

  // protected override willUpdate(changedProperties: DatePickerDialogChangedProperties): void {
  //     super.willUpdate(changedProperties);

  //     if (!this._rendered && this.open) {
  //       this._rendered = true;
  //     }
  // }

  public get valueAsDate(): Date {
    return this.#valueAsDate;
  }

  public get valueAsNumber(): number {
    return +this.#valueAsDate;
  }
}
