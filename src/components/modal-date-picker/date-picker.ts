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
import { createRef, ref } from 'lit/directives/ref.js';

import {
  dateFormatOptions,
  labelConfirm,
  labelDeny,
  longMonthYearFormatOptions,
  renderNoop,
} from '../../constants.js';
import { DatesController } from '../../controllers/dates-controller/dates-controller.js';
import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { iconChevronLeft, iconChevronRight, iconEdit } from '../../icons.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin/date-picker-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin/min-max-mixin.js';
import { StartViewMixin } from '../../mixins/start-view-mixin/start-view-mixin.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { renderActions } from '../../templates/render-actions/render-actions.js';
import { renderMenuButton } from '../../templates/render-menu-button/render-menu-button.js';
import { renderCalendarDay } from '../app-calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../app-calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../app-calendar/types.js';
import type { DatePickerProperties } from './types.js';
import type { ModalDatePickerYearGrid } from './year-grid/modal-date-picker-year-grid.js';
import type { YearGridProperties } from './year-grid/types.js';

export class DatePicker
  extends DatePickerMixin(MinMaxMixin(StartViewMixin(ValueMixin(RootElement))))
  implements DatePickerProperties
{
  #$dialog = createRef<MdDialog>();

  #didConfirmByKey = false;

  #focusSelectedYear = async (): Promise<void> => {
    const yearGridElement = this.#yearGridRef.value;

    if (yearGridElement) {
      await yearGridElement.updateComplete;
      yearGridElement.focusYearWhenNeeded();
    }
  };

  #onCancel = (ev: CustomEvent<object>) => {
    this.#onClose(ev);
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
    } else {
      this.reset();
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
      focusedDate: toUTCDate(_$dates_.focusedDate, { month: 1 }),
    });
  };

  #onOpen = (ev: CustomEvent<object>) => {
    this._open = true;
    this.#propagateCustomEvent(ev);
  };

  #onOpened = (ev: CustomEvent<object>) => {
    this.#propagateCustomEvent(ev);
  };

  #onPrevClick = () => {
    const { _$dates_ } = this;

    _$dates_.updateBy({
      focusedDate: toUTCDate(_$dates_.focusedDate, { month: -1 }),
    });
  };

  #onYearUpdate: NonNullable<YearGridProperties['onYearUpdate']> = (year) => {
    const { _$dates_ } = this;

    _$dates_.updateBy({
      focusedDate: fromPartsToUtcDate(
        year,
        _$dates_.focusedDate.getUTCMonth(),
        _$dates_.focusedDate.getUTCDate()
      ),
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

  @state() _formatters!: DatePickerProperties['_formatters'];

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
    new PropertyChangeController(this, {
      onUpdate: (_, locale) => {
        this._formatters = {
          dateFormat: new Intl.DateTimeFormat(locale, dateFormatOptions),
          longMonthYearFormat: new Intl.DateTimeFormat(
            locale,
            longMonthYearFormatOptions
          ),
        };
      },
      order: 'update',
      property: 'locale',
    });
  }

  close(returnValue?: DatePickerProperties['returnValue']): Promise<void> {
    return this.#$dialog.value?.close(returnValue) as Promise<void>;
  }

  protected override render(): TemplateResult {
    const {
      _$dates_,
      _formatters,
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
    const { dateFormat, longMonthYearFormat } = _formatters;

    const focusedValue = toDateString(focusedDate);
    const formId = id || 'modalDatePicker';
    const headline = dateFormat.format(selectedDate);
    const isCalendarView = startView === 'calendar';
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;
    const menuText = longMonthYearFormat.format(focusedDate);
    const showNextButton =
      isCalendarView && !isSameMonth(focusedDate, _maxDate);
    const showPrevButton =
      isCalendarView && !isSameMonth(focusedDate, _minDate);

    return html`
    <md-dialog
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
        _open
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
                  text: menuText,
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
                    .onDateUpdateByClick=${_$dates_.onDateUpdateByClick}
                    .onDateUpdateByKey=${_$dates_.onDateUpdateByKey}
                    .renderCalendarDay=${this.#renderCalendarDay}
                    .renderFooter=${renderNoop}
                    .renderWeekDay=${this.#renderWeekDay}
                    .renderWeekLabel=${renderNoop}
                    .renderWeekNumber=${renderNoop}
                    .value=${focusedValue}
                    chooseMonthLabel=${chooseMonthLabel}
                    chooseYearLabel=${chooseYearLabel}
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
                    weekLabel=${weekLabel}
                    weekNumberTemplate=${weekNumberTemplate}
                    weekNumberType=${weekNumberType}
                  ></app-calendar>`
                  : html`<modal-date-picker-year-grid
                    ${ref(this.#yearGridRef)}
                    .max=${max}
                    .min=${min}
                    .onYearUpdate=${this.#onYearUpdate}
                    .value=${focusedValue}
                    locale=${locale}
                    selectedYearTemplate=${selectedYearTemplate}
                    toyearTemplate=${toyearTemplate}
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
        slot: 'actions',
      })}
    </md-dialog>
    `;
  }

  reset(): void {
    this._$dates_.reset();
  }

  show(): Promise<void> {
    return this.#$dialog.value?.show() as Promise<void>;
  }

  get dialog() {
    return this.#$dialog.value;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  get returnValue() {
    /** NOTE: Do not remove ?. as accessing a custom element too early will result in undefined value */
    return this.#$dialog.value
      ?.returnValue as DatePickerProperties['returnValue'];
  }
}

// fixme: may 31 -> click prev month -> focus on may 1
// fixme: tabindex=0 does not get updated when changing min
//
// done: use app-calendar and datesController, refer to DockedDatePicker
// done: focus last calendar day will cause overflow
// done: selected date but close modal without confirming should not update selected date
// done: selected date changes but deny modal should reset value
