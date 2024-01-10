import { html, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { labelSelectedYear, labelToyear, MAX_DATE, navigationKeySetGrid } from '../constants.js';
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
  public static override styles = [
    baseStyling,
    resetButton,
    resetShadowRoot,
    yearGridStyling,
  ];

  #todayYear: number;
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

  @state() protected $focusingYear: number;

  @property({ attribute: false }) public data: YearGridData;

  @queryAsync('button[data-year][aria-selected="true"]') public selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  @queryAsync('.year-grid') public yearGrid!: Promise<HTMLDivElement | null>;

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this.data = {
      date: todayDate,
      formatters: undefined,
      max: MAX_DATE,
      min: todayDate,
      selectedYearLabel: labelSelectedYear,
      toyearLabel: labelToyear,
    };

    this.$focusingYear = this.#todayYear = todayDate.getUTCFullYear();
  }

  protected $renderButton({
    ariaLabel,
    ariaSelected,
    className,
    part,
    tabIndex,
    title,
    year,
  }: YearGridRenderButtonInit): TemplateResult {
    return html`
    <button
      .year=${year}
      aria-label=${ariaLabel as string}
      aria-selected=${ariaSelected as 'false' | 'true'}
      class="year-grid-button${className}"
      data-year=${year}
      part=${part}
      tabindex=${tabIndex}
      title=${ifDefined(title)}
    ></button>
    `;
  }

  protected override render(): TemplateResult {
    const {
      date,
      formatters,
      max,
      min,
      selectedYearLabel,
      toyearLabel,
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
      yearList.map((year) => {
        const isSelected = year === date.getUTCFullYear();
        const isToday = this.#todayYear === year;

        const title = isSelected ?
          selectedYearLabel :
          isToday
            ? toyearLabel
            : undefined;

        return this.$renderButton({
          ariaLabel: yearFormat(new Date(`${year}-01-01`)),
          ariaSelected: isSelected ? 'true' : 'false',
          className: isToday ? ' year--today' : '',
          date,
          part: `year${isToday ? ' toyear' : ''}`,
          tabIndex: year === focusingYear ? 0 : -1,
          title,
          toyearLabel,
          year,
        } as YearGridRenderButtonInit);
      })
    }</div>
    `;
  }

  protected override shouldUpdate(): boolean {
    return this.data != null && this.data.formatters != null;
  }

  protected override async updated(): Promise<void> {
    /**
     * NOTE(motss): Unable to use `.focus()` nor `.scrollIntoView()` as it will trigger the document scrolling
     * instead of just the year grid container. So what is doing here is to calculate the position of
     * the selected year and updates the `.scrollTop`.
     */
    this.scrollTop = Math.floor((this.$focusingYear - this.data.min.getUTCFullYear()) / 4) * 32;
  }

  public override willUpdate(changedProperties: YearGridChangedProperties): void {
    if (changedProperties.has('data') && this.data) {
      const { date } = this.data;

      if (date) {
        this.$focusingYear = date.getUTCFullYear();
      }
    }
  }
}
