type DragDirection = 'left' | 'right';

import { AppDatepicker } from '../../app-datepicker';

import {
  getShadowInnerHTML,
  shadowQuery,
  shadowQueryAll,
  triggerEvent,
} from '../test-helpers';

export const getBtnNextMonthSelector =
  (n: AppDatepicker) => shadowQuery(n, '.btn__month-selector[aria-label="Next month"]');
export const getBtnPrevMonthSelector =
  (n: AppDatepicker) => shadowQuery(n, '.btn__month-selector[aria-label="Previous month"]');
export const getBtnYearSelectorEl =
  (n: AppDatepicker) => shadowQuery(n, '.btn__year-selector');
export const getBtnCalendarSelectorEl =
  (n: AppDatepicker) => shadowQuery(n, '.btn__calendar-selector');
export const getCalendarLabelEl =
  (n: AppDatepicker) => shadowQuery(n, '.calendar-container:nth-of-type(2) .calendar-label');
export const waitForDragAnimationFinished =
  (n: AppDatepicker) => new Promise(yay =>
    requestAnimationFrame(() => setTimeout(() => yay(n.updateComplete), 1e3)));
export const getYearListViewFullListEl =
  (n: AppDatepicker) => shadowQuery(n, '.year-list-view__full-list');
export const getYearListViewListItemYearSelectedEl =
  (n: AppDatepicker) => shadowQuery(n, '.year-list-view__list-item.year--selected > div');
export const getDatepickerBodyCalendarViewEl =
  (n: AppDatepicker) => shadowQuery(n, '.datepicker-body__calendar-view[tabindex="0"]');
export const getDatepickerBodyCalendarViewDayFocusedEl =
  (n: AppDatepicker) => shadowQuery(n, '.calendar-container:nth-of-type(2)')
    .querySelector('.full-calendar__day:not(.day--disabled).day--focused > div');

export const selectNewYearFromYearListView =
  (n: AppDatepicker, y: string) => {
    const allSelectableYearItems =
      shadowQueryAll(n, '.year-list-view__list-item:not(.year--selected)');
    const matched =
      allSelectableYearItems.find(o => y === getShadowInnerHTML(o.querySelector('div')!));

    triggerEvent(matched!, 'click');
  };
export const setupDragPoint = (direction: DragDirection, el: HTMLElement) => {
  const datepickerRect = el.getBoundingClientRect();
  const calendarRect = shadowQuery(el, '.calendar-view__full-calendar').getBoundingClientRect();

  const lFactor = 'left' === direction ? .78 : .22;
  const left = datepickerRect.left + (datepickerRect.width * lFactor);
  const top = calendarRect.top + (calendarRect.height * .22);

  return { x: left, y: top };
};
