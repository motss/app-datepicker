import '@material/mwc-textfield';
import '../icon-button/app-icon-button.js';

import { TextField } from '@material/mwc-textfield';
import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

import { DateTimeFormat } from '../constants.js';
import type { AppDatePicker } from '../date-picker/app-date-picker.js';
import { appDatePickerName } from '../date-picker/constants.js';
import type { AppDatePickerInputSurface } from '../date-picker-input-surface/app-date-picker-input-surface.js';
import { appDatePickerInputSurfaceName } from '../date-picker-input-surface/constants.js';
import { slotDatePicker } from '../helpers/slot-date-picker.js';
import { toDateString } from '../helpers/to-date-string.js';
import { warnUndefinedElement } from '../helpers/warn-undefined-element.js';
import type { AppIconButton } from '../icon-button/app-icon-button.js';
import { appIconButtonName } from '../icon-button/constants.js';
import { iconClear } from '../icons.js';
import { keyEnter, keyEscape, keySpace, keyTab } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { baseStyling } from '../stylings.js';
import type { ChangedProperties, CustomEventDetail } from '../typings.js';
import { appDatePickerInputClearLabel, appDatePickerInputType } from './constants.js';
import { datePickerInputStyling } from './stylings.js';
import type { DatePickerInputProperties } from './typings.js';

export class DatePickerInput extends ElementMixin(DatePickerMixin(DatePickerMinMaxMixin(TextField))) implements DatePickerInputProperties {
  public override iconTrailing = 'clear';
  public override type = appDatePickerInputType;

  public get valueAsDate(): Date | null {
    return this.#valueAsDate || null;
  }

  public get valueAsNumber(): number {
    return Number(this.#valueAsDate || NaN);
  }

  @property({ type: String }) public clearLabel = appDatePickerInputClearLabel;
  @queryAsync('.mdc-text-field__input') protected $input!: Promise<HTMLInputElement | null>;
  @queryAsync(appDatePickerInputSurfaceName) protected $inputSurface!: Promise<AppDatePickerInputSurface | null>;
  @queryAsync(appDatePickerName) protected $picker!: Promise<AppDatePicker | null>;
  @state() private _disabled = false;
  @state() private _lazyLoaded = false;
  @state() private _open = false;
  @state() private _valueText = '';

  #disconnect: () => void = () => undefined;
  #focusElement: HTMLElement | undefined = undefined;
  #lazyLoading = false;
  #picker: AppDatePicker | undefined = undefined;
  #valueAsDate: Date | undefined;
  #valueFormatter = this.$toValueFormatter();

  public static override styles = [
    ...TextField.styles,
    baseStyling,
    datePickerInputStyling,
  ];

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#disconnect();
  }

