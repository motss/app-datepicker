import { calendar } from '@ipohjs/calendar';
import type {
  CalendarGrid,
  CalendarWeekday,
} from '@ipohjs/calendar/dist/typings.js';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import {
  dayFormatOptions,
  emptyReadonlyArray,
  fullDateFormatOptions,
  longWeekDayFormatOptions,
  narrowWeekDayFormatOptions,
  navigationKeySetGrid,
} from '../../constants.js';
import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { splitString } from '../../helpers/split-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import type { InferredFromSet } from '../../types.js';
import type { CalendarDayElement, CalendarProperties } from './types.js';

function requiredFn(message: string): TemplateResult | typeof nothing {
  throw new Error(message);
}

function requiredFnForWeekNumber<
  T extends Pick<CalendarProperties, 'showWeekNumber'>,
>(that: T, message: string): TemplateResult | typeof nothing {
  if (that.showWeekNumber) {
    return requiredFn(message);
  }

  return nothing;
}

export class Calendar
  extends DatePickerMixin(MinMaxMixin(ValueMixin(RootElement)))
  implements CalendarProperties
{
  #findSelectableCalendarDayNode = (ev: UIEvent) => {
    const path = ev.composedPath() as HTMLElement[];
    const node = path.find((n) => {
      return (
        n.nodeType === Node.ELEMENT_NODE &&
        n.classList.contains('calendarDayButton') &&
        n.getAttribute('aria-disabled') !== 'true'
      );
    }) as CalendarDayElement | null;

    return node;
  };

  #focusDateWhenNeeded = async () => {
    if (this.#shouldFocusDate) {
      const { value } = this;
      const dayText = toResolvedDate(value).getUTCDate();

      /**
       * NOTE: `lit` requires more time to re-render the `.calendarDayButton`
       * when `value` changes. Overriding `getUpdateComplete()` does not have
       * any effect as of writing. This will be revisited later.
       */
      await this.updateComplete;

      this.query(`.calendarDayButton[data-day="${dayText}"]`)?.focus();
      this.#shouldFocusDate = false;
      /**
       * NOTE: Not sure if this is still needed. To revisit this later.
       */
      this.onUpdated?.();
    }
  };

  #onClickOrKeyUp =
    <T extends 'click' | 'key'>(calendarGrid: CalendarGrid) =>
    (ev: T extends 'click' ? MouseEvent : KeyboardEvent) => {
      const node = this.#findSelectableCalendarDayNode(ev);

      if (node) {
        const typedEvent = ev as
          | (KeyboardEvent & { type: `key${string}` })
          | (MouseEvent & { type: 'click' });

        if (typedEvent.type === 'click') {
          this.onDateUpdateByClick?.(typedEvent, node, calendarGrid);
        }

        if (typedEvent.type === 'keyup') {
          this.onDateUpdateByKey?.(typedEvent, node, calendarGrid);
        }
      }
    };

  #onKeyDown = (ev: KeyboardEvent) => {
    const { key } = ev;

    const isNavigationKey = navigationKeySetGrid.has(
      key as InferredFromSet<typeof navigationKeySetGrid>
    );

    if (isNavigationKey) {
      /**
       * NOTE: this prevents keyboard event propagates upwards and
       * causes a scrollable page to be scrolled downwards via the Space key.
       */
      ev.preventDefault();

      const node = this.#findSelectableCalendarDayNode(ev);

      if (node) {
        this.#shouldFocusDate = true;
      }
    }
  };

  #onMouseDown = (ev: MouseEvent) => {
    const node = this.#findSelectableCalendarDayNode(ev);

    if (node) {
      this.#shouldFocusDate = true;
    }
  };

  #renderCalendar = (): TemplateResult => {
    const {
      _formatters: {
        dayFormat,
        fullDateFormat,
        longWeekdayFormat,
        narrowWeekdayFormat,
      },
      _maxDate,
      _minDate,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      renderCalendarDay,
      renderFooter,
      renderWeekDay,
      renderWeekLabel,
      renderWeekNumber,
      shortWeekLabel,
      showWeekNumber,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const date = toResolvedDate(value);

    const calendarGrid = calendar({
      date,
      dayFormat,
      disabledDates: splitString(disabledDates, toResolvedDate),
      disabledDays: splitString(disabledDays, Number),
      firstDayOfWeek,
      fullDateFormat,
      locale,
      max: _maxDate,
      min: _minDate,
      showWeekNumber,
      weekNumberTemplate,
      weekNumberType,
    });
    const { datesGrid } = calendarGrid;
    const maybeWeekdaysWithWeekLabel = getWeekdays({
      firstDayOfWeek,
      longWeekdayFormat,
      narrowWeekdayFormat,
      shortWeekLabel,
      showWeekNumber,
      weekLabel,
    });
    const [weekNumber, ...weekdays] = [
      ...(showWeekNumber
        ? (emptyReadonlyArray as readonly CalendarWeekday[])
        : ([{ label: '', value: '' }] as [CalendarWeekday])),
      ...maybeWeekdaysWithWeekLabel,
    ];

    const caption = fullDateFormat.format(date);

    return html`
    <table
      class=calendar
      @click=${this.#onClickOrKeyUp<'click'>(calendarGrid)}
      @keydown=${this.#onKeyDown}
      @keyup=${this.#onClickOrKeyUp<'key'>(calendarGrid)}
      @mousedown=${this.#onMouseDown}
      tabindex=-1
      role=grid
    >
      <!-- february 2020 -->
      <caption class="sr-only">${caption}</caption>

      <colgroup>${weekNumber?.value ? html`<col />` : nothing}
        ${map(weekdays, () => html`<col />`)}
      </colgroup>

      <!-- Wk | S M T W T F S -->
      <thead>
        <tr>
          ${
            weekNumber?.value
              ? renderWeekLabel?.({
                  label: weekLabel,
                  value: shortWeekLabel,
                })
              : nothing
          }
          ${map(weekdays, (weekday, ri) => {
            return renderWeekDay({ ri, weekday });
          })}
        </tr>
      </thead>

      <!-- 1 | x x x 1 2  3  4 -->
      <!-- 2 | 5 6 7 8 9 10 11 -->
      <tbody>
        ${map(datesGrid, (row, ri) => {
          return html`
            <tr>
              ${map(row.columns, (data, ci) => {
                const isWeekNumber = ci === 0 && showWeekNumber;

                return (isWeekNumber ? renderWeekNumber : renderCalendarDay)?.({
                  ci,
                  data,
                  ri,
                });
              })}
            </tr>
            `;
        })}
      </tbody>

      <tfoot>${renderFooter?.()}</tfoot>
    </table>
    `;
  };

  #shouldFocusDate = false;

  @state() _formatters!: CalendarProperties['_formatters'];

  @property({ attribute: false })
  onDateUpdateByClick: CalendarProperties['onDateUpdateByClick'];

  @property({ attribute: false })
  onDateUpdateByKey: CalendarProperties['onDateUpdateByKey'];

  @property({ attribute: false }) onUpdated?: CalendarProperties['onUpdated'];

  @property({ attribute: false })
  renderCalendarDay: CalendarProperties['renderCalendarDay'] = () =>
    requiredFn('renderCalendar is not defined');

  @property({ attribute: false })
  renderFooter: CalendarProperties['renderFooter'];

  @property({ attribute: false })
  renderWeekDay: CalendarProperties['renderWeekDay'] = () =>
    requiredFn('renderWeekday is not defined');

  @property({ attribute: false })
  renderWeekLabel: CalendarProperties['renderWeekLabel'] = () =>
    requiredFnForWeekNumber(this, 'renderWeekLabel is not defined');

  @property({ attribute: false })
  renderWeekNumber: CalendarProperties['renderWeekNumber'] = () =>
    requiredFnForWeekNumber(this, 'renderWeekNumber is not defined');

  constructor() {
    super();

    new PropertyChangeController(this, {
      onUpdate: (_, locale) => {
        this._formatters = {
          dayFormat: new Intl.DateTimeFormat(locale, dayFormatOptions),
          fullDateFormat: new Intl.DateTimeFormat(
            locale,
            fullDateFormatOptions
          ),
          longWeekdayFormat: new Intl.DateTimeFormat(
            locale,
            longWeekDayFormatOptions
          ),
          narrowWeekdayFormat: new Intl.DateTimeFormat(
            locale,
            narrowWeekDayFormatOptions
          ),
        };
      },
      order: 'update',
      property: 'locale',
    });
    new PropertyChangeController(this, {
      onUpdated: this.#focusDateWhenNeeded,
      order: 'updated',
      property: 'value',
    });
  }

  protected override render(): TemplateResult | typeof nothing {
    return this.#renderCalendar();
  }
}
