import type { nothing, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { MAX_DATE, navigationKeySetGrid } from '../constants.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { focusElement } from '../helpers/focus-element.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toYearList } from '../helpers/to-year-list.js';
import { baseStyling, resetButton, resetShadowRoot } from '../stylings.js';
import type { Formatters, InferredFromSet } from '../typings.js';
import { yearGridStyling } from './stylings.js';
import { toNextSelectedYear } from './to-next-selected-year.js';
import type { YearGridChangedProperties, YearGridData, YearGridProperties } from './typings.js';

export class YearGrid extends LitElement implements YearGridProperties {
  @property({ attribute: false })
  public data?: YearGridData;

  @queryAsync('button[data-year][aria-selected="true"]')
  public selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  @state()
  protected $focusingYear: number;

  public static override styles = [
    baseStyling,
    resetButton,
    resetShadowRoot,
    yearGridStyling,
  ];

  #selectedYear: number;
  #todayYear: number;

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this.data = {
      date: todayDate,
      formatters: undefined,
      max: MAX_DATE,
      min: todayDate,
    };

    this.$focusingYear =
    this.#selectedYear =
    this.#todayYear = todayDate.getUTCFullYear();
  }

  protected override shouldUpdate(): boolean {
    return this.data != null && this.data.formatters != null;
  }

  public override willUpdate(changedProperties: YearGridChangedProperties): void {
    if (changedProperties.has('data') && this.data) {
      const { date } = this.data;

      if (date) {
        this.$focusingYear = this.#selectedYear = date.getUTCFullYear();
      }
    }
  }

  protected override async firstUpdated(): Promise<void> {
    await focusElement(this.selectedYearGridButton, element => element.scrollIntoView());
  }

  protected override render(): TemplateResult | typeof nothing {
    const {
      date,
      formatters,
      max,
      min,
    } = this.data as YearGridData;
    const focusingYear =this.$focusingYear;

    const { yearFormat } = formatters as Formatters;
    const yearList = toYearList(min, max);

    return html`
    <div
      class="year-grid"
      @click=${this.#updateYear}
      @keydown=${this.#updateYear}
      @keyup=${this.#updateYear}
    >${
      yearList.map((year) => {
        const yearLabel = yearFormat(new Date(`${year}-01-01`));

        return html`
        <button
          class=${classMap({
            'year-grid-button': true,
            'year--today': this.#todayYear === year,
          })}
          tabindex=${year === focusingYear ? '0' : '-1'}
          data-year=${year}
          label=${yearLabel}
          aria-selected=${year === date.getUTCFullYear() ? 'true' : 'false'}
        ></button>
        `;
      })
    }</div>
    `;
  }

  #updateYear = (ev: MouseEvent | KeyboardEvent): void => {
    if (ev.type === 'keydown') {
      const key =
        (ev as KeyboardEvent).key as InferredFromSet<typeof navigationKeySetGrid>;

      if (!navigationKeySetGrid.has(key)) return;

      // Stop scrolling with arrow keys
      ev.preventDefault();

      // Focus new year with Home, End, and arrow keys
      const {
        max,
        min,
      } = this.data as YearGridData;
      const focusingYear = toNextSelectedYear({
        key,
        max,
        min,
        year: this.$focusingYear,
      });

      const focusingYearGridButton =
        this.shadowRoot?.querySelector<HTMLButtonElement>(
          `button[data-year="${focusingYear}"]`
        );

      this.$focusingYear = focusingYear;
      focusingYearGridButton?.focus();
    } else if (ev.type === 'click') {
      const selectedYearStr =
        toClosestTarget(ev, `button[data-year]`)
        ?.getAttribute('data-year');

      /** Do nothing when not tapping on the year button */
      if (selectedYearStr == null) return;

      const year = Number(selectedYearStr);

      this.$focusingYear = this.#selectedYear = year;
      dispatchCustomEvent(this, 'year-updated', { year });
    }
  };
}
