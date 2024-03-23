import '@material/web/dialog/dialog.js';
import '../date-picker-calendar/date-picker-calendar.js';
import './body-menu/modal-date-picker-body-menu.js';
import './header/modal-date-picker-header.js';
import './year-grid/modal-date-picker-year-grid.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdTextButton } from '@material/web/button/text-button.js';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { dateFormatOptions, labelConfirm, labelDeny } from '../../constants.js';
import { MinMaxController } from '../../controllers/min-max-controller/min-max-controller.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { iconEdit } from '../../icons.js';
import { DatePickerMinMaxMixin } from '../../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { DatePickerStartViewMixin } from '../../mixins/date-picker-start-view-mixin.js';
import { renderActions } from '../../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../../render-helpers/render-actions/styles.js';
import { RootElement } from '../../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../../styles.js';
import type { DatePickerCalendarProperties } from '../date-picker-calendar/types.js';
import type { ModalDatePickerBodyMenu } from './body-menu/modal-date-picker-body-menu.js';
import { modalDatePickerName } from './constants.js';
import type { ModalDatePickerHeaderProperties } from './header/types.js';
import { modalDatePickerStyles } from './styles.js';
import type {
  ModalDatePickerProperties,
  ModalDatePickerPropertiesReturnValue,
} from './types.js';
import type { ModalDatePickerYearGrid } from './year-grid/modal-date-picker-year-grid.js';
import type { ModalDatePickerYearGridProperties } from './year-grid/types.js';

