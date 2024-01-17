import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import { html, type PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { renderNoop } from '../constants.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import type { DatePickerProperties } from '../typings.js';
import { datePickerBodyName } from './constants.js';

@customElement(datePickerBodyName)
export class DatePickerBody extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerProperties {
  #focusedDate: Date;

  #onMenuButtonClick = () => {
    this.startView = this.startView === 'calendar' ? 'yearGrid' : 'calendar';
  };

  #onNextIconButtonClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: 1 });
    this.requestUpdate();
  };

  #onPrevIconButtonClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: -1 });
    this.requestUpdate();
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({
    ci,
    data,
    ri,
  }) => {
    return renderCalendarDay({
      data,
      selectedDate: this.#selectedDate,
      tabbableDate: this.#tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ ri, weekday }) => {
    return renderWeekDay(weekday);
  };

  #selectedDate: Date;
  #tabbableDate: Date;
  #todayDate: Date = toResolvedDate();

  constructor() {
    super();

    const { value } = this;

    this.#focusedDate = toResolvedDate(value);
    this.#selectedDate = toResolvedDate(value);
    this.#tabbableDate = toResolvedDate(value);
  }

  protected override render() {
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
      shortWeekLabel,
      showWeekNumber,
      startView,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const date = toResolvedDate(value);
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const menuLabel = startView === 'calendar' ? chooseMonthLabel : chooseYearLabel;

    return html`
    <div class=body>
      <date-picker-body-menu
        .menuLabel=${menuLabel}
        .menuText=${longMonthYearFormat(date)}
        .nextIconButtonLabel=${nextMonthLabel}
        .onMenuButtonClick=${this.#onMenuButtonClick}
        .onNextIconButtonClick=${this.#onNextIconButtonClick}
        .onPrevIconButtonClick=${this.#onPrevIconButtonClick}
        .prevIconButtonLabel=${previousMonthLabel}
      ></date-picker-body-menu>
      <app-calendar
        disabledDates=${disabledDates}
        disabledDays=${disabledDays}
        firstDayOfWeek=${firstDayOfWeek}
        locale=${locale}
        max=${ifDefined(max)}
        min=${ifDefined(min)}
        onClick=${renderNoop}
        onKeydown=${renderNoop}
        onKeyup=${renderNoop}
        .renderCalendarDay=${this.#renderCalendarDay}
        .renderFooter=${renderNoop}
        .renderWeekDay=${this.#renderWeekDay}
        .renderWeekLabel=${renderNoop}
        .renderWeekNumber=${renderNoop}
        shortWeekLabel=${shortWeekLabel}
        ?showweeknumber=${showWeekNumber}
        value=${this.#focusedDate.toJSON()}
        weekLabel=${weekLabel}
        weekNumberTemplate=${weekNumberTemplate}
        weekNumberType=${weekNumberType}
      ></app-calendar>
    </div>
    `;
  }

  protected override updated(_changedProperties: Map<PropertyKey, unknown> | PropertyValueMap<object>): void {
    console.debug(_changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerBodyName]: DatePickerBody;
  }
}
