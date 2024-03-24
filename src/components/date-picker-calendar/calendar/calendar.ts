import { calendar } from '@ipohjs/calendar';
import type {
  CalendarGrid,
  CalendarWeekday,
} from '@ipohjs/calendar/dist/typings.js';
import { getWeekdays } from '@ipohjs/calendar/get-weekdays';
import { html, nothing, type PropertyValueMap, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

import {
  dayFormatOptions,
  emptyReadonlyArray,
  fullDateFormatOptions,
  longWeekDayFormatOptions,
  narrowWeekDayFormatOptions,
  navigationKeySetGrid,
  renderNoop,
} from '../../../constants.js';
import { PropertyChangeController } from '../../../controllers/property-change-controller/property-change-controller.js';
import { splitString } from '../../../helpers/split-string.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { DatePickerMixin } from '../../../mixins/date-picker-mixin.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../../root-element/root-element.js';
import {
  baseStyling,
  resetShadowRoot,
  resetTableStyle,
  visuallyHiddenStyle,
} from '../../../styles.js';
import type { InferredFromSet } from '../../../types.js';
import { calendarStyles } from './styles.js';
import type { CalendarDayElement, CalendarProperties } from './types.js';

export class Calendar
  extends DatePickerMixin(MinMaxMixin(ValueMixin(RootElement)))
  implements CalendarProperties
{
  public static override shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static override styles = [
    resetShadowRoot,
    resetTableStyle,
    baseStyling,
    visuallyHiddenStyle,
    calendarStyles,
  ];

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

  #focusDateWhenNeeded = async (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('value') && this.#shouldFocusDate) {
      const { value } = this;
      const dayText = toResolvedDate(value).getUTCDate();

      /**
       * note: `lit` requires more time to re-render the `.calendarDayButton`
       * when `value` changes. Overriding `getUpdateComplete()` does not have
       * any effect as of writing. This will be revisited later.
       */
      await this.updateComplete;

      this.query(`.calendarDayButton[data-day="${dayText}"]`)?.focus();
      this.#shouldFocusDate = false;
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
       * note: this prevents keyboard event propagates upwards and
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
        ? (emptyReadonlyArray as CalendarWeekday[])
        : ([{ label: '', value: '' }] as [CalendarWeekday])),
      ...maybeWeekdaysWithWeekLabel,
    ];

    const caption = fullDateFormat.format(date);

    return html`
    <table
      class=calendar
      part=calendar
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
        ${weekdays.map(() => html`<col />`)}
      </colgroup>

      <!-- Wk | S M T W T F S -->
      <thead>
        <tr>
          ${
            weekNumber?.value
              ? (renderWeekLabel ?? renderNoop)({
                  label: weekLabel,
                  value: shortWeekLabel,
                })
              : nothing
          }
          ${weekdays.map((weekday, ri) => {
            return (renderWeekDay ?? renderNoop)({ ri, weekday });
          })}
        </tr>
      </thead>

      <!-- 1 | x x x 1 2  3  4 -->
      <!-- 2 | 5 6 7 8 9 10 11 -->
      <tbody>
        ${datesGrid.map((row, ri) => {
          return html`
            <tr>
              ${row.columns.map((data, ci) => {
                const isWeekNumber = ci === 0 && showWeekNumber;

                return (
                  (isWeekNumber ? renderWeekNumber : renderCalendarDay) ??
                  renderNoop
                )({ ci, data, ri });
              })}
            </tr>
            `;
        })}
      </tbody>

      <tfoot>${(renderFooter ?? renderNoop)()}</tfoot>
    </table>
    `;
  };

  #shouldFocusDate = false;

  @state() _formatters!: CalendarProperties['_formatters'];
  @state() onDateUpdateByClick: CalendarProperties['onDateUpdateByClick'];
  @state() onDateUpdateByKey: CalendarProperties['onDateUpdateByKey'];
  onUpdated?: CalendarProperties['onUpdated'];
  @state() renderCalendarDay: CalendarProperties['renderCalendarDay'];
  @state() renderFooter: CalendarProperties['renderFooter'];
  @state() renderWeekDay: CalendarProperties['renderWeekDay'];
  @state() renderWeekLabel: CalendarProperties['renderWeekLabel'];
  @state() renderWeekNumber: CalendarProperties['renderWeekNumber'];

  constructor() {
    super();

    new PropertyChangeController(this, {
      onChange: (_, locale) => {
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
      property: 'locale',
    });
  }

  protected override render(): TemplateResult | typeof nothing {
    return this.#renderCalendar();
  }

  protected override async updated(
    changedProperties: PropertyValueMap<this>
  ): Promise<void> {
    await this.#focusDateWhenNeeded(changedProperties);
  }
}