@customElement(modalDatePickerName)
export class ModalDatePicker
  extends DatePickerMixin(
    DatePickerStartViewMixin(DatePickerMinMaxMixin(RootElement))
  )
  implements ModalDatePickerProperties
{
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerStyles,
    renderActionsStyle,
  ];

  #bodyMenuRef = createRef<ModalDatePickerBodyMenu>();

  #dialogRef: Ref<MdDialog> = createRef();

  #didDateUpdate = false;

  #focusSelectedYear = async (
    changedProperties: PropertyValueMap<this>
  ): Promise<void> => {
    if (changedProperties.has('startView')) {
      const yearGridElement = this.#yearGridRef.value;

      if (yearGridElement) {
        await yearGridElement.updateComplete;
        yearGridElement.focusYearWhenNeeded();
      }
    }
  };

  #minMax_ = new MinMaxController(this);

  #onDateUpdate: DatePickerCalendarProperties['onDateUpdate'] = (
    updatedDate
  ) => {
    this.#selectedDate = updatedDate;
    this.#didDateUpdate = true;
    this.requestUpdate();
  };

  #onDialogClosed = (ev: CustomEvent<object>) => {
    this.#propagateCustomEvent(ev);

    const updatedDate = this.#selectedDate;

    if (
      this.#didDateUpdate &&
      updatedDate &&
      this.#dialogRef.value?.returnValue === 'confirm'
    ) {
      // todo: add custom formatter
      this.value = updatedDate.toJSON();
      this.#selectedDate = undefined;
      // this.onDateUpdate?.(updatedDate);
    }
  };

  #onIconButtonClick: NonNullable<
    ModalDatePickerHeaderProperties['onIconButtonClick']
  > = () => {
    /** fixme: this require new M3 TextField component to edit date */
  };

  #onMenuClick = () => {
    this.startView = this.startView === 'calendar' ? 'yearGrid' : 'calendar';
  };

  #onNextClick = () => {
    this._focusedDate = toUTCDate(this._focusedDate, { month: 1 });
  };

  #onPrevClick = () => {
    this._focusedDate = toUTCDate(this._focusedDate, { month: -1 });
  };

  #onYearUpdate: NonNullable<
    ModalDatePickerYearGridProperties['onYearUpdate']
  > = (year) => {
    const focusedDate = toResolvedDate(this._focusedDate);

    this._focusedDate = fromPartsToUtcDate(
      year,
      focusedDate.getUTCMonth(),
      focusedDate.getUTCDate()
    );
    this.startView = 'calendar';
  };

  #propagateCustomEvent = (ev: CustomEvent<object>) => {
    this.fire({ detail: ev.detail, type: ev.type });
  };

  #selectedDate?: Date;

  #updateFocusOnViewChange = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('startView')) {
      const { startView } = this;

      if (changedProperties.get('startView') !== startView) {
        const menuButton =
          this.#bodyMenuRef.value?.root.querySelector<MdTextButton>(
            '.menuButton'
          );

        menuButton?.focus();
      }
    }
  };

  #updateFocusedDate = (date: Date) => {
    this._focusedDate = toResolvedDate(date);
  };

  #updateFocusedDateByValue = (changedProperties: PropertyValueMap<this>) => {
    if (
      changedProperties.has('value') &&
      this.value !== changedProperties.get('value')
    ) {
      this.#updateFocusedDate(toResolvedDate(this.value));
    }
  };

  #updateStartView = () => {
    this.startView = 'calendar';
  };

  #yearGridRef = createRef<ModalDatePickerYearGrid>();

  @state() _focusedDate: Date;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property({ type: Boolean }) open: ModalDatePickerProperties['open'];

  @property() type?: MdDialog['type'];

  constructor() {
    super();

    const { value } = this;

    this._focusedDate = toResolvedDate(value);
    // this._focusedDate = this._selectedDate = this._tabbableDate = toResolvedDate(value);
  }

  close(returnValue: ModalDatePickerPropertiesReturnValue) {
    return (this.#dialogRef.value as MdDialog).close(returnValue);
  }

  protected override render(): TemplateResult {
    // fixme: move logics from body to here!
    const {
      _focusedDate,
      chooseMonthLabel,
      chooseYearLabel,
      confirmText,
      denyText,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      id,
      locale,
      max,
      min,
      nextMonthLabel,
      open,
      previousMonthLabel,
      selectDateLabel,
      selectedDateLabel,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayLabel,
      toyearTemplate,
      type,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;
    const { maxDate, minDate } = this.#minMax_;

    const formId = id || 'modalDatePicker';
    const headline = new Intl.DateTimeFormat(locale, dateFormatOptions).format(
      this.#selectedDate
    );
    const iconButton = iconEdit;
    const supportingText = selectDateLabel;

    const isCalendarView = startView === 'calendar';
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;
    const showNextButton =
      isCalendarView && !isSameMonth(_focusedDate, maxDate);
    const showPrevButton =
      isCalendarView && !isSameMonth(_focusedDate, minDate);
    const valueValue = toDateString(_focusedDate);

    return html`
    <md-dialog
      ${ref(this.#dialogRef)}
      ?open=${open}
      @cancel=${this.#propagateCustomEvent}
      @close=${this.#propagateCustomEvent}
      @closed=${this.#onDialogClosed}
      @open=${this.#propagateCustomEvent}
      @opened=${this.#propagateCustomEvent}
      class=dialog
      type=${ifDefined(type)}
    >
      <form method=dialog slot=content id=${formId}>
        <modal-date-picker-header
          class=header
          .headline=${headline}
          .iconButton=${iconButton}
          .onIconButtonClick=${this.#onIconButtonClick}
          .supportingText=${supportingText}
        ></modal-date-picker-header>

        <modal-date-picker-body-menu
          ${ref(this.#bodyMenuRef)}
          class=menu
          menuLabel=${menuLabel}
          menuText=${longMonthYearFormat(_focusedDate)}
          nextIconButtonLabel=${nextMonthLabel}
          .onMenuClick=${this.#onMenuClick}
          .onNextClick=${this.#onNextClick}
          .onPrevClick=${this.#onPrevClick}
          .prevIconButtonLabel=${previousMonthLabel}
          ?showNextButton=${showNextButton}
          ?showPrevButton=${showPrevButton}
        ></modal-date-picker-body-menu>

        <div class=body>${
          startView === 'calendar'
            ? html`<date-picker-calendar
              ?showWeekNumber=${showWeekNumber}
              .max=${max}
              .min=${min}
              .onDateChange=${this.#updateFocusedDate}
              .onDateUpdate=${this.#onDateUpdate}
              .onYearUpdate=${this.#updateStartView}
              class=body
              disabledDates=${disabledDates}
              disabledDays=${disabledDays}
              firstDayOfWeek=${firstDayOfWeek}
              locale=${locale}
              selectDateLabel=${selectDateLabel}
              selectedDateLabel=${selectedDateLabel}
              selectedYearTemplate=${selectedYearTemplate}
              shortWeekLabel=${shortWeekLabel}
              startView=${startView}
              todayLabel=${todayLabel}
              toyearTemplate=${toyearTemplate}
              value=${valueValue}
              weekLabel=${weekLabel}
              weekNumberTemplate=${weekNumberTemplate}
              weekNumberType=${weekNumberType}
            ></date-picker-calendar>`
            : html`<modal-date-picker-year-grid
              ${ref(this.#yearGridRef)}
              .max=${max}
              .min=${min}
              .onYearUpdate=${this.#onYearUpdate}
              locale=${locale}
              selectedYearTemplate=${selectedYearTemplate}
              toyearTemplate=${toyearTemplate}
              value=${valueValue}
            ></modal-date-picker-year-grid>`
        }</div>
      </form>

      ${renderActions({ confirmText, denyText, formId, slot: 'actions' })}
    </md-dialog>
    `;
  }

  async reset(): Promise<boolean> {
    // await (this.#bodyRef.value as ModalDatePickerBody).reset();
    this._focusedDate = toResolvedDate(this.value);
    return this.updateComplete;
  }

  show(): Promise<void> {
    return (this.#dialogRef.value as MdDialog).show();
  }

  showPicker(): ReturnType<typeof this.show> {
    return this.show();
  }

  protected override updated(changedProperties: PropertyValueMap<this>): void {
    this.#focusSelectedYear(changedProperties);
    this.#updateFocusOnViewChange(changedProperties);
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#updateFocusedDateByValue(changedProperties);
  }

  get returnValue(): ModalDatePickerProperties['returnValue'] {
    return (this.#dialogRef.value as MdDialog).returnValue;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerName]: ModalDatePicker;
  }
}

// fixme: tabindex=0 does not get updated when changing min
// fixme: selected date but close modal without confirming should not update selected date
