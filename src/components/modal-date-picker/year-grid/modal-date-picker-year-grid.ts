import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';

import {
  intlDateTimeFormatNoop,
  navigationKeySetGrid,
  selectedYearTemplate,
  toyearTemplate,
  yearFormatOptions,
} from '../../../constants.js';
import { templateReplacer } from '../../../helpers/template-replacer.js';
import { toClosestTarget } from '../../../helpers/to-closest-target.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { toYearList } from '../../../helpers/to-year-list.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { RootElement } from '../../../root-element/root-element.js';
import { resetButton, resetShadowRoot } from '../../../styles.js';
import type { InferredFromSet } from '../../../types.js';
import {
  defaultYearGridButtonYearTemplate,
  defaultYearGridMaxColumn,
  modalDatePickerYearGridName,
} from './constants.js';
import { renderYearGridButton } from './helpers/render-year-grid-button/render-year-grid-button.js';
import { toNextYear } from './helpers/to-next-year/to-next-year.js';
import { modalDatePickerYearGridStyles } from './styles.js';
import type { ModalDatePickerYearGridProperties } from './types.js';

@customElement(modalDatePickerYearGridName)
export class ModalDatePickerYearGrid
  extends MinMaxMixin(RootElement)
  implements ModalDatePickerYearGridProperties
{
  static override styles = [
    resetShadowRoot,
    resetButton,
    modalDatePickerYearGridStyles,
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

        const { _maxDate, _minDate } = this;

        /** Focus new year with Home, End, and arrow keys */
        const focusingYear = toNextYear({
          key,
          maxDate: _maxDate,
          minDate: _minDate,
          year: this.#focusingYear,
        });

        this.#focusingYear = focusingYear;
        this.requestUpdate();
      }
    } else if (event.type === 'click') {
      const selectedYearStr = toClosestTarget(
        event,
        '[data-year]'
      )?.getAttribute('data-year');

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

    if (
      changedProperties.has('value') &&
      value !== changedProperties.get('value')
    ) {
      this.#focusingYear = toResolvedDate(value).getUTCFullYear();
    }
  };

  #yearFormat: Intl.DateTimeFormat = intlDateTimeFormatNoop;

  @property() locale: string = new Intl.DateTimeFormat().resolvedOptions()
    .locale;

  @property({ attribute: false })
  onYearUpdate: ModalDatePickerYearGridProperties['onYearUpdate'];

  @queryAsync('button[data-year][aria-pressed="true"]')
  selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  @property() selectedYearTemplate: string = selectedYearTemplate;
  @property() toyearTemplate: string = toyearTemplate;
  @property() value: null | string | undefined = '';

  @queryAsync('.year-grid') yearGrid!: Promise<HTMLDivElement | null>;

  focusYearWhenNeeded() {
    /**
     * NOTE(motss): Unable to use `.focus()` nor `.scrollIntoView()` as it will trigger the document scrolling
     * instead of just the year grid container. So what is doing here is to calculate the position of
     * the selected year and updates the `.scrollTop`.
     */
    const focusingYear = this.#focusingYear;
    const diffInYears = focusingYear - this._minDate.getUTCFullYear();
    const whichRow = Math.floor(diffInYears / defaultYearGridMaxColumn);
    const whichRowThatCentered = whichRow - defaultYearGridMaxColumn;
    const buttonHeight = 48;

    this.scrollTop = whichRowThatCentered * buttonHeight;
    this.query<HTMLButtonElement>(`[data-year="${focusingYear}"]`)?.focus();
  }

  protected override render(): TemplateResult {
    const { _maxDate, _minDate, selectedYearTemplate, toyearTemplate, value } = this;

    const yearList = toYearList(_minDate, _maxDate);
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

      const template = selected
        ? selectedYearTemplate
        : toyear
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
    })}</div>
    `;
  }

  protected override updated(_changedProperties: PropertyValueMap<this>): void {
    this.focusYearWhenNeeded();
  }

  override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#installYearFormat(changedProperties);
    this.#updateFocusingYear(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [modalDatePickerYearGridName]: ModalDatePickerYearGrid;
  }
}
