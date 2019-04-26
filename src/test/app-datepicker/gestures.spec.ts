import { AppDatepicker, START_VIEW } from '../../app-datepicker';
import { makeNumberPrecise } from '../../datepicker-helpers';
import {
  date13,
  date15,
  defaultLocale,
} from '../test-config';
import {
  dragTo,
  forceUpdate,
  getShadowInnerHTML,
  getTestName,
  OptionsDragTo,
  queryInit,
  selectNewYearFromYearListView,
  setupDragPoint,
  triggerEvent,
} from '../test-helpers';

const {
  strictEqual,
  isNotNull,
  isTrue,
} = chai.assert;
const name = AppDatepicker.is;

describe(getTestName(name), () => {
  describe('gestures', () => {
    describe('navigating calendar by gestures', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`goes to next month`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        const btnYearSelectorEl = t.getBtnYearSelector();
        const btnCalendarSelectorEl = t.getBtnCalendarSelector();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl), '2020', `Year not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15', `Date not matched`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Calendar label not matched (${calendarLabel})`);

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl), '2020', `Year not updated`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15', `Date not updated`);

        const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
          `Calendar label not updated (${newCalendarLabel})`);
      });

      it(`goes to previous month`, async () => {
        el.min = date13;
        el.value = '2020-05-13';
        await forceUpdate(el);

        const prevBtnMonthSelectorEl = t.getBtnPrevMonthSelector();
        const btnYearSelectorEl = t.getBtnYearSelector();
        const btnCalendarSelectorEl = t.getBtnCalendarSelector();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl), '2020', `Year not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13', `Date not matched`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        isTrue(
          ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
          `Calendar label not matched (${calendarLabel})`);

        triggerEvent(prevBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl), '2020', `Year not updated`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13', `Date not updated`);

        const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
          `Calendar label not updated (${newCalendarLabel})`);
      });

      it(`switches to ${START_VIEW.YEAR_LIST} view`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        const btnYearSelectorEl = t.getBtnYearSelector();
        const btnYearSelectorLabel = getShadowInnerHTML(btnYearSelectorEl);
        strictEqual(
          btnYearSelectorLabel,
          '2020',
          `Year selector label not matched`);

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        const newSelectedYearLabel = getShadowInnerHTML(
          t.getYearListViewListItemYearSelectedDiv());
        isNotNull(t.getYearListViewFullList());
        strictEqual(
          newSelectedYearLabel, '2020', `Year not updated`);

        triggerEvent(t.getBtnCalendarSelector(), 'click');
        await forceUpdate(el);

        const newBtnYearSelectorLabel = getShadowInnerHTML(t.getBtnYearSelector());
        strictEqual(
          newBtnYearSelectorLabel, '2020', `Year not updated`);

        const newBtnCalendarSelectorLabel = getShadowInnerHTML(t.getBtnCalendarSelector());
        strictEqual(
          newBtnCalendarSelectorLabel,
          'Wed, Jan 15',
          `Calendar selector label not updated`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`restores to focused date when switches back to calendar view`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        let runClick = 3;
        while (runClick) {
          triggerEvent(t.getBtnNextMonthSelector(), 'click');
          await t.waitForDragAnimationFinished();
          runClick -= 1;
        }

        triggerEvent(t.getBtnYearSelector(), 'click');
        await forceUpdate(el);

        triggerEvent(t.getBtnCalendarSelector(), 'click');
        await forceUpdate(el);

        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()), '2020', `Year not updated`);
        strictEqual(
          getShadowInnerHTML(t.getBtnCalendarSelector()), 'Wed, Jan 15', `Date not updated`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Calendar label not matched (${calendarLabel})`);
      });

      it(`switches back to calendar view with new selected year`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        let runClick = 3;
        while (runClick) {
          triggerEvent(t.getBtnNextMonthSelector(), 'click');
          await t.waitForDragAnimationFinished();
          runClick -= 1;
        }

        triggerEvent(t.getBtnYearSelector(), 'click');
        await forceUpdate(el);

        selectNewYearFromYearListView(el, '2025');
        await forceUpdate(el);

        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()), '2025', `Year not updated`);
        strictEqual(
          getShadowInnerHTML(t.getBtnCalendarSelector()),
          'Wed, Jan 15',
          `Focused date should remain unchanged`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2025', 'January, 2025', 'January 2025'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`goes to next month by dragging/ swiping calendar`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        const btnYearSelectorEl = t.getBtnYearSelector();
        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `First year selector text not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, Jan 15',
          `First calendar selector text not matched`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `First calendar label not matched (${calendarLabel})`);

        const startingPoint = setupDragPoint('left', el);
        const dragOptions: OptionsDragTo = { ...startingPoint, dx: -50 };
        await dragTo(calendarViewFullCalendarEl, dragOptions);
        await t.waitForDragAnimationFinished();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `Year selector text should not change`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, Jan 15',
          `Calendar selector text should not change`);

        const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
          `Calendar label not updated (${newCalendarLabel})`);
      });

      it(`goes to previous month by dragging/ swiping calendar`, async () => {
        el.min = date13;
        el.value = '2020-05-13';
        await forceUpdate(el);

        const btnYearSelectorEl = t.getBtnYearSelector();
        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `First year selector text not matched`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, May 13',
          `First calendar selector text not matched`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        isTrue(
          ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
          `First calendar label not matched (${calendarLabel})`);

        const startingPoint = setupDragPoint('right', el);
        const dragOptions: OptionsDragTo = { ...startingPoint, dx: 50 };
        await dragTo(calendarViewFullCalendarEl, dragOptions);
        await t.waitForDragAnimationFinished();

        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `Year selector text should not change`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, May 13',
          `Calendar selector text should not change`);

        const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
          `Calendar label not updated (${newCalendarLabel})`);
      });

    });

    describe('navigating year list by button', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`navigates to year list by button`, async () => {
        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());

        strictEqual(
          el.startView,
          START_VIEW.CALENDAR,
          `Initial 'startView' is not ${START_VIEW.CALENDAR}`);
        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()),
          '2020',
          `Initial year selector label not matched`);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Initial calendar label not matched (${calendarLabel})`);

        const btnYearSelectorEl = t.getBtnYearSelector();

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
        isTrue(t.getCalendarLabel() == null, `No calendar should render`);
        isNotNull(t.getYearListViewFullList(), `Year list view should render`);

        const selectedYearEl = t.getYearListViewListItemYearSelectedDiv();
        isNotNull(selectedYearEl, `Selected year not found`);
        strictEqual(
          getShadowInnerHTML(selectedYearEl), '2020', `Selected year label not matched`);
      });

      it(`selects new year by button`, async () => {
        const btnYearSelectorEl = t.getBtnYearSelector();

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
        isTrue(t.getCalendarLabel() == null, `No calendar should render`);
        isNotNull(t.getYearListViewFullList(), `Year list view should render`);

        selectNewYearFromYearListView(el, '2025');
        await forceUpdate(el);

        const newBtnYearSelectorEl = t.getBtnYearSelector();

        isNotNull(newBtnYearSelectorEl, `Year selector button not found`);
        strictEqual(el.startView, START_VIEW.CALENDAR, `Calendar should render`);
        strictEqual(
          getShadowInnerHTML(newBtnYearSelectorEl),
          '2025',
          `Selected year not updated`);
      });

    });

    describe('focusing new date by gestures', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`focuses correct date by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        strictEqual(el.value, '2020-01-22', `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Wed, Jan 22',
          `Calendar selector label not matched`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);
        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          '22',
          `Focused date label not updated`);
      });

      it(`focuses date on new month by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched`);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Feb 25, 2020')!;
        isNotNull(newCalendarDay, `New calendar day not found`);

        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        strictEqual(el.value, '2020-02-25', `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Tue, Feb 25',
          `Calendar selector label not matched`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv()!;
        isNotNull(newFocusedDateLabelEl, 'New focused date not found');

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl);
        strictEqual(
          newFocusedDateLabel,
          '25',
          `Focused date label not updated`);
      });

      it(`does not show calendar month that is < 'min'`, async () => {
        /**
         * NOTE: This indirectly comprises 2 kind of tests:
         *
         * 1. Spam clicks on navigate previous button
         * 2. New selected date will always be > `min` in terms of calendar month
         */
        el.min = date13;
        el.max = '';
        el.value = '2020-03-15';
        await forceUpdate(el);

        const prevBtnMonthSelectorEl = t.getBtnPrevMonthSelector();
        isNotNull(prevBtnMonthSelectorEl, `Prev month selector button not found`);

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(prevBtnMonthSelectorEl, 'click');
        }
        await t.waitForDragAnimationFinished();

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Sun, Mar 15',
          `Calendar selector label not matched`);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`does not show calendar month that is > 'max'`, async () => {
        /**
         * NOTE: This indirectly comprises 2 kind of tests:
         *
         * 1. Spam clicks on navigate next button
         * 2. New selected date will always be < `max` in terms of calendar month
         */
        el.min = '';
        el.max = '2020-12-13';
        el.value = '2020-10-15';
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(nextBtnMonthSelectorEl, 'click');
        }
        await t.waitForDragAnimationFinished();

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Thu, Oct 15',
          `Calendar selector label not matched`);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Dec 2020', 'December, 2020', 'December 2020'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`show correct calendar month when spam clicks on navigate next button`, async () => {
        /**
         * NOTE: This indirectly comprises 2 kind of tests:
         *
         * 1. Spam clicks on navigate previous button
         * 2. New selected date will always be > `min` in terms of calendar month
         */
        el.min = date13;
        el.max = '';
        el.value = '2020-03-15';
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Prev month selector button not found`);

        for (let i = 0; i < 13; i += 1) {
          triggerEvent(nextBtnMonthSelectorEl, 'click');
        }
        await t.waitForDragAnimationFinished();

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Sun, Mar 15',
          `Calendar selector label not matched`);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Apr 2021', 'April, 2021', 'April 2021'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`shows correct calendar month when spam clicks on navigate prev button`, async () => {
        /**
         * NOTE: This indirectly comprises 2 kind of tests:
         *
         * 1. Spam clicks on navigate previous button
         * 2. New selected date will always be < `max` in terms of calendar month
         */
        el.min = '2000-01-01';
        el.max = '2020-12-13';
        el.value = '2020-03-15';
        await forceUpdate(el);

        const prevBtnMonthSelectorEl = t.getBtnPrevMonthSelector();
        isNotNull(prevBtnMonthSelectorEl, `Prev month selector button not found`);

        for (let i = 0; i < 13; i += 1) {
          triggerEvent(prevBtnMonthSelectorEl, 'click');
        }
        await t.waitForDragAnimationFinished();

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          'Sun, Mar 15',
          `Calendar selector label not matched`);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Feb 2019', 'February, 2019', 'February 2019'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);
      });

      it(`shows the correct calendar month`, async () => {
        /**
         * NOTE: This tests `computeThreeCalendarsInARow` to ensure it computes the correct
         * calendar months for situation like 2019-03-31 -> next month -> 2019-04-31 (not exist!).
         */
        el.min = date13;
        el.max = '';
        el.value = '2020-01-31';
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        const expected = [
          ['Feb 2020', 'February, 2020', 'February 2020'],
          ['Mar 2020', 'March, 2020', 'March 2020'],
        ];
        for (let i = 0; i < 2; i += 1) {
          triggerEvent(nextBtnMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();

          const btnCalendarSelectorEl = t.getBtnCalendarSelector();
          isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

          strictEqual(
            getShadowInnerHTML(btnCalendarSelectorEl),
            'Fri, Jan 31',
            `Calendar selector label not matched`);

          const calendarLabelEl = t.getCalendarLabel();
          isNotNull(calendarLabelEl, 'Calendar label not found');

          const calendarLabel = getShadowInnerHTML(calendarLabelEl);
          /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
          isTrue(
            expected[i].some(n => calendarLabel === n),
            `Calendar label not updated (${calendarLabel})`);
        }

      });

      it(`focuses '_min' when updating year from month < that of '_min'`, async () => {
        const updateYear = async (year: string) => {
          const btnYearSelector = t.getBtnYearSelector();
          isNotNull(btnYearSelector, `Year selector not found`);

          triggerEvent(btnYearSelector, 'click');
          await forceUpdate(el);

          const yearListViewFullList = t.getYearListViewFullList();
          isNotNull(yearListViewFullList, `Year list view full list not found`);

          selectNewYearFromYearListView(el, year);
          await forceUpdate(el);

          const btnYearSelectorLabel = getShadowInnerHTML(btnYearSelector);
          strictEqual(btnYearSelectorLabel, year, `Year selector label not updated`);
        };
        const verifyDate = (e: string[], e1: string, e2: string) => {
          const calendarLabel = t.getCalendarLabel();
          isNotNull(calendarLabel, `Calendar label not found`);

          const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
          /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
          isTrue(
            e.some(n => newCalendarLabel === n),
            `Calendar label not updated (${newCalendarLabel})`);

          const btnCalendarSelector = t.getBtnCalendarSelector();
          isNotNull(btnCalendarSelector, `Calendar selector not found`);
          strictEqual(getShadowInnerHTML(btnCalendarSelector), e1);

          const focusedDateDiv = t.getDatepickerBodyCalendarViewDayFocusedDiv()!;
          isNotNull(focusedDateDiv, `Focused date not found`);
          strictEqual(
            getShadowInnerHTML(focusedDateDiv), e2, `New focused not updated`);
        };

        el.min = '2020-04-13';
        el.value = '2020-04-25';
        await forceUpdate(el);
        await updateYear('2021');

        const btnPrevMonthSelector = t.getBtnPrevMonthSelector();
        isNotNull(btnPrevMonthSelector, 'Prev month selector button not found');

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(btnPrevMonthSelector, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);

        const selectableDate = t.getSelectableDate('Jan 15, 2021');
        isNotNull(selectableDate, `Selectable date not found`);

        triggerEvent(selectableDate, 'click');
        await forceUpdate(el);

        verifyDate(['Jan 2021', 'January, 2021', 'January 2021'], 'Fri, Jan 15', '15');

        await updateYear('2020');

        verifyDate(['Apr 2020', 'April, 2020', 'April 2020'], 'Mon, Apr 13', '13');

      });

      it(`shows the correct calendar month with '_max'`, async () => {
        /**
         * NOTE: This tests `_updateMonth` works correctly on condition check for max date.
         */
        el.min = '2000-01-15';
        el.max = '2020-10-15';
        el.value = '2019-08-13';
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(nextBtnMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Nov 2019', 'November, 2019', 'November 2019'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);

      });

    });

    describe('landscape', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      const testCalendarLabel = (testName: string, e: string[]) => {
        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, `Calendar label ${testName} not found`);

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          e.some(n => calendarLabel === n),
          `Calendar label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'} (${calendarLabel})`);
      };
      const dragCalendar = async (
        testName: string,
        dir: 'left' | 'right',
        dx: number,
        times: number
      ) => {
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(
          calendarViewFullCalendarEl, `Calendar view full calendar ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          const startingPoint = setupDragPoint(dir, el);
          const dragOptions: OptionsDragTo = { ...startingPoint, dx };
          await dragTo(calendarViewFullCalendarEl, dragOptions);
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        el.landscape = true;
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`updates calendar correctly`, async () => {
        const goNextMonth = async (testName: string, times: number) => {
          const btnNextMonthSelectorEl = t.getBtnNextMonthSelector();
          isNotNull(btnNextMonthSelectorEl, `Next month button ${testName} not found`);

          for (let i = 0; i < times; i += 1) {
            triggerEvent(btnNextMonthSelectorEl, 'click');
            await t.waitForDragAnimationFinished();
          }
          await forceUpdate(el);
        };
        const goPrevMonth = async (testName: string, times: number) => {
          const btnPrevMonthSelectorEl = t.getBtnPrevMonthSelector();
          isNotNull(btnPrevMonthSelectorEl, `Next month button ${testName} not found`);

          for (let i = 0; i < times; i += 1) {
            triggerEvent(btnPrevMonthSelectorEl, 'click');
            await t.waitForDragAnimationFinished();
          }
          await forceUpdate(el);
        };
        const goYearListView = async (testName: string) => {
          const btnYearSelectorEl = t.getBtnYearSelector();
          isNotNull(btnYearSelectorEl, `Year selector ${testName} not found`);

          triggerEvent(btnYearSelectorEl, 'click');
          await forceUpdate(el);
        };

        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);
        await goYearListView('1');

        selectNewYearFromYearListView(el, '2021');
        await forceUpdate(el);

        testCalendarLabel('2', ['Jan 2021', 'January, 2021', 'January 2021']);
        await goNextMonth('1', 3);

        testCalendarLabel('3', ['Apr 2021', 'April, 2021', 'April 2021']);
        await dragCalendar('1', 'right', 60, 2);

        testCalendarLabel('4', ['Feb 2021', 'February, 2021', 'February 2021']);
        await goYearListView('2');

        selectNewYearFromYearListView(el, '2020');
        await forceUpdate(el);

        testCalendarLabel('5', ['Jan 2020', 'January, 2020', 'January 2020']);
        await goNextMonth('2', 2);
        testCalendarLabel('6', ['Mar 2020', 'March, 2020', 'March 2020']);

        await goPrevMonth('1', 2);
        testCalendarLabel('7', ['Jan 2020', 'January, 2020', 'January 2020']);
      });

      it(`resets 'style' attribute when dragging ends`, async () => {
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);
        await dragCalendar('1', 'left', -60, 2);
        testCalendarLabel('2', ['Mar 2020', 'March, 2020', 'March 2020']);

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

        isNotNull(calendarViewFullCalendarEl, `Calendar view full calendar not found`);
        strictEqual(calendarViewFullCalendarEl.style.minWidth, '', `'minWidth' not reset`);
        strictEqual(calendarViewFullCalendarEl.style.width, '', `'width' not reset`);
      });

      it(`updates full calendar's position when 'landscape' changes`, async () => {
        const getComputedWidth = (elem: HTMLElement) => {
          const width = elem.getBoundingClientRect().width;
          return makeNumberPrecise(width);
        };

        isTrue(el.landscape, `'landscape' not matched`);
        isTrue(el.hasAttribute('landscape'), `'landscape' attribute not set`);

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view full calendar not found`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Datepicker body calendar view not found`);

        strictEqual(
          calendarViewFullCalendarEl.style.transform,
          `translate3d(-${getComputedWidth(datepickerBodyCalendarViewEl)}px, 0px, 0px)`,
          `CSS 'transform' not matched`);

        el.landscape = false;
        await forceUpdate(el);

        isTrue(!el.landscape, `'landscape' not updated`);
        isTrue(!el.hasAttribute('landscape'), `'landscape' attribute not reset`);

        strictEqual(
          calendarViewFullCalendarEl.style.transform,
          `translate3d(-${getComputedWidth(datepickerBodyCalendarViewEl)}px, 0px, 0px)`,
          `CSS 'transform' not updated`);
      });

    });

    describe('multiple properties/ attributes', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      const testCalendarLabel = (testName: string, e: string[]) => {
        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, `Calendar label ${testName} not found`);

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          e.some(n => calendarLabel === n),
          `Calendar label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'} (${calendarLabel})`);
      };
      const dragCalendar = async (
        testName: string,
        dir: 'left' | 'right',
        dx: number,
        times: number
      ) => {
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(
          calendarViewFullCalendarEl, `Calendar view full calendar ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          const startingPoint = setupDragPoint(dir, el);
          const dragOptions: OptionsDragTo = { ...startingPoint, dx };
          await dragTo(calendarViewFullCalendarEl, dragOptions);
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };
      const goNextMonth = async (testName: string, times: number) => {
        const btnNextMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(btnNextMonthSelectorEl, `Next month button ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          triggerEvent(btnNextMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`resets calendar when updating 'value' and 'firstDayOfWeek'`, async () => {
        strictEqual(el.value, '2020-01-15', `'value' not matched`);
        strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('1', 1);
        await dragCalendar('1', 'left', -60, 2);
        await forceUpdate(el);

        testCalendarLabel('2', ['Apr 2020', 'April, 2020', 'April 2020']);

        el.firstDayOfWeek = 2;
        el.value = date13;
        await forceUpdate(el);

        testCalendarLabel('3', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('2', 2);
        await forceUpdate(el);

        testCalendarLabel('4', ['Mar 2020', 'March, 2020', 'March 2020']);
      });

      it(`resets calendar when 'value' and 'firstdayofweek' attributes are set`, async () => {
        strictEqual(el.value, '2020-01-15', `'value' not matched`);
        strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('1', 1);
        await dragCalendar('1', 'left', -60, 2);
        await forceUpdate(el);

        testCalendarLabel('2', ['Apr 2020', 'April, 2020', 'April 2020']);

        el.setAttribute('firstdayofweek', '2');
        el.setAttribute('value', date13);
        await forceUpdate(el);

        strictEqual(el.firstDayOfWeek, 2, `'firstDayOfWeek' not updated`);
        strictEqual(el.value, '2020-01-13', `'value' not updated`);
        testCalendarLabel('3', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('2', 2);
        await forceUpdate(el);

        testCalendarLabel('4', ['Mar 2020', 'March, 2020', 'March 2020']);
      });

    });

  });
});
