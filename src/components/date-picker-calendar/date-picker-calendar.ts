import './calendar/app-calendar.js';

import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import {
  confirmKeySet,
  navigationKeySetGrid,
  renderNoop,
} from '../../constants.js';
import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { splitString } from '../../helpers/split-string.js';
import { toNextSelectedDate } from '../../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { keyHome } from '../../key-values.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { DatePickerStartViewMixin } from '../../mixins/date-picker-start-view-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { resetShadowRoot } from '../../styles.js';
import type { InferredFromSet, SupportedKey } from '../../types.js';
import type { AppCalendar } from './calendar/app-calendar.js';
import { renderCalendarDay } from './calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from './calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from './calendar/types.js';
import { datePickerCalendarName } from './constants.js';
import { datePickerCalendarStyles } from './styles.js';
import type { DatePickerCalendarProperties } from './types.js';

@customElement(datePickerCalendarName)
export class DatePickerCalendar
  extends DatePickerStartViewMixin(MinMaxMixin(DatePickerMixin(RootElement)))
  implements DatePickerCalendarProperties
{
  static override styles = [resetShadowRoot, datePickerCalendarStyles];

  #onCalendarUpdated: AppCalendar['onUpdated'] = async () => {
    this.onDateUpdate?.(this._selectedDate);
  };

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> =
    (_ev, node) => {
      this._focusedDate = this._selectedDate = toResolvedDate(
        node.dataset.fulldate
      );
    };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (
    ev,
    _node,
    { disabledDatesSet, disabledDaysSet }
  ) => {
    if (
      navigationKeySetGrid.has(
        ev.key as InferredFromSet<typeof navigationKeySetGrid>
      )
    ) {
      const { _focusedDate, _maxDate, _minDate, _selectedDate } = this;

      const nextDate = toNextSelectedDate({
        currentDate: _focusedDate,
        date: _selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: _maxDate.getTime(),
        minTime: _minDate.getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== _focusedDate.getTime() ||
        nextDateTime !== _selectedDate.getTime()
      ) {
        this._focusedDate = this._selectedDate = nextDate;
      }
    } else if (
      confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)
    ) {
      this.#onCalendarUpdated?.();
    }
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({ data }) => {
    return renderCalendarDay({
      data,
      selectedDate: this._selectedDate,
      tabbableDate: this._tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  readonly #todayDate: Date = toResolvedDate();

  #updateTabbableDate = () => {
    const isWithinSameMonth = isSameMonth(
      this._selectedDate,
      this._focusedDate
    );

    if (isWithinSameMonth) {
      this._tabbableDate = this._selectedDate;
    } else {
      const { _maxDate, _minDate, disabledDates, disabledDays } = this;

      /**
       * NOTE: This reset tabindex of a tab-able calendar day to
       * the first day of month when navigating away from the current month
       * where the focused/ selected date is no longer in the new current month.
       */
      const disabledDateList = splitString(disabledDates, toResolvedDate);
      const disabledDayList = splitString(disabledDays, Number);

      this._tabbableDate = toNextSelectedDate({
        currentDate: this._focusedDate,
        date: this._selectedDate,
        disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
        disabledDaysSet: new Set(disabledDayList),
        hasAltKey: false,
        key: keyHome,
        maxTime: _maxDate.getTime(),
        minTime: _minDate.getTime(),
      });
    }
  };

  @state() _focusedDate: Date;

  @state() _selectedDate: Date;

  @state() _tabbableDate: Date;

  onDateChange?: DatePickerCalendarProperties['onDateChange'];

  onDateUpdate?: DatePickerCalendarProperties['onDateUpdate'];

  constructor() {
    super();

    const { value } = this;

    this._focusedDate =
      this._selectedDate =
      this._tabbableDate =
        toResolvedDate(value);

    new PropertyChangeController(this, {
      onChange: (_, newValue) => {
        this._focusedDate =
          this._selectedDate =
          this._tabbableDate =
            toResolvedDate(newValue);
      },
      property: 'value',
    });
  }

  #notifyDateUpdate(changedProperties: PropertyValueMap<this>): void {
    if (changedProperties.has('_focusedDate')) {
      this.onDateChange?.(this._focusedDate);
    }
  }

  protected override render(): TemplateResult {
    const {
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      shortWeekLabel,
      showWeekNumber,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const value = toResolvedDate(this._focusedDate).toJSON();

    return html`
    <app-calendar
      ?showWeekNumber=${showWeekNumber}
      .max=${max}
      .min=${min}
      .onDateUpdateByClick=${this.#onDateUpdateByClick}
      .onDateUpdateByKey=${this.#onDateUpdateByKey}
      .onUpdated=${this.#onCalendarUpdated}
      .renderCalendarDay=${this.#renderCalendarDay}
      .renderFooter=${renderNoop}
      .renderWeekDay=${this.#renderWeekDay}
      .renderWeekLabel=${renderNoop}
      .renderWeekNumber=${renderNoop}
      disabledDates=${disabledDates}
      disabledDays=${disabledDays}
      firstDayOfWeek=${firstDayOfWeek}
      locale=${locale}
      shortWeekLabel=${shortWeekLabel}
      value=${value}
      weekLabel=${weekLabel}
      weekNumberTemplate=${weekNumberTemplate}
      weekNumberType=${weekNumberType}
    ></app-calendar>
    `;
  }

  async reset(): Promise<boolean> {
    this._focusedDate = this._selectedDate = toResolvedDate(this.value);

    return this.updateComplete;
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#updateTabbableDate();
    this.#notifyDateUpdate(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerCalendarName]: DatePickerCalendar;
  }
}
