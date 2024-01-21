import '../calendar/app-calendar.js';
import '../date-picker-body-menu/date-picker-body-menu.js';
import '../year-grid/year-grid.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdTextButton } from '@material/web/button/text-button.js';
import { html, type PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { navigationKeySetGrid, renderNoop } from '../constants.js';
import type { DatePickerBodyMenu } from '../date-picker-body-menu/date-picker-body-menu.js';
import { isSameMonth } from '../helpers/is-same-month.js';
import { splitString } from '../helpers/split-string.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { DatePickerProperties, InferredFromSet, SupportedKey } from '../typings.js';
import type { YearGridProperties } from '../year-grid/types.js';
import { datePickerBodyName } from './constants.js';
import { datePickerBodyStyle } from './styles.js';

@customElement(datePickerBodyName)
export class DatePickerBody extends DatePickerMinMaxMixin(DatePickerMixin(RootElement)) implements DatePickerProperties {
  static override styles = [
    resetShadowRoot,
    baseStyling,
    datePickerBodyStyle,
  ];

  #focusedDate: Date;

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> = (ev) => {
    const path = ev.composedPath() as HTMLElement[];
    const node = path.find(n => {
      return (
        n.nodeType === Node.ELEMENT_NODE &&
        n.localName === 'td' &&
        !n.classList.contains('calendarDay--none')
      );
    }) as HTMLTableCellElement;

    if (node) {
      this.#selectedDate = new Date(node.fullDate as Date);
      this.requestUpdate();
    }
  };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (ev, { disabledDatesSet, disabledDaysSet }) => {
    if (navigationKeySetGrid.has(ev.key as InferredFromSet<typeof navigationKeySetGrid>)) {
      const nextDate = toNextSelectedDate({
        currentDate: this.#focusedDate,
        date: this.#selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: toResolvedDate(this.max).getTime(),
        minTime: toResolvedDate(this.min).getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== this.#focusedDate.getTime() ||
        nextDateTime !== this.#selectedDate.getTime()
      ) {
        this.#focusedDate = this.#selectedDate = nextDate;
        this.requestUpdate();
      }
    }
  };

  #onMenuClick = () => {
    this.startView = this.startView === 'calendar' ? 'yearGrid' : 'calendar';
  };

  #onNextClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: 1 });
    this.requestUpdate();
  };

  #onPrevClick = () => {
    this.#focusedDate = toUTCDate(this.#focusedDate, { month: -1 });
    this.requestUpdate();
  };

  #onYearUpdate: NonNullable<YearGridProperties['onYearUpdate']> = (year) => {
    const focusedDate = toResolvedDate(this.#focusedDate);

    this.#focusedDate = fromPartsToUtcDate(year, focusedDate.getUTCMonth(), focusedDate.getUTCDate());
    this.startView = 'calendar';
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

  #updateFocusOnViewChange = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('startView')) {
      const { startView } = this;

      if (changedProperties.get('startView') !== startView) {
        const menuButton = this.bodyMenuRef.value?.root.querySelector('.menuButton') as MdTextButton | null;
        menuButton?.focus();
      }
    }
  };

  #updateTabbableDate = () => {
    const {
      disabledDates,
      disabledDays,
      max,
      min,
    } = this;
    const isWithinSameMonth = isSameMonth(this.#selectedDate, this.#focusedDate);

    /**
     * NOTE: This reset tabindex of a tab-able calendar day to
     * the first day of month when navigating away from the current month
     * where the focused/ selected date is no longer in the new current month.
     */
    const disabledDateList = splitString(disabledDates, toResolvedDate);
    const disabledDayList = splitString(disabledDays, Number);
    const maxDateTime = toResolvedDate(max);
    const minDateTime = toResolvedDate(min);

    this.#tabbableDate = isWithinSameMonth
      ? this.#selectedDate
      : toNextSelectedDate({
          currentDate: this.#focusedDate,
          date: this.#selectedDate,
          disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
          disabledDaysSet: new Set(disabledDayList),
          hasAltKey: false,
          key: keyHome,
          maxTime: maxDateTime.getTime(),
          minTime: minDateTime.getTime(),
        });
  };

  bodyMenuRef: Ref<DatePickerBodyMenu> = createRef();

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
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      toyearTemplate,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;
    const fd = this.#focusedDate;

    const focusedDateValue = fd.toJSON();
    const longMonthYearFormat = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format;
    const isCalendarView = startView === 'calendar';
    const menuLabel = isCalendarView ? chooseMonthLabel : chooseYearLabel;

    // fixme: show and hide buttons when calendar reaches min or max
    const showNextButton = isCalendarView;
    const showPrevButton = isCalendarView;

    return html`
    <div class=datePickerBody>
      <date-picker-body-menu
        ${ref(this.bodyMenuRef)}
        class=menu
        menuLabel=${menuLabel}
        menuText=${longMonthYearFormat(fd)}
        nextIconButtonLabel=${nextMonthLabel}
        .onMenuClick=${this.#onMenuClick}
        .onNextClick=${this.#onNextClick}
        .onPrevClick=${this.#onPrevClick}
        .prevIconButtonLabel=${previousMonthLabel}
        ?showNextButton=${showNextButton}
        ?showPrevButton=${showPrevButton}
      ></date-picker-body-menu>

      ${
        this.startView === 'calendar' ? html`
        <app-calendar
          class=body
          disabledDates=${disabledDates}
          disabledDays=${disabledDays}
          firstDayOfWeek=${firstDayOfWeek}
          locale=${locale}
          max=${ifDefined(max)}
          min=${ifDefined(min)}
          .onDateUpdateByClick=${this.#onDateUpdateByClick}
          .onDateUpdateByKey=${this.#onDateUpdateByKey}
          .renderCalendarDay=${this.#renderCalendarDay}
          .renderFooter=${renderNoop}
          .renderWeekDay=${this.#renderWeekDay}
          .renderWeekLabel=${renderNoop}
          .renderWeekNumber=${renderNoop}
          shortWeekLabel=${shortWeekLabel}
          ?showWeekNumber=${showWeekNumber}
          value=${focusedDateValue}
          weekLabel=${weekLabel}
          weekNumberTemplate=${weekNumberTemplate}
          weekNumberType=${weekNumberType}
        ></app-calendar>
        ` : html`
        <year-grid
          class=body
          locale=${locale}
          max=${ifDefined(max)}
          min=${ifDefined(min)}
          selectedYearTemplate=${selectedYearTemplate}
          toyearTemplate=${toyearTemplate}
          value=${focusedDateValue}
          .onYearUpdate=${this.#onYearUpdate}
        ></year-grid>
        `
      }
    </div>
    `;
  }

  protected override updated(changedProperties: PropertyValueMap<this>): void {
    this.#updateFocusOnViewChange(changedProperties);
  }

  protected override willUpdate(_changedProperties: Map<PropertyKey, unknown> | PropertyValueMap<this>): void {
    this.#updateTabbableDate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [datePickerBodyName]: DatePickerBody;
  }
}
