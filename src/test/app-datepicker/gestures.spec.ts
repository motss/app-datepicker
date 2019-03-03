import { AppDatepicker, START_VIEW } from '../../app-datepicker';
import { OptionsDragTo } from '../test-helpers';

import {
  date13,
  date15,
  defaultLocale,
} from '../test-config';
import {
  dragTo,
  getinnerHTML,
  getShadowInnerHTML,
  shadowQuery,
  triggerEvent,
} from '../test-helpers';
import {
  getBtnCalendarSelectorEl,
  getBtnNextMonthSelector,
  getBtnPrevMonthSelector,
  getBtnYearSelectorEl,
  getCalendarLabelEl,
  getDatepickerBodyCalendarViewDayFocusedEl,
  getYearListViewFullListEl,
  getYearListViewListItemYearSelectedEl,
  selectNewYearFromYearListView,
  setupDragPoint,
  waitForDragAnimationFinished,
} from './helpers';

const {
  strictEqual,
  isNotNull,
  isTrue,
} = chai.assert;

describe('app-datepicker', () => {
  describe('gestures', () => {
    describe('navigating calendar by gestures', () => {
      let el: AppDatepicker;

      beforeEach(async () => {
        el = document.createElement('app-datepicker') as AppDatepicker;
        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;

        document.body.appendChild(el);

        await el.updateComplete;
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`goes to next month`, async () => {
        el.min = date13;
        el.value = date15;
        await el.updateComplete;

        const nextBtnMonthSelectorEl = getBtnNextMonthSelector(el);
        const btnYearSelectorEl = getBtnYearSelectorEl(el);
        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await waitForDragAnimationFinished(el);

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

        const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n));
      });

      it(`goes to previous month`, async () => {
        el.min = date13;
        el.value = '2020-05-13';
        await el.updateComplete;

        const prevBtnMonthSelectorEl = getBtnPrevMonthSelector(el);
        const btnYearSelectorEl = getBtnYearSelectorEl(el);
        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        isTrue(['May, 2020', 'May 2020'].some(n => calendarLabel === n));

        triggerEvent(prevBtnMonthSelectorEl, 'click');
        await waitForDragAnimationFinished(el);

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

        const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n));
      });

      it(`switches to ${START_VIEW.YEAR_LIST} view`, async () => {
        el.min = date13;
        el.value = date15;
        await el.updateComplete;

        const btnYearSelectorEl = getBtnYearSelectorEl(el);

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');

        triggerEvent(btnYearSelectorEl, 'click');
        await el.updateComplete;

        isNotNull(getYearListViewFullListEl(el));
        strictEqual(
          getShadowInnerHTML(getYearListViewListItemYearSelectedEl(el)), '2020');

        triggerEvent(getBtnCalendarSelectorEl(el), 'click');
        await el.updateComplete;

        strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2020');
        strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Wed, Jan 15');

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));
      });

      it(`restores to focused date when switches back to calendar view`, async () => {
        el.min = date13;
        el.value = date15;
        await el.updateComplete;

        let runClick = 3;
        while (runClick) {
          triggerEvent(getBtnNextMonthSelector(el), 'click');
          await waitForDragAnimationFinished(el);
          runClick -= 1;
        }

        triggerEvent(getBtnYearSelectorEl(el), 'click');
        await el.updateComplete;

        triggerEvent(getBtnCalendarSelectorEl(el), 'click');
        await el.updateComplete;

        strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2020');
        strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Wed, Jan 15');

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));
      });

      it(`switches back to calendar view with new selected year`, async () => {
        el.min = date13;
        el.value = date15;
        await el.updateComplete;

        let runClick = 3;
        while (runClick) {
          triggerEvent(getBtnNextMonthSelector(el), 'click');
          await waitForDragAnimationFinished(el);
          runClick -= 1;
        }

        triggerEvent(getBtnYearSelectorEl(el), 'click');
        await el.updateComplete;

        selectNewYearFromYearListView(el, '2025');
        await el.updateComplete;

        strictEqual(getShadowInnerHTML(getBtnYearSelectorEl(el)), '2025');
        strictEqual(getShadowInnerHTML(getBtnCalendarSelectorEl(el)), 'Tue, Apr 15');

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Apr 2025', 'April, 2025', 'April 2025'].some(n => calendarLabel === n));
      });

      it(`goes to next month by dragging/ swiping calendar`, async () => {
        el.min = date13;
        el.value = date15;
        await el.updateComplete;

        const btnYearSelectorEl = getBtnYearSelectorEl(el);
        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
        const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `First year selector text not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, Jan 15',
          `First calendar selector text not matched`);

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `First calendar label not matched (${calendarLabel})`);

        const startingPoint = setupDragPoint('left', el);
        const dragOptions: OptionsDragTo = { ...startingPoint, dx: -50 };
        await dragTo(calendarViewFullCalendarEl, dragOptions);
        await waitForDragAnimationFinished(el);

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `Year selector text should not change`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, Jan 15',
          `Calendar selector text should not change`);

        const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
          `New calendar label not updated (${newCalendarLabel})`);
      });

      it(`goes to previous month by dragging/ swiping calendar`, async () => {
        el.min = date13;
        el.value = '2020-05-13';
        await el.updateComplete;

        const btnYearSelectorEl = getBtnYearSelectorEl(el);
        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
        const calendarViewFullCalendarEl = shadowQuery(el, '.calendar-view__full-calendar');

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `First year selector text not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, May 13',
          `First calendar selector text not matched`);

        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        isTrue(
          ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
          `First calendar label not matched (${calendarLabel})`);

        const startingPoint = setupDragPoint('right', el);
        const dragOptions: OptionsDragTo = { ...startingPoint, dx: 50 };
        await dragTo(calendarViewFullCalendarEl, dragOptions);
        await waitForDragAnimationFinished(el);

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `Year selector text should not change`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, May 13',
          `Calendar selector text should not change`);

        const newCalendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
          `New calendar label not updated (${newCalendarLabel})`);
      });

    });

    describe('navigating year list by button', () => {
      let el: AppDatepicker;

      beforeEach(async () => {
        el = document.createElement('app-datepicker') as AppDatepicker;
        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;

        document.body.appendChild(el);

        await el.updateComplete;
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`navigates to year list by button`, async () => {
        const calendarLabel = getShadowInnerHTML(getCalendarLabelEl(el));
        const btnYearSelectorLabel = getShadowInnerHTML(getBtnYearSelectorEl(el));

        strictEqual(
          el.startView,
          START_VIEW.CALENDAR,
          `Initial 'startView' is not ${START_VIEW.CALENDAR}`);
        strictEqual(
          btnYearSelectorLabel,
          '2020',
          `Initial year selector label not matched (${btnYearSelectorLabel})`);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Initial calendar label not matched (${calendarLabel})`);

        const btnYearSelectorEl = getBtnYearSelectorEl(el);

        triggerEvent(btnYearSelectorEl, 'click');
        await el.updateComplete;

        strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
        isTrue(getCalendarLabelEl(el) == null, `No calendar should render`);
        isNotNull(getYearListViewFullListEl(el), `Year list view should render`);

        const selectedYearEl = getYearListViewListItemYearSelectedEl(el);
        isNotNull(selectedYearEl, `Selected year not found`);
        strictEqual(getShadowInnerHTML(selectedYearEl), '2020', `Selected year label not matched`);
      });

      it(`selects new year by button`, async () => {
        const btnYearSelectorEl = getBtnYearSelectorEl(el);

        triggerEvent(btnYearSelectorEl, 'click');
        await el.updateComplete;

        strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
        isTrue(getCalendarLabelEl(el) == null, `No calendar should render`);
        isNotNull(getYearListViewFullListEl(el), `Year list view should render`);

        selectNewYearFromYearListView(el, '2025');
        await el.updateComplete;

        const newBtnYearSelectorEl = getBtnYearSelectorEl(el);

        isNotNull(newBtnYearSelectorEl, `Year selector button not found`);
        strictEqual(el.startView, START_VIEW.CALENDAR, `Calendar should render`);
        strictEqual(
          getShadowInnerHTML(newBtnYearSelectorEl),
          '2025',
          `New selected year not matched`);
      });

    });

    describe('focusing new date with gestures', () => {
      let el: AppDatepicker;

      beforeEach(async () => {
        el = document.createElement('app-datepicker') as AppDatepicker;
        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;

        document.body.appendChild(el);

        await el.updateComplete;
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`focuses correct date by gesture`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newFocusedDateEl =
          shadowQuery(el, '.calendar-container:nth-of-type(2)')
            .querySelector('.full-calendar__day:not(.day--disabled)[aria-label="Jan 22, 2020"]');
        triggerEvent(newFocusedDateEl as HTMLElement, 'click');
        await el.updateComplete;

        strictEqual(el.value, '2020-01-22', `New focused date not updated (${el.value})`);

        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

      it(`focuses date on new month by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const nextBtnMonthSelectorEl = getBtnNextMonthSelector(el);
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await waitForDragAnimationFinished(el);

        const newFocusedDateEl =
          shadowQuery(el, '.calendar-container:nth-of-type(2)')
            .querySelector('.full-calendar__day:not(.day--disabled)[aria-label="Feb 25, 2020"]');
        triggerEvent(newFocusedDateEl as HTMLElement, 'click');
        await el.updateComplete;

        strictEqual(el.value, '2020-02-25', `New focused date not updated (${el.value})`);

        const btnCalendarSelectorEl = getBtnCalendarSelectorEl(el);
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        const calendarSelectorLabel = getinnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Tue, Feb 25',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = getDatepickerBodyCalendarViewDayFocusedEl(el);
        isNotNull(newFocusedDateLabelEl, 'New focused date not found');

        const newFocusedDateLabel = getinnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '25',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

    });
  });
});
