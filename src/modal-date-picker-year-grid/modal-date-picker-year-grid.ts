import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, queryAsync, state } from 'lit/decorators.js';

import { intlDateTimeFormatNoop, MAX_DATE, MIN_DATE, navigationKeySetGrid, selectedYearTemplate, toyearTemplate, yearFormatOptions } from '../constants.js';
import { templateReplacer } from '../helpers/template-replacer.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toYearList } from '../helpers/to-year-list.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { resetButton, resetShadowRoot } from '../stylings.js';
import type { InferredFromSet } from '../typings.js';
import { defaultYearGridButtonYearTemplate, defaultYearGridMaxColumn, modalDatePickerYearGridName } from './constants.js';
import { renderYearGridButton } from './helpers/render-year-grid-button/render-year-grid-button.js';
import { toNextYear } from './helpers/to-next-year/to-next-year.js';
import { modalDatePickerYearGrid_yearGridButtonStyle, modalDatePickerYearGrid_yearGridStyle } from './styles.js';
import type { ModalDatePickerYearGridProperties } from './types.js';

@customElement(modalDatePickerYearGridName)
export class ModalDatePickerYearGrid extends DatePickerMinMaxMixin(RootElement) implements ModalDatePickerYearGridProperties {
  public static override styles = [
    resetShadowRoot,
    resetButton,
    modalDatePickerYearGrid_yearGridStyle,
    modalDatePickerYearGrid_yearGridButtonStyle,
  ];

  #focusingYear: number = toResolvedDate().getUTCFullYear();

  #installYearFormat = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('locale')) {
      const { locale } = this;

      if (changedProperties.get('locale') !== locale) {
        this.#yearFormat = new Intl.DateTimeFormat(locale, yearFormatOptions);
      }
    }
  };

  #maxDateTime: Date = MAX_DATE;

  #minDateTime: Date = MIN_DATE;

  #onYearChange = (event: KeyboardEvent): void => {
    if (event.type === 'keydown') {
      /**
       * NOTE: `@material/base/dialog` captures Enter keyboard event then closes the dialog.
       * This is not what `year-grid` expects so here stops all event propagation immediately for
       * all key events.
       */
      event.stopImmediatePropagation();

      const key = event.key as InferredFromSet<typeof navigationKeySetGrid>;

      if (navigationKeySetGrid.has(key)) {
        /** Stop scrolling with arrow keys */
        event.preventDefault();

        /** Focus new year with Home, End, and arrow keys */
        const focusingYear = toNextYear({
          key,
          max: this.#maxDateTime,
          min: this.#minDateTime,
          year: this.#focusingYear,
        });

        this.#focusingYear = focusingYear;
        this.query<HTMLButtonElement>(`[data-year="${focusingYear}"]`)?.focus();
      }
    } else if (event.type === 'click') {
      const selectedYearStr = toClosestTarget(event, `[data-year]`)?.getAttribute('data-year');

      /** Do nothing when not tapping on the year button */
      if (selectedYearStr) {
        const year = Number(selectedYearStr);

        this.#focusingYear = year;
        this.requestUpdate();
        this.onYearUpdate?.(year);
      }
    }
  };

  #todayYear: number = toResolvedDate().getUTCFullYear();

  #updateFocusingYear = (changedProperties: PropertyValueMap<this>) => {
    const { value } = this;

    if (changedProperties.has('value') && value !== changedProperties.get('value')) {
      this.#focusingYear = toResolvedDate(value).getUTCFullYear();
    }
  };
  #updateMinMax = (changedProperties: PropertyValueMap<this>) => {
    const { max, min } = this;

    if (changedProperties.has('max') && changedProperties.get('max') !== max) {
      this.#maxDateTime = toResolvedDate(max || MAX_DATE);
    }

    if (changedProperties.has('min') && changedProperties.get('min') !== min) {
      this.#minDateTime = toResolvedDate(min || MIN_DATE);
    }
  };

  #yearFormat: Intl.DateTimeFormat = intlDateTimeFormatNoop;
  @property() public locale: string = new Intl.DateTimeFormat().resolvedOptions().locale;
  @state() public onYearUpdate: ModalDatePickerYearGridProperties['onYearUpdate'];
  @queryAsync('button[data-year][aria-pressed="true"]') selectedYearGridButton!: Promise<HTMLButtonElement | null>;
  @property() public selectedYearTemplate: string = selectedYearTemplate;
  @property() public toyearTemplate: string = toyearTemplate;
  @property() public value: null | string | undefined = '';

  @queryAsync('.year-grid') yearGrid!: Promise<HTMLDivElement | null>;

  protected override render(): TemplateResult {
    const { selectedYearTemplate, toyearTemplate, value } = this;

    const yearList = toYearList(this.#minDateTime, this.#maxDateTime);
    const selectedDateYear = toResolvedDate(value).getUTCFullYear();
    const rows = Math.ceil(yearList.length / 3);

    return html`
    <div
      style=${`--_rows:${rows};`}
      @click=${this.#onYearChange}
      @keydown=${this.#onYearChange}
      @keyup=${this.#onYearChange}
      class=yearGrid
      part=year-grid
    >${yearList.map((year) => {
      const selected = year === selectedDateYear;
      const tabIndex = year === this.#focusingYear ? 0 : -1;
      const toyear = this.#todayYear === year;
      const yearLabel = this.#yearFormat.format(new Date(`${year}-01-01`));

      const template =
        selected ?
          selectedYearTemplate :
          toyear
            ? toyearTemplate
            : defaultYearGridButtonYearTemplate;
      const label = templateReplacer(template, [yearLabel]);

      return renderYearGridButton({
        label,
        selected,
        tabIndex,
        toyear,
        year,
      });
    })
      }</div>
    `;
  }

  protected override updated(_changedProperties: PropertyValueMap<this>): void {
    /**
     * NOTE(motss): Unable to use `.focus()` nor `.scrollIntoView()` as it will trigger the document scrolling
     * instead of just the year grid container. So what is doing here is to calculate the position of
     * the selected year and updates the `.scrollTop`.
     */
    const diffInYears = this.#focusingYear - this.#minDateTime.getUTCFullYear();
    const whichRow = Math.floor(diffInYears / defaultYearGridMaxColumn);
    const whichRowThatCentered = whichRow - defaultYearGridMaxColumn;
    const buttonHeight = 48;

    this.scrollTop = whichRowThatCentered * buttonHeight;
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#installYearFormat(changedProperties);
    this.#updateFocusingYear(changedProperties);
    this.#updateMinMax(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerYearGridName]: ModalDatePickerYearGrid;
  }
}
