import '../year-grid-button/app-year-grid-button.js';

import { property } from '@lit/reactive-element/decorators/property.js';
import { queryAsync } from '@lit/reactive-element/decorators/query-async.js';
import type { TemplateResult } from 'lit';
import { nothing } from 'lit';
import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { MAX_DATE, yearGridNavigationKeyCodeSet } from '../constants.js';
import { dispatchCustomEvent } from '../helpers/dispatch-custom-event.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toYearList } from '../helpers/to-year-list.js';
import { baseStyling, resetButton, resetShadowRoot } from '../stylings.js';
import { toNextSelectedYear } from './ to-next-selected-year.js';
import { yearGridStyling } from './stylings.js';
import type { YearGridChangedProperties, YearGridData, YearGridProperties } from './typings.js';

export class YearGrid extends LitElement implements YearGridProperties {
  @property({ attribute: false })
  public data: YearGridData;

  @queryAsync('button[data-year][aria-selected="true"]')
  public selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  public static styles = [
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
    this.#selectedYear = todayDate.getUTCFullYear();
    this.#todayYear = todayDate.getUTCFullYear();
  }

  protected shouldUpdate(): boolean {
    return this.data.formatters != null;
  }

  protected async firstUpdated(): Promise<void> {
    const selectedYearGridButton = await this.selectedYearGridButton;

    if (selectedYearGridButton) {
      selectedYearGridButton.scrollIntoView();
    }
  }

  public willUpdate(changedProperties: YearGridChangedProperties): void {
    if (changedProperties.has('data')) {
      this.#selectedYear = this.data.date.getUTCFullYear();
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const {
      date,
      formatters,
      max,
      min,
    } = this.data;

    if (formatters == null) return nothing;

    const { yearFormat } = formatters;
    const yearList = toYearList(min, max);

    return html`
    <div
      class="year-grid"
      @click=${this.#updateYear}
      @keydown=${this.#updateYear}
      @keyup=${this.#updateYear}
    >${
      yearList.map((year) => {
        const yearLabel = yearFormat(year);
        // FIXME: To update tabindex
        const isYearSelected = year === date.getUTCFullYear();

        return html`
        <button
          class=${classMap({
            'year-grid-button': true,
            'year--today': this.#todayYear === year,
          })}
          tabindex=${isYearSelected ? '0' : '-1'}
          data-year=${year}
          label=${yearLabel}
          aria-selected=${isYearSelected ? 'true' : 'false'}
        ></button>
        `;
      })
    }</div>
    `;
  }

  #updateYear = (ev: MouseEvent | KeyboardEvent): void => {


    if (['keydown', 'keyup'].includes(ev.type)) {
      const { keyCode } = ev as KeyboardEvent;
      const keyCodeNum = keyCode as typeof keyCode extends Set<infer U> ? U : never;

      if (
        !(yearGridNavigationKeyCodeSet.has(keyCodeNum) && ev.type === 'keydown')
      ) return;

      // Focus new year with Home, End, and arrow keys
      const {
        max,
        min,
      } = this.data;
      const selectedYear = toNextSelectedYear({
        keyCode: keyCodeNum,
        max,
        min,
        year: this.#selectedYear,
      });

      const selectedYearGridButton = this.shadowRoot?.querySelector<HTMLButtonElement>(
        `button[data-year="${selectedYear}"]`
      );

      if (selectedYearGridButton) {
        selectedYearGridButton.focus();
        selectedYearGridButton.scrollIntoView();
      }

      this.#selectedYear = selectedYear;
    } else {
      const selectedYearGridButton = toClosestTarget(ev, `button[data-year]`);

      /** Do nothing when not tapping on the year button */
      if (selectedYearGridButton == null) return;

      const year = Number(selectedYearGridButton.getAttribute('data-year'));

      dispatchCustomEvent(this, 'year-updated', { year });
    }
  };
}
