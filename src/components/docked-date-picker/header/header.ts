import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdTextButton } from '@material/web/button/text-button.js';
import { html, nothing, type PropertyValueMap, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import {
  labelNextMonth,
  labelNextYear,
  labelPreviousMonth,
  labelPreviousYear,
  MAX_DATE,
  MIN_DATE,
  shortMonthFormatOptions,
  yearFormatOptions,
} from '../../../constants.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { iconChevronLeft, iconChevronRight } from '../../../icons.js';
import { renderMenuButton } from '../../../render-helpers/render-menu-button/render-menu-button.js';
import type { RenderMenuButtonInit } from '../../../render-helpers/render-menu-button/types.js';
import { RootElement } from '../../../root-element/root-element.js';
import type { MenuListType } from '../../../types.js';
import type { HeaderDataset, HeaderProperties } from './types.js';

const offsetByType = {
  monthDec: -1,
  monthInc: 1,
  monthMenu: 0,
  yearDec: -1,
  yearInc: 1,
  yearMenu: 0,
} as const;

export class Header extends RootElement implements HeaderProperties {
  #maxDate!: Date;
  #minDate!: Date;
  #monthFormat!: Intl.DateTimeFormat['format'];

  #onMenuButtonClick: RenderMenuButtonInit['onClick'] = (ev) => {
    const { type } = (ev.currentTarget as HTMLButtonElement)
      .dataset as HeaderDataset;
    const offset = offsetByType[type];
    const date = this.#valueDate;

    switch (type) {
      case 'monthDec':
      case 'monthInc':
      case 'monthMenu': {
        this.onMonthMenuClick?.({
          date: toUTCDate(date, { month: offset }),
          type,
        });
        break;
      }
      case 'yearDec':
      case 'yearInc':
      case 'yearMenu': {
        this.onYearMenuClick?.({
          date: toUTCDate(date, { year: offset }),
          type,
        });
        break;
      }
      default:
    }
  };

  #updateDates = (changedProperties: PropertyValueMap<this>): void => {
    if (
      changedProperties.has('max') &&
      changedProperties.get('max') !== this.max
    ) {
      this.#maxDate = toResolvedDate(this.max);
      this.requestUpdate();
    }

    if (
      changedProperties.has('min') &&
      changedProperties.get('min') !== this.min
    ) {
      this.#minDate = toResolvedDate(this.min);
      this.requestUpdate();
    }

    if (
      changedProperties.has('value') &&
      changedProperties.get('value') !== this.value
    ) {
      this.#valueDate = toResolvedDate(this.value);
      this.requestUpdate();
    }
  };

  #updateFormatters = (changedProperties: PropertyValueMap<this>) => {
    if (
      changedProperties.has('locale') &&
      changedProperties.get('locale') !== this.locale
    ) {
      const { locale } = this;

      this.#monthFormat = new Intl.DateTimeFormat(
        locale,
        shortMonthFormatOptions
      ).format;
      this.#yearFormat = new Intl.DateTimeFormat(
        locale,
        yearFormatOptions
      ).format;
      this.requestUpdate();
    }
  };

  #valueDate!: Date;
  #yearFormat!: Intl.DateTimeFormat['format'];

  @property() locale: string = Intl.DateTimeFormat().resolvedOptions().locale;
  @property() max?: string;
  @property() min?: string;
  @property() nextMonthButtonLabel: string = labelNextMonth;
  @property() nextYearButtonLabel: string = labelNextYear;

  @property({ attribute: false })
  onMonthMenuClick?: HeaderProperties['onMonthMenuClick'];

  @property({ attribute: false })
  onYearMenuClick?: HeaderProperties['onYearMenuClick'];

  @property() prevMonthButtonLabel: string = labelPreviousMonth;
  @property() prevYearButtonLabel: string = labelPreviousYear;
  @property({ reflect: true }) startView: 'calendar' | MenuListType =
    'calendar';
  @property() value?: string;

  constructor() {
    super();

    const { max, min, value } = this;

    this.#maxDate = toResolvedDate(max ?? MAX_DATE);
    this.#minDate = toResolvedDate(min ?? MIN_DATE);
    this.#valueDate = toResolvedDate(value);
  }

  async getMonthMenuButton(): Promise<MdTextButton | null> {
    await this.updateComplete;
    return this.root.querySelector<MdTextButton>('.menuButton.month');
  }

  protected override render(): TemplateResult {
    const {
      nextMonthButtonLabel,
      nextYearButtonLabel,
      prevMonthButtonLabel,
      prevYearButtonLabel,
      startView,
    } = this;

    const date = this.#valueDate;
    const min = this.#minDate;
    const max = this.#maxDate;
    const monthLabel = this.#monthFormat(date);
    const yearLabel = this.#yearFormat(date);
    const isViewCalendar = startView === 'calendar';
    const isViewMonthMenu = startView === 'monthMenu';
    const isViewYearMenu = startView === 'yearMenu';

    const mit = fromPartsToUtcDate(
      min.getUTCFullYear(),
      min.getUTCMonth(),
      1
    ).getTime();
    const mat = fromPartsToUtcDate(
      max.getUTCFullYear(),
      max.getUTCMonth(),
      1
    ).getTime();

    const dtPm = toUTCDate(date, { month: -1 }).getTime();
    const dtNm = toUTCDate(date, { month: 1 }).getTime();
    const dtPy = toUTCDate(date, { year: -1 }).getTime();
    const dtNy = toUTCDate(date, { year: 1 }).getTime();

    const showPrevMonthButton = isViewCalendar && dtPm > mit;
    const showNextMonthButton = isViewCalendar && dtNm > mit && dtNm < mat;
    const showNextYearButton = isViewCalendar && dtPy > mit && dtPy < mat;
    const showPrevYearButton = isViewCalendar && dtNy < mat;

    const onClick = this.#onMenuButtonClick;

    return html`
    <div class=header>
      ${
        showPrevMonthButton
          ? html`<md-icon-button class=prevMonth data-type=monthDec @click=${onClick} aria-label=${prevMonthButtonLabel} title=${prevMonthButtonLabel}>${iconChevronLeft}</md-icon-button>`
          : nothing
      }
      ${renderMenuButton({
        className: 'month',
        disabled: isViewYearMenu,
        label: monthLabel,
        onClick,
        text: monthLabel,
        type: 'monthMenu',
      })}
      ${
        showNextMonthButton
          ? html`<md-icon-button class=nextMonth data-type=monthInc @click=${onClick} aria-label=${nextMonthButtonLabel} title=${nextMonthButtonLabel}>${iconChevronRight}</md-icon-button>`
          : nothing
      }

      ${
        showPrevYearButton
          ? html`<md-icon-button class=prevYear data-type=yearDec @click=${onClick} aria-label=${prevYearButtonLabel} title=${prevYearButtonLabel}>${iconChevronLeft}</md-icon-button>`
          : nothing
      }
      ${renderMenuButton({
        className: 'year',
        disabled: isViewMonthMenu,
        label: yearLabel,
        onClick,
        text: yearLabel,
        type: 'yearMenu',
      })}
      ${
        showNextYearButton
          ? html`<md-icon-button class=nextYear data-type=yearInc @click=${onClick} aria-label=${nextYearButtonLabel} title=${nextYearButtonLabel}>${iconChevronRight}</md-icon-button>`
          : nothing
      }
    </div>
    `;
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#updateFormatters(changedProperties);
    this.#updateDates(changedProperties);
  }
}
