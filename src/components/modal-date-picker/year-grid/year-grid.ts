import { html, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';

import {
  navigationKeySetGrid,
  selectedYearTemplate,
  toyearTemplate,
  yearFormatOptions,
} from '../../../constants.js';
import { PropertyChangeController } from '../../../controllers/property-change-controller/property-change-controller.js';
import { templateReplacer } from '../../../helpers/template-replacer.js';
import { toClosestTarget } from '../../../helpers/to-closest-target.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { toYearList } from '../../../helpers/to-year-list.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../../root-element/root-element.js';
import type { InferredFromSet } from '../../../types.js';
import {
  defaultYearGridButtonYearTemplate,
  defaultYearGridMaxColumn,
} from './constants.js';
import { renderYearGridButton } from './helpers/render-year-grid-button/render-year-grid-button.js';
import { toNextYear } from './helpers/to-next-year/to-next-year.js';
import type { YearGridProperties } from './types.js';

export class YearGrid
  extends MinMaxMixin(ValueMixin(RootElement))
  implements YearGridProperties
{
  #$yearGrid = createRef<HTMLDivElement>();

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
          year: this._focusingYear,
        });

        this._focusingYear = focusingYear;
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

        this._focusingYear = year;
        this.requestUpdate();
        this.onYearUpdate?.(year);
      }
    }
  };

  #todayYear: number = toResolvedDate().getUTCFullYear();

  @state() _focusingYear: number = toResolvedDate().getUTCFullYear();

  @state() _yearFormat!: YearGridProperties['_yearFormat'];

  @property() locale: string = new Intl.DateTimeFormat().resolvedOptions()
    .locale;

  @property({ attribute: false })
  onYearUpdate: YearGridProperties['onYearUpdate'];

  @queryAsync('button[data-year][aria-pressed="true"]')
  selectedYearGridButton!: Promise<HTMLButtonElement | null>;

  @property() selectedYearTemplate: string = selectedYearTemplate;

  @property() toyearTemplate: string = toyearTemplate;

  constructor() {
    super();

    new PropertyChangeController(this, {
      onUpdate: (_, newValue) => {
        this._focusingYear = toResolvedDate(newValue).getUTCFullYear();
        this.requestUpdate();
      },
      order: 'update',
      property: 'value',
    });

    new PropertyChangeController(this, {
      onUpdate: (_, locale) => {
        this._yearFormat = new Intl.DateTimeFormat(locale, yearFormatOptions);
      },
      order: 'update',
      property: 'locale',
    });
  }

  focusYearWhenNeeded() {
    /**
     * NOTE(motss): Unable to use `.focus()` nor `.scrollIntoView()` as it will trigger the document scrolling
     * instead of just the year grid container. So what is doing here is to calculate the position of
     * the selected year and updates the `.scrollTop`.
     */
    const focusingYear = this._focusingYear;
    const diffInYears = focusingYear - this._minDate.getUTCFullYear();
    const whichRow = Math.floor(diffInYears / defaultYearGridMaxColumn);
    const whichRowThatCentered = whichRow - defaultYearGridMaxColumn;
    const buttonHeight = 48;

    this.scrollTop = whichRowThatCentered * buttonHeight;
    this.query<HTMLButtonElement>(`[data-year="${focusingYear}"]`)?.focus();
  }

  protected override render(): TemplateResult {
    const { _maxDate, _minDate, selectedYearTemplate, toyearTemplate, value } =
      this;

    const yearList = toYearList(_minDate, _maxDate);
    const selectedDateYear = toResolvedDate(value).getUTCFullYear();
    const rows = Math.ceil(yearList.length / 3);

    return html`
    <div
      @click=${this.#onYearChange}
      @keydown=${this.#onYearChange}
      @keyup=${this.#onYearChange}
      ${ref(this.#$yearGrid)}
      class=yearGrid
      style=${`--_rows:${rows};`}
    >${map(yearList, (year) => {
      const selected = year === selectedDateYear;
      const tabIndex = year === this._focusingYear ? 0 : -1;
      const toyear = this.#todayYear === year;
      const yearLabel = this._yearFormat.format(new Date(`${year}-01-01`));

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
}
