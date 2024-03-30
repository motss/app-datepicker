import '@material/web/dialog/dialog.js';
import '@material/web/iconbutton/icon-button.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../md-svg/md-svg.js';
import './year-grid/modal-date-picker-year-grid.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import type { MdIconButton } from '@material/web/iconbutton/icon-button.js';
import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { dateFormatOptions, labelConfirm, labelDeny } from '../../constants.js';
import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { iconChevronLeft, iconChevronRight, iconEdit } from '../../icons.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { DatePickerStartViewMixin } from '../../mixins/date-picker-start-view-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { renderActions } from '../../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../../render-helpers/render-actions/styles.js';
import { renderMenuButton } from '../../render-helpers/render-menu-button/render-menu-button.js';
import { RootElement } from '../../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../../styles.js';
import type { DatePickerCalendarProperties } from '../date-picker-calendar/types.js';
import { modalDatePickerName } from './constants.js';
import { modalDatePickerStyles } from './styles.js';
import type {
  ModalDatePickerProperties,
  ModalDatePickerPropertiesReturnValue,
} from './types.js';
import type { ModalDatePickerYearGrid } from './year-grid/modal-date-picker-year-grid.js';
import type { YearGridProperties } from './year-grid/types.js';

@customElement(modalDatePickerName)
export class ModalDatePicker
  extends DatePickerMixin(
    DatePickerStartViewMixin(MinMaxMixin(ValueMixin(RootElement)))
  )
  implements ModalDatePickerProperties
{
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerStyles,
    renderActionsStyle,
  ];

  #dialogRef: Ref<MdDialog> = createRef();

  #didDateUpdate = false;

  #focusSelectedYear = async (): Promise<void> => {
    const yearGridElement = this.#yearGridRef.value;

    if (yearGridElement) {
      await yearGridElement.updateComplete;
      yearGridElement.focusYearWhenNeeded();
    }
  };

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

  #onIconButtonClick: MdIconButton['onclick'] = () => {
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
    YearGridProperties['onYearUpdate']
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

  #updateFocusedDate = (date: Date) => {
    this._focusedDate = toResolvedDate(date);
  };

  #updateStartView = () => {
    this.startView = 'calendar';
  };

  #yearGridRef = createRef<ModalDatePickerYearGrid>();

  @state() _focusedDate: Date;

  @state() _iconDirection: ModalDatePickerProperties['_iconDirection'] = 'down';

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property({ type: Boolean }) open: ModalDatePickerProperties['open'];

  @property() type?: MdDialog['type'];

  constructor() {
    super();

    const { value } = this;

    this._focusedDate = toResolvedDate(value);
    // this._focusedDate = this._selectedDate = this._tabbableDate = toResolvedDate(value);

    new PropertyChangeController(this, {
      onUpdate: (_, newValue) => {
        this.#updateFocusedDate(toResolvedDate(newValue));
      },
      order: 'update',
      property: 'value',
    });
    new PropertyChangeController(this, {
      compare: false,
      onUpdated: this.#focusSelectedYear,
      order: 'updated',
      property: 'startView',
    });
  }

  close(returnValue: ModalDatePickerPropertiesReturnValue) {
    return (this.#dialogRef.value as MdDialog).close(returnValue);
  }

  protected override render(): TemplateResult {
    // fixme: move logics from body to here!
    const {
      _focusedDate,
      _iconDirection,
      _maxDate,
      _minDate,
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

    const formId = id || 'modalDatePicker';
    const headline = new Intl.DateTimeFormat(locale, dateFormatOptions).format(
      this.#selectedDate
    );

    const isCalendarView = startView === 'calendar';
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;
    const showNextButton =
      isCalendarView && !isSameMonth(_focusedDate, _maxDate);
    const showPrevButton =
      isCalendarView && !isSameMonth(_focusedDate, _minDate);
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
        <div class=header>
          <p class="supportingText">${selectDateLabel}</p>
          <p class="headline">${headline}</p>
          <!-- fixme: this requires a new view to edit dates -->
          <md-icon-button
            class=iconButton
            hidden
            @click=${this.#onIconButtonClick}
          >
            <md-svg .content=${iconEdit}></md-svg>
          </md-icon-button>
        </div>

        <div class=menu>
          ${renderMenuButton({
            iconDirection: _iconDirection,
            label: menuLabel,
            onClick: this.#onMenuClick,
            text: longMonthYearFormat(_focusedDate),
            type: 'button'
          })}

          ${
            showPrevButton
              ? html`
                <md-icon-button
                  @click=${this.#onPrevClick}
                  aria-label=${previousMonthLabel}
                  class=prevIconButton
                  form=${formId}
                  title=${previousMonthLabel}
                  type=button
                >
                  <md-svg .content=${iconChevronLeft}></md-svg>
                </md-icon-button>`
              : nothing
          }
          ${
            showNextButton
              ? html`
                <md-icon-button
                  @click=${this.#onNextClick}
                  aria-label=${nextMonthLabel}
                  class=nextIconButton
                  form=${formId}
                  title=${nextMonthLabel}
                  type=button
                >
                  <md-svg .content=${iconChevronRight}></md-svg>
                </md-icon-button>`
              : nothing
          }
        </div>

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

  get returnValue(): ModalDatePickerProperties['returnValue'] {
    return (this.#dialogRef.value as MdDialog).returnValue;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerName]: ModalDatePicker;
  }
}

// fixme: may 31 -> click prev month -> focus on may 1
// fixme: use app-calendar and datesController, refer to DockedDatePicker
// fixme: tabindex=0 does not get updated when changing min
// fixme: selected date but close modal without confirming should not update selected date
