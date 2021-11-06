import '../date-picker-input-surface/app-date-picker-input-surface.js';

import type { TextFieldType } from '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { DateTimeFormat } from '../constants.js';
import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { iconClose } from '../icons.js';
import { keyEnter, keySpace } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { DatePickerMixinProperties } from '../mixins/typings.js';
import type { ChangedProperties, DatePickerProperties, SupportedCustomEventDetail } from '../typings.js';
import { datePickerInputStyling } from './stylings.js';

export class DatePickerInput extends DatePickerMixin(DatePickerMinMaxMixin(TextField)) implements DatePickerMixinProperties {
  public override type = 'date' as TextFieldType;

  @property({ type: String }) public clearLabel = 'Clear';
  @queryAsync('.mdc-text-field__input') private _input!: Promise<HTMLInputElement | null>;
  @state() private _open = false;
  @state() private _valueText = '';

  #disconnect: () => void = () => undefined;
  #focusElement: HTMLElement | undefined = undefined;
  #picker: AppDatePicker | undefined = undefined;
  #valueFormatter = this.#toValueFormatter();

  public static override styles = [
    ...TextField.styles,
    datePickerInputStyling,
  ];

  public override async disconnectedCallback(): Promise<void> {
    super.disconnectedCallback();

    this.#disconnect();
  }

  public override async firstUpdated(): Promise<void> {
    super.firstUpdated();

    const input = await this._input;

    if (!input) return;

    const onClick = () => this._open = true;
    const onKeyup = (ev: KeyboardEvent) => {
      if ([keySpace, keyEnter].some(n => n === ev.key)) {
        onClick();
      }
    };

    input.addEventListener('keyup', onKeyup);
    input.addEventListener('click', onClick);

    this.#disconnect = () => {
      input.removeEventListener('keyup', onKeyup);
      input.removeEventListener('click', onClick);
    };
  }

  public override willUpdate(changedProperties: ChangedProperties<DatePickerProperties>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('locale')) {
      const newLocale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;

      this.locale = newLocale;
      this.#valueFormatter = this.#toValueFormatter();

      if (this.value) {
        this._valueText = this.#valueFormatter.format(toResolvedDate(this.value));
      }
    }

    if (changedProperties.has('value') && this.value) {
      this._valueText = this.#valueFormatter.format(toResolvedDate(this.value));
    }
  }

  public override render(): TemplateResult {
    return html`
    ${super.render()}
    ${
      this._open ?
        html`
        <app-date-picker-input-surface
          ?open=${true}
          ?stayOpenOnBodyClick=${true}
          .anchor=${this}
          @closed=${this.#onClosed}
          @opened=${this.#onOpened}
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
        </app-date-picker-input-surface>
        ` :
        nothing
    }`;
  }

  protected override renderInput(shouldRenderHelperText: boolean): TemplateResult {
    /**
     * NOTE: All these code are copied from original implementation.
     */
    const autocapitalizeOrUndef = this.autocapitalize ?
        this.autocapitalize as (
            'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters') :
        undefined;
    const showValidationMessage = this.validationMessage && !this.isUiValid;
    const ariaLabelledbyOrUndef = this.label ? 'label' : undefined;
    const ariaControlsOrUndef =
        shouldRenderHelperText ? 'helper-text' : undefined;
    const ariaDescribedbyOrUndef =
        this.focused || this.helperPersistent || showValidationMessage ?
        'helper-text' :
        undefined;

    return html`
      <input
        ?disabled=${this.disabled}
        ?readonly=${true}
        ?required=${this.required}
        .value=${this._valueText}
        @blur=${this.onInputBlur}
        @focus=${this.onInputFocus}
        aria-controls=${ifDefined(ariaControlsOrUndef)}
        aria-describedby=${ifDefined(ariaDescribedbyOrUndef)}
        aria-labelledby=${ifDefined(ariaLabelledbyOrUndef)}
        autocapitalize=${ifDefined(autocapitalizeOrUndef)}
        class=mdc-text-field__input
        inputmode=${ifDefined(this.inputMode)}
        name=${ifDefined(this.name === '' ? undefined : this.name)}
        placeholder=${this.placeholder}
        type=text
      >`;
  }

  protected override renderTrailingIcon(): TemplateResult {
    return html`
    <mwc-icon-button
      @click=${this.#onClearClick}
      aria-label=${this.clearLabel}
      class="mdc-text-field__icon mdc-text-field__icon--trailing"
    >
      ${iconClose}
    </mwc-icon-button>
    `;
  }

  #onClearClick() {
    this.value = this._valueText = '';
  }

  #onClosed() {
    this._open = false;
  }

  async #onDatePickerFirstUpdated(ev: CustomEvent<SupportedCustomEventDetail['first-updated']>) {
    const [focusableElement] = ev.detail.focusableElements;

    this.#picker = ev.currentTarget as AppDatePicker;
    this.#focusElement = focusableElement;
  }

  #onDatePickerDateUpdated(ev: CustomEvent<SupportedCustomEventDetail['date-updated']>) {
    this.value = this.#valueFormatter.format(ev.detail.value);
  }

  async #onOpened() {
    await (this.#picker as AppDatePicker).updateComplete;
    await this.updateComplete;

    this.#focusElement?.focus();
  }

  #toValueFormatter() {
    return DateTimeFormat(this.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