  public override async firstUpdated(): Promise<void> {
    super.firstUpdated();

    const input = await this.$input;
    if (input) {
      const onBodyKeyup = async (ev: KeyboardEvent) => {
        if (this._disabled) return;

        if (ev.key === keyEscape) {
          this.closePicker();
        } else if (ev.key === keyTab) {
          const inputSurface = await this.$inputSurface;
          const isTabInsideInputSurface = (ev.composedPath() as HTMLElement[]).find(
            n => n.nodeType === Node.ELEMENT_NODE &&
            n.isEqualNode(inputSurface)
          );

          if (!isTabInsideInputSurface) this.closePicker();
        }
      };
      const onClick = () => {
        if (this._disabled) return;

        this._open = true;
      };
      const onKeyup = (ev: KeyboardEvent) => {
        if (this._disabled) return;
        if ([keySpace, keyEnter].some(n => n === ev.key)) {
          onClick();
        }
      };

      document.body.addEventListener('keyup', onBodyKeyup);
      input.addEventListener('keyup', onKeyup);
      input.addEventListener('click', onClick);

      this.#disconnect = () => {
        document.body.removeEventListener('keyup', onBodyKeyup);
        input.removeEventListener('keyup', onKeyup);
        input.removeEventListener('click', onClick);
      };
    }
  }

  public override willUpdate(changedProperties: ChangedProperties<DatePickerInputProperties>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('locale')) {
      const newLocale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;

      this.locale = newLocale;

      this.#valueFormatter = this.$toValueFormatter();
      this.#updateValues(this.value);
    }

    if (changedProperties.has('value')) {
      this.#updateValues(this.value);
    }

    if (changedProperties.has('disabled') || changedProperties.has('readOnly')) {
      this._disabled = this.disabled || this.readOnly;
    }
  }

  public override async updated(): Promise<void> {
    if (this._open && this._lazyLoaded) {
      const picker = await this.$picker;

      picker?.queryAll?.<AppIconButton>(appIconButtonName).forEach(n => n.layout());
    }
  }

  public override render(): TemplateResult {
    const {
      _lazyLoaded,
      _open,
    } = this;

    if (!_lazyLoaded && _open) this.#lazyLoad();

    return html`
    ${super.render()}
    ${_lazyLoaded ? this.$renderContent() : nothing}
    `;
  }

  public closePicker(): void {
    this._open = false;
  }

  public reset(): void {
    if (this._disabled) return;

    this.#valueAsDate = undefined;
    this.value = this._valueText = '';
  }

  public showPicker(): void {
    if (this._disabled) return;

    this._open = true;
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
        .value=${live(this._valueText)}
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
    <app-icon-button
      .disabled=${this._disabled}
      @click=${this.#onResetClick}
      aria-label=${this.clearLabel}
      class="mdc-text-field__icon mdc-text-field__icon--trailing"
    >
      ${iconClear}
    </app-icon-button>
    `;
  }

  protected $renderContent(): TemplateResult {
    warnUndefinedElement(appDatePickerInputSurfaceName);

    return html`
    <app-date-picker-input-surface
      @opened=${this.#onOpened}
      ?open=${this._open}
      ?stayOpenOnBodyClick=${true}
      .anchor=${this as HTMLElement}
      @closed=${this.#onClosed}
    >${
      /**
       * NOTE(motss): This removes/ renders datePicker with a clean slate.
       */
      this._open ? this.$renderSlot() : nothing
    }</app-date-picker-input-surface>
    `;
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
      onDatePickerDateUpdated: this.#onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.#onDatePickerFirstUpdated,
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
    });
  }

  protected $toValueFormatter(): Intl.DateTimeFormat {
    return DateTimeFormat(this.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * FIXME(motss): Unable to test the lazy loading in `wtr` due to:
   * 1. Unable to dynamically import `.js` file
   * 2. Unable to dedupe the same custom element caused by dynamic import with import maps
   *
   * Therefore, defer testing the lazy loading until there is a way to test it in `wtr`.
   */
  /* c8 ignore start */
  #lazyLoad = async (): Promise<void> => {
    if (this._lazyLoaded || this.#lazyLoading) return;

    const deps = [
      appDatePickerName,
      appDatePickerInputSurfaceName,
    ] as const;

    if (deps.some(n => globalThis.customElements.get(n) == null)) {
      this.#lazyLoading = true;

      const tasks = deps.map(n => globalThis.customElements.whenDefined(n));
      const imports = [
        import('../date-picker/app-date-picker.js'),
        import('../date-picker-input-surface/app-date-picker-input-surface.js'),
      ];

      try {
        await Promise.all(imports);
        await Promise.all(tasks);
      } catch (error) {
        console.error(error);
      }
    }

    /**
     * NOTE(motss): `#lazyLoad()` is called within `render()` so this needs to wait for next update
     * to re-trigger update when it updates `_lazyLoaded`.
     */
    await this.updateComplete;

    this.#lazyLoading = false;
    this._lazyLoaded = true;
  };
  /* c8 ignore stop */

  #onResetClick = (ev: MouseEvent): void => {
    if (this._disabled) return;

    /**
     * NOTE(motss): To prevent triggering the `focus` event of `TextField` element.
     */
    ev.preventDefault();

    this.reset();
  };

  #onClosed = ({ detail }: CustomEvent): void => {
    this._open = false;
    this.fire({ detail, type: 'closed' });
  };

  #onDatePickerDateUpdated = async (ev: CustomEvent<CustomEventDetail['date-updated']['detail']>): Promise<void> => {
    const {
      isKeypress,
      key,
      valueAsDate,
    } = ev.detail;

    /**
     * NOTE(motss): When it is triggered by mouse click or the following keys,
     * update `.value` and close the input surface containing the date picker.
     */
    if (!isKeypress || (key === keyEnter || key === keySpace)) {
      this.#updateValues(valueAsDate);
      isKeypress && (await this.$inputSurface)?.close();
    }
  };

  #onDatePickerFirstUpdated = ({
    currentTarget,
    detail: {
      focusableElements: [focusableElement],
      valueAsDate,
    },
  }: CustomEvent<CustomEventDetail['first-updated']['detail']>): void => {
    this.#focusElement = focusableElement;
    this.#picker = currentTarget as AppDatePicker;
    this.#updateValues(valueAsDate);
  };

  #onOpened = async ({ detail }: CustomEvent): Promise<void> => {
    await this.#picker?.updateComplete;
    await this.updateComplete;

    this.#focusElement?.focus();
    this.fire({ detail, type: 'opened' });
  };

  #updateValues = (value: Date | string): void => {
    if (value) {
      const valueDate = new Date(value);

      this.#valueAsDate = valueDate;
      this._valueText = this.#valueFormatter.format(valueDate);
      this.value = toDateString(valueDate);
    } else {
      this.reset();
    }
  };
}
