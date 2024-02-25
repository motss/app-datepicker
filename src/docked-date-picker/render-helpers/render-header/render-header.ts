import '@material/web/iconbutton/icon-button.js';
import '@material/web/button/text-button.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import { html, nothing } from 'lit';

import { iconChevronLeft, iconChevronRight } from '../../../icons.js';
import { renderMenuButton } from '../../../render-helpers/render-menu-button/render-menu-button.js';
import type { RenderHeaderClickType, RenderHeaderInit } from './types.js';

const shortMonthFormat = (locale: string) => new Intl.DateTimeFormat(locale, { month: 'short' }).format;
const yearFormat = (locale: string) => new Intl.DateTimeFormat(locale, { year: 'numeric' }).format;
const offsetByType = { dec: -1, inc: 1, menu: 0 } as const;

interface Dataset extends DOMStringMap {
  type: RenderHeaderClickType;
}

const toOnClickWithType = (date: Date, callback: RenderHeaderInit['onMonthClick']) => (ev: MouseEvent) => {
  const { type } = (ev.currentTarget as HTMLButtonElement).dataset as Dataset;
  const offset = offsetByType[type];

  callback?.({
    date: toUTCDate(date, { month: offset }),
    type,
  });
};

export function renderHeader({
  date,
  locale,
  max,
  min,
  nextMonthButtonLabel,
  nextYearButtonLabel,
  onMonthClick,
  onYearClick,
  prevMonthButtonLabel,
  prevYearButtonLabel,
}: RenderHeaderInit) {
  const monthLabel = shortMonthFormat(locale)(date);
  const yearLabel = yearFormat(locale)(date);
  const onMonthClickWithType = toOnClickWithType(date, onMonthClick);
  const onYearClickWithType = toOnClickWithType(date, onYearClick);

  const mit = fromPartsToUtcDate(min.getUTCFullYear(), min.getUTCMonth(), 1).getTime();
  const mat = fromPartsToUtcDate(max.getUTCFullYear(), max.getUTCMonth(), 1).getTime();

  // min: 2020 01 02 > 2020 01 01
  // max: 2020 10 10 > 2020 10 01
  // d: 2020 02 02 > 2020 02 01
  // < 02 > < 2020 >
  const dt_pm = toUTCDate(date, { month: -1 }).getTime();
  const dt_nm = toUTCDate(date, { month: 1 }).getTime();
  const dt_py = toUTCDate(date, { year: -1 }).getTime();
  const dt_ny = toUTCDate(date, { year: 1 }).getTime();

  const showPrevMonthButton = dt_pm > mit;
  const showNextMonthButton = dt_nm > mit && dt_nm < mat;
  const showNextYearButton = dt_py > mit && dt_py < mat;
  const showPrevYearButton = dt_ny < mat;

  console.debug({
    dt_pm,
    // eslint-disable-next-line perfectionist/sort-objects
    dt_nm,
    dt_py,
    // eslint-disable-next-line perfectionist/sort-objects
    dt_ny,
    showPrevMonthButton,
    // eslint-disable-next-line perfectionist/sort-objects
    showNextMonthButton,
    showPrevYearButton,
    // eslint-disable-next-line perfectionist/sort-objects
    showNextYearButton,
    // eslint-disable-next-line perfectionist/sort-objects
    min,
    // eslint-disable-next-line perfectionist/sort-objects
    max,
  });

  return html`
  <div class=header>
    ${showPrevMonthButton ? html`<md-icon-button class=prevMonth data-type=dec @click=${onMonthClickWithType} aria-label=${prevMonthButtonLabel} title=${prevMonthButtonLabel}>${iconChevronLeft}</md-icon-button>` : nothing}
    ${renderMenuButton({ className: 'month', label: monthLabel, onClick: onMonthClickWithType, text: monthLabel, type: 'menu' })}
    ${showNextMonthButton ? html`<md-icon-button class=nextMonth data-type=inc @click=${onMonthClickWithType} aria-label=${nextMonthButtonLabel} title=${nextMonthButtonLabel}>${iconChevronRight}</md-icon-button>` : nothing}

    ${showPrevYearButton ? html`<md-icon-button class=prevYear data-type=dec @click=${onYearClickWithType} aria-label=${prevYearButtonLabel} title=${prevYearButtonLabel}>${iconChevronLeft}</md-icon-button>` : nothing}
    ${renderMenuButton({ className: 'year', label: yearLabel, onClick: onYearClickWithType, text: yearLabel, type: 'menu' })}
    ${showNextYearButton ? html`<md-icon-button class=nextYear data-type=inc @click=${onYearClickWithType} aria-label=${nextYearButtonLabel} title=${nextYearButtonLabel}>${iconChevronRight}</md-icon-button>` : nothing}
  </div>
  `;
}
