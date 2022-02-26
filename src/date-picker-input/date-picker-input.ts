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
import type { DatePickerMixinProperties } from '../mixins/typings.js';
import { baseStyling } from '../stylings.js';
import type { ChangedProperties, CustomEventDetail, DatePickerProperties } from '../typings.js';
import { appDatePickerInputClearLabel, appDatePickerInputType } from './constants.js';
import { datePickerInputStyling } from './stylings.js';

export class DatePickerInput extends ElementMixin(DatePickerMixin(DatePickerMinMaxMixin(TextField))) implements DatePickerMixinProperties {
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
  @state() private _lazyLoaded = false;
  @state() private _open = false;
  @state() private _valueText = '';

  #disconnect: () => void = () => undefined;
  #focusElement: HTMLElement | undefined = undefined;
  #isClearAction = false;
  #lazyLoading = false;
  #picker: AppDatePicker | undefined = undefined;
  #selectedDate: Date | undefined;
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
      const onClick = () => this._open = true;
      const onKeyup = (ev: KeyboardEvent) => {
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

  public override willUpdate(changedProperties: ChangedProperties<DatePickerProperties>): void {
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
    ${_lazyLoaded && _open ? this.$renderContent() : nothing}
    `;
  }

  public closePicker(): void {
    this._open = false;
  }

  public reset(): void {
    this.#onResetClick();
  }

  public showPicker(): void {
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
    >${this.$renderSlot()}</app-date-picker-input-surface>
    `;
  }

  protected $renderSlot(): TemplateResult {
    const {
      chooseMonthLabel,
      chooseYearLabel,
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
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayDateLabel,
      todayYearLabel,
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
      landscape,
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
      todayDateLabel,
      todayYearLabel,
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
        '../date-picker/app-date-picker.js',
        '../date-picker-input-surface/app-date-picker-input-surface.js',
      ].map(n => import(n));

      try {
        await Promise.all(imports);
        await Promise.all(tasks);
      } catch (error) {
        console.error(error);
      }
    }

    this.#lazyLoading = false;
    this._lazyLoaded = true;
  };
  /* c8 ignore stop */

  #onResetClick = (): void => {
    this.#isClearAction = true;
    this.#selectedDate = this.#valueAsDate = undefined;

    this.value = this._valueText = '';
  };

  #onClosed = ({ detail }: CustomEvent): void => {
    this._open = false;
    this.#picker && (this.#picker.startView = 'calendar');
    this.fire({ detail, type: 'closed' });
  };

  #onDatePickerDateUpdated = async (ev: CustomEvent<CustomEventDetail['date-updated']['detail']>): Promise<void> => {
    const {
      isKeypress,
      key,
      valueAsDate,
    } = ev.detail;

    /**
     * NOTE: When the input date is cleared, the date picker's `date` will be updated and `#isClearAction`
     * is used to prevent `valueAsDate` from updating empty `value`.
     *
     * The flow of execution is as follows:
     *
     * 1. Clear input value
     * 2. Set `#isClearAction=true`
     * 3. `date` updated but `#isClearAction` is true so do nothing and reset `#isClearAction`
     * 4. At this point, new value can be set via keyboard or mouse
     */
    if (!this.#isClearAction) {
      this.#selectedDate = valueAsDate;

      if (!isKeypress || (key === keyEnter || key === keySpace)) {
        this.value = toDateString(this.#selectedDate);
        isKeypress && (await this.$inputSurface)?.close();
      }
    } else {
      this.#isClearAction = false;
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
    this.#selectedDate = valueAsDate;
  };

  #onOpened = async ({ detail }: CustomEvent): Promise<void> => {
    await this.#picker?.updateComplete;
    await this.updateComplete;

    this.#focusElement?.focus();
    this.fire({ detail, type: 'opened' });
  };

  #updateValues = (value: string): void => {
    if (value) {
      const valueDate = new Date(value);

      this.#selectedDate = this.#valueAsDate = valueDate;
      this._valueText = this.#valueFormatter.format(valueDate);
    } else {
      this.#onResetClick();
    }
  };
}
