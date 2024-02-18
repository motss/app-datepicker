import '../calendar/app-calendar.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../modal-date-picker-body-menu/modal-date-picker-body-menu.js';
import '../modal-date-picker-year-grid/modal-date-picker-year-grid.js';

import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdTextButton } from '@material/web/button/text-button.js';
import { html, type PropertyValueMap } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import type { DatePickerCalendarProperties } from '../date-picker-calendar/types.js';
import { isSameMonth } from '../helpers/is-same-month.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { ModalDatePickerBodyMenu } from '../modal-date-picker-body-menu/modal-date-picker-body-menu.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import { defaultDate, modalDatePickerBodyName } from './constants.js';
import { modalDatePickerBody_datePickerBodyStyle } from './styles.js';
import type { ModalDatePickerBodyProperties } from './types.js';

@customElement(modalDatePickerBodyName)
export class ModalDatePickerBody extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements ModalDatePickerBodyProperties {
  static override styles = [
    resetShadowRoot,
    baseStyling,
    modalDatePickerBody_datePickerBodyStyle,
  ];

  #bodyMenuRef: Ref<ModalDatePickerBodyMenu> = createRef();

  #maxDate: Date = defaultDate;

  #minDate: Date = defaultDate;

  #onDateUpdate: DatePickerCalendarProperties['onDateUpdate'] = (selectedDate) => {
    this.onDateUpdate?.(selectedDate);
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

  #updateFocusOnViewChange = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('startView')) {
      const { startView } = this;

      if (changedProperties.get('startView') !== startView) {
        const menuButton = this.#bodyMenuRef.value?.root.querySelector('.menuButton') as MdTextButton | null;
        menuButton?.focus();
      }
    }
  };

  #updateFocusedDate = (date: Date) => {
    this._focusedDate = toResolvedDate(date);
  };

  #updateFocusedDateByValue = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('value') && this.value !== changedProperties.get('value')) {
      this.#updateFocusedDate(toResolvedDate(this.value));
    }
  };

  #updateMinMax = (changedProperties: PropertyValueMap<this>) => {
    const { max, min } = this;

    if (changedProperties.has('max') && max !== changedProperties.get('max')) {
      this.#maxDate = toResolvedDate(max);
    }

    if (changedProperties.has('min') && min !== changedProperties.get('min')) {
      this.#minDate = toResolvedDate(min);
    }
  };

  #updateStartView = () => {
    this.startView = 'calendar';
  };

  @state() _focusedDate: Date = defaultDate;

  onDateUpdate?: ModalDatePickerBodyProperties['onDateUpdate'];

  protected override render() {
    const {
      _focusedDate,
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
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      toyearTemplate,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const focusedDateValue = _focusedDate.toJSON();
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const isCalendarView = startView === 'calendar';
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;
    const showNextButton = isCalendarView && !isSameMonth(_focusedDate, this.#maxDate);
    const showPrevButton = isCalendarView && !isSameMonth(_focusedDate, this.#minDate);

    return html`
    <div class=datePickerBody>
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

      <date-picker-calendar
        class=body
        disabledDates=${disabledDates}
        disabledDays=${disabledDays}
        firstDayOfWeek=${firstDayOfWeek}
        locale=${locale}
        max=${ifDefined(max)}
        min=${ifDefined(min)}
        selectedYearTemplate=${selectedYearTemplate}
        shortWeekLabel=${shortWeekLabel}
        startView=${this.startView}
        toyearTemplate=${toyearTemplate}
        value=${focusedDateValue}
        weekLabel=${weekLabel}
        weekNumberTemplate=${weekNumberTemplate}
        weekNumberType=${weekNumberType}
        .onDateChange=${this.#updateFocusedDate}
        .onDateUpdate=${this.#onDateUpdate}
        .onYearUpdate=${this.#updateStartView}
        ?showWeekNumber=${showWeekNumber}
      ></date-picker-calendar>
    </div>
    `;
  }

  async reset() {
    this._focusedDate = toResolvedDate(this.value);
    return this.updateComplete;
  }

  protected override updated(changedProperties: PropertyValueMap<this>): void {
    this.#updateFocusOnViewChange(changedProperties);
  }

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#updateFocusedDateByValue(changedProperties);
    this.#updateMinMax(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerBodyName]: ModalDatePickerBody;
  }
}
