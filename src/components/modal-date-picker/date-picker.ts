import '@material/web/dialog/dialog.js';
import '@material/web/iconbutton/icon-button.js';
import '../app-calendar/app-calendar.js';
import '../md-svg/md-svg.js';
import './year-grid/modal-date-picker-year-grid.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import type { MdIconButton } from '@material/web/iconbutton/icon-button.js';
import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { dateFormatOptions, labelConfirm, labelDeny, renderNoop } from '../../constants.js';
import { DatesController } from '../../controllers/dates-controller/dates-controller.js';
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
import { renderMenuButton } from '../../render-helpers/render-menu-button/render-menu-button.js';
import { RootElement } from '../../root-element/root-element.js';
import { renderCalendarDay } from '../app-calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../app-calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../app-calendar/types.js';
import type {
  DatePickerProperties,
} from './types.js';
import type { ModalDatePickerYearGrid } from './year-grid/modal-date-picker-year-grid.js';
import type { YearGridProperties } from './year-grid/types.js';

export class DatePicker
  extends DatePickerMixin(
    DatePickerStartViewMixin(MinMaxMixin(ValueMixin(RootElement)))
  )
  implements DatePickerProperties
{
  #$dialog: Ref<MdDialog> = createRef();

  #didConfirmByKey = false;

  #focusSelectedYear = async (): Promise<void> => {
    const yearGridElement = this.#yearGridRef.value;

    if (yearGridElement) {
      await yearGridElement.updateComplete;
      yearGridElement.focusYearWhenNeeded();
    }
  };

  #onCancel = (ev: CustomEvent<object>) => {
    this._open = false;
    this.#propagateCustomEvent(ev);
  };

  #onClose = (ev: CustomEvent<object>) => {
    this._open = false;
    this.#propagateCustomEvent(ev);
  };

  #onClosed = (ev: CustomEvent<object>) => {
    if (
      this.#didConfirmByKey ||
      this.#$dialog.value?.returnValue === 'confirm'
    ) {
      // todo: add custom formatter
      this.value = toDateString(this._$dates_.focusedDate);
      this.#didConfirmByKey = false;
    }

    this.#propagateCustomEvent(ev);
  };

  #onIconButtonClick: MdIconButton['onclick'] = () => {
    /** fixme: this require new M3 TextField component to edit date */
  };

  #onMenuClick = () => {
    this.startView = this.startView === 'calendar' ? 'yearGrid' : 'calendar';
  };

  #onNextClick = () => {
    const { _$dates_ } = this;

    _$dates_.updateBy({
      focusedDate: toUTCDate(_$dates_.focusedDate, { month: 1 })
    });
  };

  #onOpen = (ev: CustomEvent<object>) => {
    this.open = true;
    this.#propagateCustomEvent(ev);
  };

  #onOpened = (ev: CustomEvent<object>) => {
    this.#propagateCustomEvent(ev);
  };

  #onPrevClick = () => {
    const { _$dates_ } = this;

    _$dates_.updateBy({
      focusedDate: toUTCDate(_$dates_.focusedDate, { month: -1 })
    });
  };

  #onYearUpdate: NonNullable<YearGridProperties['onYearUpdate']> = (year) => {
    const { _$dates_ } = this;

    _$dates_.updateBy({
      focusedDate: fromPartsToUtcDate(
        year,
        _$dates_.focusedDate.getUTCMonth(),
        _$dates_.focusedDate.getUTCDate()
      )
    });
    this.startView = 'calendar';
  };

  #propagateCustomEvent = (ev: CustomEvent<object>) => {
    this.fire({ detail: ev.detail, type: ev.type });
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({ data }) => {
    const { _$dates_ } = this;

    return renderCalendarDay({
      data,
      selectedDate: _$dates_.selectedDate,
      tabbableDate: _$dates_.tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  readonly #todayDate = toResolvedDate();

  #yearGridRef = createRef<ModalDatePickerYearGrid>();
  private _$dates_ = new DatesController(this, {
    onConfirmByKey: (ev) => {
      this.#didConfirmByKey = true;
      this.#onClose(ev as unknown as CustomEvent<object>);
    },
  });

  @state() _iconDirection: DatePickerProperties['_iconDirection'] = 'down';

  @state() private _open = false;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property() type?: MdDialog['type'];

  constructor() {
    super();

    new PropertyChangeController(this, {
      onUpdate: (_, newValue) => {
        const newDate = toResolvedDate(newValue);

        this._$dates_.updateBy({
          focusedDate: newDate,
          selectedDate: newDate,
        });
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

  close() {
    this._open = false;
  }

  protected override render(): TemplateResult {
    const {
      _$dates_,
      _iconDirection,
      _maxDate,
      _minDate,
      _open,
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
    const { focusedDate, selectedDate } = _$dates_;

    const formId = id || 'modalDatePicker';
    const headline = new Intl.DateTimeFormat(locale, dateFormatOptions).format(
      selectedDate
    );

    const isCalendarView = startView === 'calendar';
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;
    const showNextButton =
      isCalendarView && !isSameMonth(focusedDate, _maxDate);
    const showPrevButton =
      isCalendarView && !isSameMonth(focusedDate, _minDate);
    const valueValue = toDateString(focusedDate);

    return html`
    <md-dialog
      ?open=${_open}
      @cancel=${this.#onCancel}
      @close=${this.#onClose}
      @closed=${this.#onClosed}
      @open=${this.#onOpen}
      @opened=${this.#onOpened}
      ${ref(this.#$dialog)}
      class=dialog
      type=${ifDefined(type)}
    >
      ${
        this.open
          ? html`
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
                  text: longMonthYearFormat(focusedDate),
                  type: 'button',
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
                  ? html`<app-calendar
                    ?showWeekNumber=${showWeekNumber}
                    .max=${max}
                    .min=${min}
                    .onDateUpdateByClick=${this._$dates_.onDateUpdateByClick}
                    .onDateUpdateByKey=${this._$dates_.onDateUpdateByKey}
                    .renderCalendarDay=${this.#renderCalendarDay}
                    .renderFooter=${renderNoop}
                    .renderWeekDay=${this.#renderWeekDay}
                    .renderWeekLabel=${renderNoop}
                    .renderWeekNumber=${renderNoop}
                    chooseMonthLabel=${chooseMonthLabel}
                    chooseYearLabel=${chooseYearLabel}
                    class=body
                    disabledDates=${disabledDates}
                    disabledDays=${disabledDays}
                    firstDayOfWeek=${firstDayOfWeek}
                    locale=${locale}
                    nextMonthLabel=${nextMonthLabel}
                    previousMonthLabel=${previousMonthLabel}
                    selectDateLabel=${selectDateLabel}
                    selectedDateLabel=${selectedDateLabel}
                    selectedYearTemplate=${selectedYearTemplate}
                    shortWeekLabel=${shortWeekLabel}
                    todayLabel=${todayLabel}
                    toyearTemplate=${toyearTemplate}
                    value=${valueValue}
                    weekLabel=${weekLabel}
                    weekNumberTemplate=${weekNumberTemplate}
                    weekNumberType=${weekNumberType}
                  ></app-calendar>`
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
            `
          : nothing
      }

      ${renderActions({
        confirmText,
        denyText,
        formId,
        slot: 'actions'
      })}
    </md-dialog>
    `;
  }

  async reset(): Promise<boolean> {
    const { _$dates_, updateComplete, value } = this;

    _$dates_.updateBy({
      focusedDate: toResolvedDate(value),
    });

    return updateComplete;
  }

  async show() {
    this._open = true;
  }

  showPicker() {
    this.show();
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  get returnValue() {
    /** NOTE: Do not remove ?. as accessing a custom element too early will result in undefined value */
    return (this.#$dialog.value as MdDialog)?.returnValue as DatePickerProperties['returnValue'];
  }
}

// fixme: focus last calendar day will cause overflow
// fixme: may 31 -> click prev month -> focus on may 1
// fixme: use app-calendar and datesController, refer to DockedDatePicker
// fixme: tabindex=0 does not get updated when changing min
// fixme: selected date but close modal without confirming should not update selected date
