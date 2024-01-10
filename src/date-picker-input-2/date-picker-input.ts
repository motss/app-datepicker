import '@material/web/iconbutton/icon-button.js';
import '@material/web/elevation/elevation.js';

import { SurfacePositionController } from '@material/web/menu/internal/controllers/surfacePositionController.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, nothing, type TemplateResult     } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

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

export class DatePickerInput extends ElementMixin(DatePickerMixin(DatePickerMinMaxMixin(MdOutlinedTextField))) implements DatePickerInputProperties {
  static override styles = [
    ...MdOutlinedTextField.styles,
    baseStyling,
    datePickerInputStyling,
  ];

  #disconnect: () => void = () => undefined;

  #focusElement: HTMLElement | undefined = undefined;

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

  #lazyLoading = false;

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
  #onResetClick = (ev: MouseEvent): void => {
    if (this._disabled) return;

    /**
     * NOTE(motss): To prevent triggering the `focus` event of `TextField` element.
     */
    ev.preventDefault();

    this.reset();
  };
  #picker: AppDatePicker | undefined = undefined;
  #updateValues = (value: Date | string): void => {
    if (value) {
      const valueDate = new Date(value);

      this.#valueAsDate = valueDate;
      this.value = toDateString(valueDate);
    } else {
      this.reset();
    }
  };

  #valueAsDate: Date | undefined;
  #valueFormatter = this.$toValueFormatter();
  @state() private _disabled = false;
  @state() private _lazyLoaded = false;
  @state() private _open = false;

  private readonly menuPositionController = new SurfacePositionController(
    this,
    () => {
      return {
        anchorCorner: 'end-start',
        anchorEl: null,
        // beforeClose: this.beforeClose,
        // isOpen: this.open,
        // onClose: this.onClosed,
        // onOpen: this.onOpened,
        positioning: 'absolute',
          // this.positioning === 'popover' ? 'document' : this.positioning,
        // content.
        repositionStrategy: 'move',
          // this.hasOverflow && this.positioning !== 'popover'
          //   ? 'move'
          //   : 'resize',
        surfaceCorner: 'start-start',
        surfaceEl: this.surfaceEl,
        xOffset: 0,
        // We can't resize components that have overflow like menus with
        // submenus because the overflow-y will show menu items / content
        // outside the bounds of the menu. Popover API fixes this because each
        // submenu is hoisted to the top-layer and are not considered overflow
        yOffset: 0,
      };
    }
  );

  @queryAsync('.mdc-text-field__input') protected $input!: Promise<HTMLInputElement | null>;

  @queryAsync(appDatePickerInputSurfaceName) protected $inputSurface!: Promise<AppDatePickerInputSurface | null>;

  @queryAsync(appDatePickerName) protected $picker!: Promise<AppDatePicker | null>;

  @property({ type: String }) public clearLabel = appDatePickerInputClearLabel;

  public override iconTrailing = 'clear';

  public override type = appDatePickerInputType;

  private renderSurface() {
    // popover=${this.positioning === 'popover' ? 'manual' : nothing}>
    return html`
      <div
        class="menu}"
        style=${styleMap(this.menuPositionController.surfaceStyles)}></div>
        <md-elevation part="elevation"></md-elevation>
        <div class="items">
          <div class="item-padding"> ${this.renderInput(false)} </div>
        </div>
      </div>
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
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  public closePicker(): void {
    this._open = false;
  }

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

    /**
     * NOTE(motss): This is a workaround to ensure all inner dependencies of  `TextField`
     * will be updated accordingly and `.layout()` is called correctly.
     */
    /* c8 ignore next */
    await this.outlineElement?.updateComplete;
    // await this.layout();
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

  protected override renderInput(shouldRenderHelperText: boolean): TemplateResult {
    /**
     * NOTE(motss): All these code are copied from original implementation with minor modification.
     */
    const {
      autocapitalize,
      disabled,
      focused,
      helperPersistent,
      inputMode,
      isUiValid,
      label,
      name,
      placeholder,
      required,
      validationMessage,
    } = this;

    const autocapitalizeOrUndef = autocapitalize ?
        autocapitalize as (
            'characters' | 'none' | 'off' | 'on' | 'sentences' | 'words') :
        undefined;
    const showValidationMessage = validationMessage && !isUiValid;
    const ariaLabelledbyOrUndef = label ? 'label' : undefined;
    const ariaControlsOrUndef =
        shouldRenderHelperText ? 'helper-text' : undefined;
    const ariaDescribedbyOrUndef =
        focused || helperPersistent || showValidationMessage ?
        'helper-text' :
        undefined;
    const valueText = this.#valueAsDate ? this.#valueFormatter.format(this.#valueAsDate) : '';

    return html`
      <input
          ?disabled=${disabled}
          ?required=${required}
          .value=${valueText}
          @blur=${this.onInputBlur}
          @focus=${this.onInputFocus}
          aria-controls=${ifDefined(ariaControlsOrUndef)}
          aria-describedby=${ifDefined(ariaDescribedbyOrUndef)}
          aria-labelledby=${ifDefined(ariaLabelledbyOrUndef)}
          autocapitalize=${ifDefined(autocapitalizeOrUndef)}
          class=mdc-text-field__input
          inputmode=${ifDefined(inputMode)}
          name=${ifDefined(name || undefined)}
          placeholder=${ifDefined(placeholder)}
          readonly
          type=text
      >`;
  }

  /**
   * FIXME(motss): Unable to test the lazy loading in `wtr` due to:
   * 1. Unable to dynamically import `.js` file
   * 2. Unable to dedupe the same custom element caused by dynamic import with import maps
   *
   * Therefore, defer testing the lazy loading until there is a way to test it in `wtr`.
   */
  protected override renderTrailingIcon(): TemplateResult {
    return html`
    <md-icon-button
      ?disabled=${this._disabled}
      @click=${this.#onResetClick}
      aria-label=${this.clearLabel}
      class="mdc-text-field__icon mdc-text-field__icon--trailing"
    >
      ${iconClear}
    </md-icon-button>
    `;
  }
  /* c8 ignore stop */

  public reset(): void {
    if (this._disabled) return;

    this.#valueAsDate = undefined;
    this.value = '';
  }

  public showPicker(): void {
    if (this._disabled) return;

    this._open = true;
  }

  public override async updated(): Promise<void> {
    if (this._open && this._lazyLoaded) {
      const picker = await this.$picker;

      picker?.queryAll?.<AppIconButton>(appIconButtonName).forEach(n => n.layout());
    }
  }

  public override willUpdate(changedProperties: ChangedProperties<DatePickerInputProperties>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('locale')) {
      this.locale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;
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

  public get valueAsDate(): Date | null {
    return this.#valueAsDate || null;
  }

  public get valueAsNumber(): number {
    return Number(this.#valueAsDate || NaN);
  }
}
