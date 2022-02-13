import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { labelSelectedYear, labelTodayYear, MAX_DATE, navigationKeySetGrid } from '../constants.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toYearList } from '../helpers/to-year-list.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetButton, resetShadowRoot } from '../stylings.js';
import type { CustomEventDetail, Formatters, InferredFromSet } from '../typings.js';
import { yearGridStyling } from './stylings.js';
import { toNextSelectedYear } from './to-next-selected-year.js';
import type { YearGridChangedProperties, YearGridData, YearGridProperties, YearGridRenderButtonInit } from './typings.js';

export class YearGrid extends RootElement implements YearGridProperties {
  @property({ attribute: false }) public data: YearGridData;

  @queryAsync('button[data-year][aria-selected="true"]') public selectedYearGridButton!: Promise<HTMLButtonElement | null>;
  @queryAsync('.year-grid') public yearGrid!: Promise<HTMLDivElement | null>;

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
      selectedYearLabel: labelSelectedYear,
      todayYearLabel: labelTodayYear,
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
    /**
     * NOTE(motss): Unable to use `.focus()` nor `.scrollIntoView()` as it will trigger the document scrolling
     * instead of just the year grid container. So what is doing here is to calculate the position of
     * the selected year and updates the `.scrollTop`.
     */
    this.scrollTop = Math.floor((this.$focusingYear - this.data.min.getUTCFullYear()) / 4) * 32;
  }

  protected override render(): TemplateResult {
    const {
      date,
      formatters,
      max,
      min,
      selectedYearLabel,
      todayYearLabel,
    } = this.data as YearGridData;
    const focusingYear =this.$focusingYear;

    const { yearFormat } = formatters as Formatters;
    const yearList = toYearList(min, max);

    return html`
    <div
      @click=${this.#updateYear}
      @keydown=${this.#updateYear}
      @keyup=${this.#updateYear}
      class="year-grid"
      part=year-grid
    >${
      yearList.map((year) => this.$renderButton({
        date,
        focusingYear,
        label: yearFormat(new Date(`${year}-01-01`)),
        selectedYearLabel,
        todayYearLabel,
        year,
      }))
    }</div>
    `;
  }

  protected $renderButton({
    date,
    focusingYear,
    label,
    selectedYearLabel,
    todayYearLabel,
    year,
  }: YearGridRenderButtonInit): TemplateResult {
    const isSelected = year === date.getUTCFullYear();
    const isToday = this.#todayYear === year;

    const title = isSelected ?
      selectedYearLabel :
      isToday
        ? todayYearLabel
        : undefined;

    return html`
    <button
      .year=${year}
      aria-label=${label}
      aria-selected=${isSelected ? 'true' : 'false'}
      class="year-grid-button ${classMap({ 'year--today': isToday })}"
      data-year=${year}
      part=year
      tabindex=${year === focusingYear ? '0' : '-1'}
      title=${ifDefined(title)}
    ></button>
    `;
  }

  #updateYear = (event: KeyboardEvent): void => {
    if (event.type === 'keydown') {
      /**
       * NOTE: `@material/mwc-dialog` captures Enter keyboard event then closes the dialog.
       * This is not what `year-grid` expects so here stops all event propagation immediately for
       * all key events.
       */
      event.stopImmediatePropagation();

      const key =
      event.key as InferredFromSet<typeof navigationKeySetGrid>;

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

      const focusingYearGridButton = this.query<HTMLButtonElement>(
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

      const year = Number(selectedYearStr);

      this.$focusingYear = year;

      this.fire<CustomEventDetail['year-updated']>({
        detail: {
          year,
        },
        type: 'year-updated',
      });
    }
  };
}
