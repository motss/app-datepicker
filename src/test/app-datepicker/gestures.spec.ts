import { AppDatepicker } from '../../app-datepicker';
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
  queryInit,
  selectNewYearFromYearListView,
  setupDragPoint,
  triggerEvent,
} from '../test-helpers';

import { START_VIEW } from '../../app-datepicker';
import { OptionsDragTo } from '../test-helpers';

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

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Calendar label not matched (${calendarLabel})`);

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, Jan 15');

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

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        isTrue(
          ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
          `Calendar label not matched (${calendarLabel})`);

        triggerEvent(prevBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        strictEqual(getShadowInnerHTML(btnYearSelectorEl), '2020');
        strictEqual(getShadowInnerHTML(btnCalendarSelectorEl), 'Wed, May 13');

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
          `Year selector label not matched (${btnYearSelectorLabel})`);

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        const newSelectedYearLabel = getShadowInnerHTML(
          t.getYearListViewListItemYearSelectedDiv());
        isNotNull(t.getYearListViewFullList());
        strictEqual(
          newSelectedYearLabel,
          '2020',
          `New selected year label not matched (${newSelectedYearLabel})`);

        triggerEvent(t.getBtnCalendarSelector(), 'click');
        await forceUpdate(el);

        const newBtnYearSelectorLabel = getShadowInnerHTML(t.getBtnYearSelector());
        strictEqual(
          newBtnYearSelectorLabel,
          '2020',
          `New year selector label not matched (${newBtnYearSelectorLabel})`);

        const newBtnCalendarSelectorLabel = getShadowInnerHTML(t.getBtnCalendarSelector());
        strictEqual(
          newBtnCalendarSelectorLabel,
          'Wed, Jan 15',
          `New calendar selector label not matched (${newBtnCalendarSelectorLabel})`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `New calendar label not matched (${calendarLabel})`);
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

        strictEqual(getShadowInnerHTML(t.getBtnYearSelector()), '2020');
        strictEqual(getShadowInnerHTML(t.getBtnCalendarSelector()), 'Wed, Jan 15');

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n));
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

        strictEqual(getShadowInnerHTML(t.getBtnYearSelector()), '2025');
        strictEqual(getShadowInnerHTML(t.getBtnCalendarSelector()), 'Tue, Apr 15');

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(['Apr 2025', 'April, 2025', 'April 2025'].some(n => calendarLabel === n));
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
          `New calendar label not updated (${newCalendarLabel})`);
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
          `New calendar label not updated (${newCalendarLabel})`);
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
        const btnYearSelectorLabel = getShadowInnerHTML(t.getBtnYearSelector());

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

        const btnYearSelectorEl = t.getBtnYearSelector();

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        strictEqual(el.startView, START_VIEW.YEAR_LIST, `'startView' not updated`);
        isTrue(t.getCalendarLabel() == null, `No calendar should render`);
        isNotNull(t.getYearListViewFullList(), `Year list view should render`);

        const selectedYearEl = t.getYearListViewListItemYearSelectedDiv();
        isNotNull(selectedYearEl, `Selected year not found`);
        strictEqual(getShadowInnerHTML(selectedYearEl), '2020', `Selected year label not matched`);
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
          `New selected year not matched`);
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
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        strictEqual(el.value, '2020-01-22', `New focused date not updated (${el.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

      it(`focuses date on new month by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await t.waitForDragAnimationFinished();

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Feb 25, 2020')!;
        isNotNull(newCalendarDay, `New calendar day not found`);

        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        strictEqual(el.value, '2020-02-25', `New focused date not updated (${el.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Tue, Feb 25',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv()!;
        isNotNull(newFocusedDateLabelEl, 'New focused date not found');

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl);
        strictEqual(
          newFocusedDateLabel,
          '25',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

    });
  });
});
