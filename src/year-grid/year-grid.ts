import type { TemplateResult } from 'lit';
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
import type { Formatters, InferredFromSet, SupportedKey } from '../typings.js';
import { yearGridStyling } from './stylings.js';
import { toNextSelectedYear } from './to-next-selected-year.js';
import type { YearGridChangedProperties, YearGridData, YearGridProperties, YearGridRenderButtonInit } from './typings.js';

export class YearGrid extends LitElement implements YearGridProperties {
  @property({ attribute: false }) public data?: YearGridData;

  @queryAsync('button[data-year][aria-selected="true"]') public selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  @state() protected $focusingYear: number;

  #todayYear: number;

  public static override styles = [
    baseStyling,
    resetButton,
    resetShadowRoot,
    yearGridStyling,
  ];

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this.data = {
      date: todayDate,
      formatters: undefined,
      max: MAX_DATE,
      min: todayDate,
    };

    this.$focusingYear = this.#todayYear = todayDate.getUTCFullYear();
  }

  protected override shouldUpdate(): boolean {
    return this.data != null && this.data.formatters != null;
  }

  public override willUpdate(changedProperties: YearGridChangedProperties): void {
    if (changedProperties.has('data') && this.data) {
      const { date } = this.data;

      if (date) {
        this.$focusingYear = date.getUTCFullYear();
      }
    }
  }

  protected override async firstUpdated(): Promise<void> {
    await focusElement(this.selectedYearGridButton, element => element.scrollIntoView());
  }

  protected override render(): TemplateResult {
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
      yearList.map((year) => this.$renderButton({
        date,
        focusingYear,
        label: yearFormat(new Date(`${year}-01-01`)),
        year,
      }))
    }</div>
    `;
  }

  protected $renderButton({
    date,
    focusingYear,
    label,
    year,
  }: YearGridRenderButtonInit): TemplateResult {
    return html`
    <button
      class="year-grid-button ${classMap({ 'year--today': this.#todayYear === year })}"
      tabindex=${year === focusingYear ? '0' : '-1'}
      data-year=${year}
      aria-label=${label}
      aria-selected=${year === date.getUTCFullYear() ? 'true' : 'false'}
    ></button>
    `;
  }

  #updateYear = (event: MouseEvent | KeyboardEvent): void => {
    if (event.type === 'keydown') {
      const key =
        (event as KeyboardEvent).key as InferredFromSet<typeof navigationKeySetGrid>;

      if (!navigationKeySetGrid.has(key)) return;

      // Stop scrolling with arrow keys
      event.preventDefault();

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
    } else if (event.type === 'click') {
      const selectedYearStr =
        toClosestTarget(event, `button[data-year]`)
        ?.getAttribute('data-year');

      /** Do nothing when not tapping on the year button */
      if (selectedYearStr == null) return;

      const key = (event as KeyboardEvent).key as SupportedKey;
      const year = Number(selectedYearStr);

      this.$focusingYear = year;

      dispatchCustomEvent(this, 'year-updated', {
        isKeypress: Boolean(key),
        key,
        year,
      });
    }
  };
}
