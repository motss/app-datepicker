import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import type { MdTextButton } from '@material/web/button/text-button.js';
import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

import {
  labelNextMonth,
  labelNextYear,
  labelPreviousMonth,
  labelPreviousYear,
  shortMonthFormatOptions,
  yearFormatOptions,
} from '../../../constants.js';
import { PropertyChangeController } from '../../../controllers/property-change-controller/property-change-controller.js';
import { iconChevronLeft, iconChevronRight } from '../../../icons.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../../mixins/value-mixin/value-mixin.js';
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

export class Header
  extends MinMaxMixin(ValueMixin(RootElement))
  implements HeaderProperties
{
  #onMenuButtonClick: RenderMenuButtonInit['onClick'] = (ev) => {
    const { type } = (ev.currentTarget as HTMLButtonElement)
      .dataset as HeaderDataset;
    const offset = offsetByType[type];
    const date = this._valueDate;

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

  @state() _formatters!: HeaderProperties['_formatters'];

  @property() locale: string = Intl.DateTimeFormat().resolvedOptions().locale;
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

  constructor() {
    super();

    new PropertyChangeController(this, {
      onChange: (_, locale) => {
        this._formatters = {
          shortMonthFormat: new Intl.DateTimeFormat(
            locale,
            shortMonthFormatOptions
          ),
          yearFormat: new Intl.DateTimeFormat(locale, yearFormatOptions),
        };
      },
      property: 'locale',
    });
  }

  async getMonthMenuButton(): Promise<MdTextButton | null> {
    await this.updateComplete;
    return this.root.querySelector<MdTextButton>('.menuButton.month');
  }

  protected override render(): TemplateResult {
    const {
      _formatters: { shortMonthFormat, yearFormat },
      _maxDate,
      _minDate,
      _valueDate,
      nextMonthButtonLabel,
      nextYearButtonLabel,
      prevMonthButtonLabel,
      prevYearButtonLabel,
      startView,
    } = this;

    const monthLabel = shortMonthFormat.format(_valueDate);
    const yearLabel = yearFormat.format(_valueDate);
    const isViewCalendar = startView === 'calendar';
    const isViewMonthMenu = startView === 'monthMenu';
    const isViewYearMenu = startView === 'yearMenu';

    const mit = fromPartsToUtcDate(
      _minDate.getUTCFullYear(),
      _minDate.getUTCMonth(),
      1
    ).getTime();
    const mat = fromPartsToUtcDate(
      _maxDate.getUTCFullYear(),
      _maxDate.getUTCMonth(),
      1
    ).getTime();

    const dtPm = toUTCDate(_valueDate, { month: -1 }).getTime();
    const dtNm = toUTCDate(_valueDate, { month: 1 }).getTime();
    const dtPy = toUTCDate(_valueDate, { year: -1 }).getTime();
    const dtNy = toUTCDate(_valueDate, { year: 1 }).getTime();

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
}